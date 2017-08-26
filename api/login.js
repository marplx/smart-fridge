const passport = require('passport');

module.exports = function(app) {

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
}
