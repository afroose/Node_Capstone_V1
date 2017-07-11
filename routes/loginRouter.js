const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('client-sessions');
const expressValidator = require('express-validator');

const {userId} = require('../models/userModels');

const router = express.Router();

router.use(jsonParser);
router.use(expressValidator());

// set Sessions parameters

router.use(session({
  cookieName: 'session',
  secret: 'J35u!5n3@T0urc0!ng',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// session Middleware

const checkUserCookie = (req, res, next) => {
  let user;
  if (req.session && req.session.user) { // if session exists
    userId
        .findOne({ email: req.session.user.email }) // find user with email
        .exec()
        .then( _user => {
            user = _user;
            if (user) {
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
}

const requireLogin = (req,res,next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

router.use(checkUserCookie) 

// Users PAGE - show all users - do not use in production
router.get('/users', (req,res) => {
    userId
        .find()
        .exec()
        .then(users => {
          res.json(users);
        })
        .catch(
          err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
})

// GET user by id
router.get('/user/:id', (req, res) => {
  userId
    .findById(req.params.id)
    .exec()
    .then(user =>res.json(user))
    .catch(err => {
      console.error(err);
        res.status(404).json({message: 'User Not Found'})
    });
});

// Index page - Choose Login or Register
router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,"../views/index.html"));
})

// Index page - local login

router.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname,"../views/login.html"));
})

// Process login page

router.post('/login', (req, res) => { 
    let {email, user_password} = req.body;
    let user;
    userId
    .findOne({email: email}) // find user with email
    .exec()
    .then(_user =>{
        user = _user;
        if (!user) {
            console.log("no user");
            const message = `This user name does not exist`;
            //res.redirect(`/login?error=${message}" - redirect call"`); // redirect method
            return res.status(403).send(message); // ajax method
        }
        else {
            console.log(user.user_password);
            console.log(req.body.user_password);
            bcrypt.compare(req.body.user_password,user.user_password).then((passwordCheck) => {
                console.log(passwordCheck);
                if (passwordCheck === false) {
                    const message = `Incorrect password`
                    return res.status(403).send(message);
                }
                else {
                    // sets a cookie with the user's info
                    req.session.user = user;
                    const message = `${user.id}`
                    console.log(message);
                    console.log(`Successful Login`);
                    return res.status(200).send(message);
                }
            });
        }
        
    })
});

// with middleware

router.get('/home', requireLogin, (req,res) => {
    res.sendFile(path.join(__dirname,"../views/home.html"));
})    

// Register page - local signup

router.get('/register', (req,res) => {
  res.sendFile(path.join(__dirname,"../views/register.html"));
})

router.post('/register', (req, res) => { 
  console.log(req.body.user_password) ;

    const requiredFields = ['email', 'user_password', 'firstName', 'lastName', 'location'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
        }
    }

//  Validation

    let {email, user_password, user_password2, firstName, lastName, location} = req.body;

    req.checkBody('email', 'Email is required').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.checkBody('user_password', 'Password is required').notEmpty();
    req.checkBody('user_password2', 'Passwords do not match').equals(user_password);

//     req.getValidationResult().then(function(result) {
//   // do something with the validation result
//         if (!result.isEmpty()) {
//             console.log("validation created errors")
//         } else {
//             console.log("validation created errors")
//         }
//     });
    
        //let errors = req.getValidationResult();
        
        
    req.getValidationResult().then(function(result) {
  // do something with the validation result
        if (!result.isEmpty()) {
            console.log('There are errors');
            let errors = result.useFirstErrorOnly().array();
            console.log(errors)
            //const message = `Email is not valid`
            return res.status(409).send(errors[0].msg);
        } else {
            console.log('all good - no errors')
            userId
            .find({email}) // find user with email
            .count() // count > 0 if exists
            .exec()
            .then(count =>{
                if (count > 0) { // if user exists - close
                    console.log("already exist");
                    const message = `This user name is already taken`
                    return res.status(409).send(message);
                }
                return userId.hashPassword(user_password);
            })
            .then( // users does not exist - store user data in database
                newPassword => {
                    console.log(newPassword);
                    userId 
                        .create({
                        email: email,
                        user_password: newPassword,
                        location_id: location,
                        name: {
                            firstName: firstName,
                            lastName: lastName
                            }
                        })
                        .then(
                            res.sendFile(path.join(__dirname,"../views/login.html"))
                        ) 
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({message: 'Internal server error'});
                        })
                    }
            )
        }
    })
});

// DELETE endpoint

router.delete('/users/:id', (req, res) => {
  userId
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(userId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

module.exports = router;