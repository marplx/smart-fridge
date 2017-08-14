const sqlScript = `
CREATE TABLE IF NOT EXISTS "users" (
    "id" serial primary key,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "registration_timestamp" timestamp without time zone NOT NULL,
    "secret" character varying(255) NOT NULL,
    "rfid" "text"
);
CREATE TYPE payment_status AS ENUM ('confirmed', 'pending', 'declined');
CREATE TABLE IF NOT EXISTS "payments" (
    "id" serial NOT NULL primary key,
    "user_id" integer NOT NULL references users(id),
    "amount_cents" integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    "status" payment_status DEFAULT 'pending' NOT NULL
);
CREATE TABLE IF NOT EXISTS "purchases" (
    "id" serial NOT NULL primary key,
    "user_id" integer NOT NULL references users(id),
    "price_cents" integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL
);`;

const Client = require('../services/databaseService.js');
Client.query({
  text: sqlScript,
})
.then(function() {
  console.log('successful, press ctrl-c');
})
.catch(function(err) {
  console.error('PROVISION ABORTED!', err);
});
