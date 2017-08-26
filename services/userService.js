const Client = require('./databaseService');

function getUsers() {
  return Client.query('SELECT * FROM users ORDER BY ID DESC;')
    .then(function(result) {
      return result.rows;
    });
}

function getUserById(id) {
  return Client.query({
      text: 'SELECT * FROM users WHERE id = $1;',
      values: [id]
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function createUser(user) {
  return Client.query({
      text: 'INSERT INTO users(name, email, secret, rfid, registration_timestamp) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [user.name, user.email, user.secret, user.rfid, user.registration_timestamp],
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function deleteUserById(userId) {
  return Client.query({
      text: 'DELETE FROM users WHERE id = $1 RETURNING *',
      values: [userId],
    })
    .then(function(result) {
      return result.rows[0];
    });
}

function updateUser(userId, user) {
  return Client.query({
      text: 'UPDATE users SET name = $2, email = $3, rfid = $4 WHERE id = $1 RETURNING *',
      values: [userId, user.name, user.email, user.rfid],
    });
}

function getUserByRfid(rfid) {
  return Client.query({
      text: 'SELECT * FROM users WHERE rfid = $1;',
      values: [rfid],
    })
    .then(function(result) {
      return result.rows[0];
    });
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    getUserByRfid
};
