const authByLogin = require('./auth/authByLogin.js');
const DebtService = require('../services/debtService.js');

module.exports = function(app) {
  app.get('/api/debts', authByLogin, function(request, response) {
    DebtService.getDebts().then(function(debts) {
      response.status(200).send(debts);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
  });
}
