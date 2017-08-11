# Smart Fridge Application

This is a complete software suite for a later-pay system for office frigdes.
Each user has an account and can view her or his purchases and payments.
Admins can review payments and CRUD users. There is an email system attached,
reminding users of payments.

The sensor component needs a Raspberry Pi and a TinkerForge RFID module. Those
components have to be attached to the fridge. Users can be registered with any
RFID chip (credit cards, ID cards, RFID tags, RFID keys, ...). Each time any
registered user scans this RFID chip, a purchase is made.

## Webapp (NodeJS)
The webapp provides a user side (user purchase and payment history) and an admin
side (confirmation of payments, user CRUD, dashboard). Users have a unique link
instead of a username/password login. Admin accounts are configured in the
config.
This webapp works perfectly with Heroku, Heroku Postgres and Sendgrid.

### Config
1. Create a `config/adminList.js` from the template. Those are the admin accounts.
2. Create a `config/databaseConnection.js` from the template. It has to be Postgres.
3. Create a `config/mailProvider.js` from the template. Sendgrid works fine.
4. Edit the `services/mailService.js` if you want to use different email contents.

### Setup
#### Backend
1. run `npm install` in `webapp`
2. Provision the database by running `npm run provision`

#### Frontend
1. run `npm install` in `webapp/frontend`
2. run `grunt build` in `webapp/frontend` to build the frontend

### Run locally
1. start the backend with `npm run start` in `webapp`
2. start the frontend with `grunt serve` in `webapp/frontend`

### Deploy
1. run `grunt build` in `webapp/frontend` to build the frontend
2. run `npm run start` in `webapp` (or simply push to Heroku)

## Sensor Component (Python)

For the sensor you need a Raspberry Pi with a TinkerForge NFC/RFID Reader. This
project contains a Python script that continuously scans for RFID cards and does
a request to the SmartFridge as soon a Card has been detected.

### Config
Replace the link to the API Link in the python script.

### Run
On your Pi run `py rfid-sensor.py`. This should be a automatically restarting
SystemCtl or Systemd service.
