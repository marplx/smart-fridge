const express = require('express');
const app = express();
const _ = require('lodash');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const DebtService = require('./services/debtService.js');
const UserService = require('./services/userService.js');
const PurchaseService = require('./services/purchaseService.js');
const PaymentService = require('./services/paymentService.js');
const MailService = require('./services/mailService.js');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const crypto = require('crypto');
const adminList = require('./config/adminList.js');

/****************
 * setup server *
 ****************/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'dftgwhfe89zgue3bhjwiofud978zgiuewkhbjwiofdozguekhjblwkiofdugehwjblknlfsdmkvsnmbkjfäsajflsj'
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())


//PUBLIC UNAUTHENTICATED API
app.post('/api/purchases/', function(request, response) {
  //TODO authBySignature
  //id: 0x440x4a0x300xbb, signature: jG5iN8GuWOg/ncjXy73DklstZ5UhHVgDM5KOwIotNcY

  var rfid = request.body.id;
  console.log(request.body);
  UserService
    .getUserByRfid(rfid)
    .then(function(user) {
      if (!user) {
        console.info('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')
        console.info('┃    NEW RFID CARD RECEIVED    ┃')
        console.info('┃       '   + rfid +   '       ┃')
        console.info('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')
        return Promise.reject(404)
      }
      return user;
    })
    .then(PurchaseService.createPurchaseForUser)
    .then(function(purchase) {
      response.status(200).send(purchase);
    }).catch(function (err) {
      console.error(err);
      if (err === 404) {
        response.status(404).send('RFID unknown!');
      } else {
        response.status(500).send(err);
      }
    });
});


app.get('/api/debts', auth, function(request, response) {
  DebtService.getDebts().then(function(debts) {
    response.status(200).send(debts);
  }).catch(function (err) {
    console.error(err);
    response.status(500).send(err);
  });
})

app.get('/api/users', auth, function(request, response) {
  UserService.getUsers().then(function(users) {
    response.status(200).send(users);
  }).catch(function (err) {
    console.error(err);
    response.status(500).send(err);
  });
});

app.get('/api/users/:userId/:secret', authBySecret, function(request, response) {
  UserService.getUserById(request.params.userId)
  .then(function(user) {
    response.status(200).send(user);
  }).catch(function (err) {
    console.error(err);
    response.status(500).send(err);
  });
});

app.post('/api/users', auth, function(request, response) {
  var newUser = request.body;
  var secretLength = 20;
  newUser.secret = crypto.randomBytes(32).toString('hex');
  newUser.registration_timestamp = new Date();

  UserService.createUser(newUser).then(function(user) {
    response.status(201).send(user);
  }).catch(function (err) {
    console.error(err);
    response.status(500).send(err);
  });
});

app.delete('/api/users/:userId', auth, function(request, response) {
  var userId = request.params.userId;
  PaymentService
    .deletePaymentsForUserId(userId)
    .then(function() {
      return PurchaseService.deletePurchasesForUserId(userId);
    })
    .then(function() {
      return UserService.deleteUserById(userId);
    })
    .then(function(deletedUser) {
      response.status(200).send(deletedUser);
    }).catch(function (err) {
      response.status(500).send(err);
    });
});

app.put('/api/users/:userId', auth, function(request, response) {
  UserService
    .updateUser(request.params.userId, request.body)
    .then(function(updatedUser) {
      response.status(200).send(updatedUser);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.post('/api/mail/paymentReminder/:userId/', auth, function(request, response) {
  UserService
    .getUserById(request.params.userId)
    .then(function(user) {
      return DebtService.getCurrentDebtsForUserId(request.params.userId)
        .then(function(debts){
          return MailService.sendPaymentRequest(user, debts);
        });
    }).then(function(result) {
      response.status(200).send(result);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.post('/api/mail/registrationConfirmation/:userId', auth, function(request, response) {
  UserService
    .getUserById(request.params.userId)
    .then(MailService.sendRegistrationConfirmation)
    .then(function(result) {
      response.status(200).send(result);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.post('/api/mail/paymentConfirmation/:userId/:paymentId', auth, function(request, response) {
  var user;
  UserService
    .getUserById(request.params.userId)
    .then(function(result) {
      user = result;
      return PaymentService.getPaymentById(request.params.paymentId);
    })
    .then(function(payment) {
      return MailService.sendPaymentConfirmation(user, payment);
    })
    .then(function(result) {
      response.status(200).send(result);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});


app.post('/api/mail/sendPaymentDecline/:userId/:paymentId', auth, function(request, response) {
  var user;
  UserService
    .getUserById(request.params.userId)
    .then(function(result) {
      user = result;
      return PaymentService.getPaymentById(request.params.paymentId);
    })
    .then(function(payment) {
      return MailService.sendPaymentDeclineInformation(user, payment);
    })
    .then(function(result) {
      response.status(200).send(result);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.get('/api/purchases/:userId/:secret', authBySecret, function(request, response) {
  PurchaseService
    .getPurchasesForUser(request.params.userId)
    .then(function(purchases) {
      response.status(200).send(purchases);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.get('/api/payments/:userId/:secret', authBySecret, function(request, response) {
  PaymentService
    .getPaymentsForUser(request.params.userId)
    .then(function(payments) {
      response.status(200).send(payments);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.post('/api/payments/:userId/:secret', authBySecret, function(request, response) {
  PaymentService
    .createPayment(request.params.userId, request.body.amount_cents)
    .then(function(payment) {
      response.status(200).send(payment);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.get('/api/payments', auth, function(request, response) {
  PaymentService
    .getPayments()
    .then(function(payments) {
      response.status(200).send(payments);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.get('/api/purchases', auth, function(request, response) {
  PurchaseService
    .getPurchases()
    .then(function(purchases) {
      response.status(200).send(purchases);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.get('/api/confirmPayment/:id', auth, function(request, response) {
  PaymentService
    .updatePaymentStatusById(request.params.id, 'confirmed')
    .then(function(payment) {
      response.status(200).send(payment);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.get('/api/declinePayment/:id', auth, function(request, response) {
  PaymentService
    .updatePaymentStatusById(request.params.id, 'declined')
    .then(function(payment) {
      response.status(200).send(payment);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});

app.delete('/api/payments/:id', auth, function(request, response) {
  PaymentService
    .deletePaymentById(request.params.id)
    .then(function(payment) {
      response.status(201).send(payment);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
});


/********
 * auth *
 ********/
passport.serializeUser(function(admin, done) {
  done(null, admin.id);
});

passport.deserializeUser(function(id, done) {
  var user = _.find(adminList, {id})
  if (user) {
    return done(null, _.omit(user, 'password'));
  } else {
    return done(null, false);
  }
});

passport.use(new LocalStrategy(
  function(user, password, done) {
    var user = _.find(adminList, {user, password})
    if (user) {
      return done(null, _.omit(user, 'password'));
    } else {
      return done(null, false);
    }
  }
));

function auth(req, res, next){
  if (!req.isAuthenticated())
      res.sendStatus(401);
  else
      next();
}

function authBySecret(request, response, next) {
  var userId = request.params.userId;
  var secret = request.params.secret;
  UserService
    .getUserById(userId)
    .then(function(user) {
      if (secret === user.secret) {
        next();
      } else {
        response.sendStatus(401);
      }
    });
}

// route to test if the user is logged in or not
app.get('/api/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});


/****************
 * start server *
 ****************/
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

// handle every other route with index.html
app.use('/', express.static(__dirname + '/frontend/dist'));
