const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const {locationId} = require('../models/locationModels');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedLocationData() {
  console.info('seeding Location data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateLocationData());
  }
  // this will return a promise
  return Location.insertMany(seedData);
}

// used to generate data to put in db
function generateLocationName() {
  const LocationName = [
    'Manhattan', 'Queens', 'Brooklyn', 'Bronx', 'Staten Island'];
  return LocationName[Math.floor(Math.random() * LocationName.length)];
}

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data
function generateLocationData() {
  return {
    LocationName: generateLocationNameName(),
    address: {
      city: faker.address.city(),
      street: faker.address.streetName(),
      building: faker.address.streetAddress(),
      state: faker.address.stateAbbr(),
      zipcode: faker.address.zipCode()
    }
  }
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Locations API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedRestaurantData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedLocationData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function() {

    it('should return all existing Locations', function() {
      // strategy:
      //    1. get back all Locations returned by by GET request to `/location`
      //    2. prove res has right status, data type
      //    3. prove the number of locations we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/location')
        .then(function(_res) {
          // so subsequent .then blocks can access resp obj.
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.locations.should.have.length.of.at.least(1);
          return locationId.count();
        })
        .then(function(count) {
          res.body.locations.should.have.length.of(count);
        });
    });


    it('should return locations with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let reslocationId;
      return chai.request(app)
        .get('/location')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.locations.should.be.a('array');
          res.body.locations.should.have.length.of.at.least(1);

          res.body.locations.forEach(function(location) {
            location.should.be.a('object');
            location.should.include.keys(
              'id', 'name', 'address');
          });
          reslocationId = res.body.locations[0];
          return locationID.findById(reslocationId.id);
        })
        .then(function(location) {

          reslocationId.id.should.equal(location.id);
          reslocationId.name.should.equal(location.name);
          reslocationId.address.should.contain(location.address.building);
        });
    });
  });
});
