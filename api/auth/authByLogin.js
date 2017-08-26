module.exports = function auth(req, res, next){
  if (!req.isAuthenticated())
      res.sendStatus(401);
  else
      next();
}
