# Smart Fridge Application

This is a complete software suite for a later-pay system for office fridges.
Each user has an account and can view her or his purchases and payments.
Admins can review payments and CRUD users. There is an email system attached,
reminding users of payments.

The webapp provides a user side (user purchase and payment history) and an admin
side (confirmation of payments, user CRUD, dashboard). Users have a unique link
instead of a username/password login. Admin accounts are configured in the
config.
This webapp works fine with Heroku, Heroku Postgres and Sendgrid.

### Config
1. Create a `config/adminList.js` from the template. Those are the admin
   accounts.
2. Create a `config/databaseConnection.js` from the template. It has to be
   Postgres.
3. Create a `config/mailProvider.js` from the template. Sendgrid works fine.
4. Edit the `services/mailService.js` if you want to use different email
   contents.
5. Setup your payment information by creating
  `frontend/scripts/config/paymentMethods.tpl.html` from the template.
6. Setup your frontend translation by creating
  `frontend/scripts/config/i18n.js` from the template.

### Setup
#### Backend
1. run `npm install`
2. Provision the database by running `npm run provision`

#### Frontend
1. run `npm install` in `frontend`
2. run `grunt build` in `frontend` to build the frontend

### Run locally
1. start the backend with `npm run start`
2. start the frontend with `npm run start` in `frontend`

### Deploy
1. run `grunt build` in `frontend` to build the frontend
2. run `npm run start` (or simply push to Heroku)
