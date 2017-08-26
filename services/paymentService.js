const Client = require('./databaseService');

function getPaymentsForUser(userId) {
  return Client.query({
      text: 'SELECT * FROM payments WHERE user_id = $1 ORDER BY timestamp DESC;',
      values: [userId]
    })
    .then(function(result) {
      return result.rows;
    });
}

function getPayments() {
  return Client.query({
      text: 'SELECT * FROM payments;'
    })
    .then(function(result) {
      return result.rows;
    });
}

function getPaymentById(id) {
  return Client.query({
      text: 'SELECT * FROM payments WHERE id = $1;',
      values: [id]
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function updatePaymentStatusById(id, newStatus) {
  return Client.query({
      text: 'UPDATE payments SET status = $2 WHERE id = $1 RETURNING *;',
      values: [id, newStatus]
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function createPayment(userId, amountCents) {
  return Client.query({
      text: 'INSERT INTO payments(user_id, amount_cents, timestamp) VALUES($1, $2, $3) RETURNING *;',
      values: [userId, amountCents, new Date()]
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function deletePaymentById(id) {
  return Client.query({
      text: 'DELETE FROM payments WHERE id = $1 RETURNING *;',
      values: [id]
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function deletePaymentsForUserId(userId) {
  return Client.query({
      text: 'DELETE FROM payments WHERE user_id = $1;',
      values: [userId]
    });
}

module.exports = {
    getPaymentsForUser,
    getPayments,
    updatePaymentStatusById,
    createPayment,
    getPaymentById,
    deletePaymentById,
    deletePaymentsForUserId
};
