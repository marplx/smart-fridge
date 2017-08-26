const express = require('express');
const app = express();
const _ = require('lodash');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

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

/***************
* start server *
****************/
app.set('port', (process.env.PORT || 5000));
var server = require('http').createServer(app);

server.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

/****************
* setup routes *
****************/
require('./api/debts.js')(app);
require('./api/login.js')(app);
require('./api/mail.js')(app);
require('./api/payments.js')(app);
require('./api/users.js')(app);
require('./api/purchases.js')(app);
var unknownRfidCallback = require('./api/registration.js')(server);
require('./api/sensor-endpoint.js')(app, unknownRfidCallback);

app.use('/', express.static(__dirname + '/frontend/dist'));

/*******************
 * Passport Config *
 *******************/
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
