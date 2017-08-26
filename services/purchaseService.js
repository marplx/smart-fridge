const Client = require('./databaseService');

function getPurchasesForUser(userId) {
  return Client.query({
      text: 'SELECT * FROM purchases WHERE user_id = $1 ORDER BY timestamp DESC;',
      values: [userId]
    })
    .then(function(result) {
      return result.rows;
    });
}

function getPurchases() {
  return Client.query({
      text: 'SELECT * FROM purchases;',
    })
    .then(function(result) {
      return result.rows;
    });
}

function createPurchaseForUser(user) {
  return Client.query({
      text: 'INSERT INTO purchases(user_id, price_cents, timestamp) VALUES($1, $2, $3) RETURNING *;',
      values: [user.id, 100, new Date()]
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function deletePurchasesForUserId(userId) {
  return Client.query({
      text: 'DELETE FROM purchases WHERE user_id = $1;',
      values: [userId]
    });
}

module.exports = {
    getPurchasesForUser,
    getPurchases,
    createPurchaseForUser,
    deletePurchasesForUserId
};
