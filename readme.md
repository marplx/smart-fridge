# SmartFridge - Office Fridge Web App

Lots of companies have fridges with special drinks at low costs for employees
which are maintained by volunteers. Operating those fridges is time consuming
and often results in large bags of coins.

SmartFridge is a laster-pay web app that makes operations easier. Purchases are
stored in a database, user can review their purchases and make payments (eg.
with PayPal) whenever they want in their profiles. This provides a constant cash
flow for continuously buying new drinks. There is also an email system attached,
reminding users of payments. **No more tally charts, no more coin
boxes! Digitalize your frigde!**

**How to make purchases?** The app provides a public REST endpoint which can be
triggered with a user ID. At the moment every purchase is € 1,00. Here are some
ideas on how to call the API:

* A Raspberry Pi attached to the fridge with an RFID reader that reads the
  customer's ID and call the endpoint. (That is what I do - see my smart-fridge
  sensor project).
* The same but with NFC and the customer's phone instead of an RFID card.
* The same but with a fingerprint reader.
* An app on the customer's phone with a button that triggers an endpoint call.
* Something even nerdier?

The web app provides a user side (user purchase and payment history) and an admin
side (confirmation of payments, user CRUD, dashboard). Users have a
*unique secret link* instead of a username/password login.

This web app works fine with Heroku, Heroku Postgres and Sendgrid.

### User Registration and Profile
<a href="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/registration.png"><img src="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/registration.png" width="200" ></a>
<a href="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/registration-2.png"><img src="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/registration-2.png" width="200" ></a>
<a href="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/user.png"><img src="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/user.png" width="200" ></a>
<a href="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/user-payment.png"><img src="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/user-payment.png" width="200" ></a>

### Admin Area with Payment and Account Management
<a href="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/admin-area.png"><img src="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/admin-area.png" width="404" ></a>
<a href="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/account-mgmt.png"><img src="https://raw.githubusercontent.com/marfnk/smart-fridge/master/screenshots/account-mgmt.png" width="404" ></a>


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
