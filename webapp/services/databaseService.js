const { Client } = require('pg')

const client = new Client(require('../config/databaseConnection.js'));
client.connect()

module.exports = client;
