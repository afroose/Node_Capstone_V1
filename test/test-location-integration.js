const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {locationId} = require('../models/locationModels');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config/config');

chai.use(chaiHttp);
function seedLocationData() {
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateLocationData());
  }
  // console.log(seedData)
  return locationId.insertMany(seedData);
}

function generateLocationName() {
  const locationName = [
    'Manhattan', 'Queens', 'Brooklyn', 'Bronx', 'Staten Island'];
  return locationName[Math.floor(Math.random() * locationName.length)];
}

function generateLocationData() {
  return {
    locationName: generateLocationName(),
    address: {
      city: faker.address.city(),
      street: faker.address.streetName(),
      building: faker.address.streetAddress(),
      state: faker.address.stateAbbr(),
      zipcode: faker.address.zipCode()
    }
  }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Locations API resource', function() {

  before(function() {
    console.log("test database" + TEST_DATABASE_URL)
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    console.log("Create seed data start");
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
              'id', 'locationName', 'address');
          });
          reslocationId = res.body.locations[0];
          return locationId.findById(reslocationId.id);
        })
        .then(function(location) {

          reslocationId.id.should.equal(location.id);
          reslocationId.locationName.should.equal(location.locationName);
          reslocationId.address.should.contain(location.address.street);
        });
    });
  });

});
