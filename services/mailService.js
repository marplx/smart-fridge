const sendMail = require('../config/mailProvider.js').sendMail;
const mailTemplates = require('../config/mailTemplates.js');

function sendPaymentReminder(user, debts) {
  var mail = mailTemplates.paymentReminderTemplate(user, debts);

  console.log(`Sending reminder mail to ${user.name} <${user.email}> for ${debts} cents.`);
  return sendMail(mail);
}

function sendPaymentConfirmation(user, payment) {
  var mail = mailTemplates.paymentConfirmationTemplate(user, payment);

  console.log(`Sending payment confirmation mail to ${user.name} <${user.email}> for ${payment.amount_cents} cents.`);
  return sendMail(mail);
}

function sendPaymentDeclineInformation(user, payment) {
  var mail = mailTemplates.paymentDeclineTemplate(user, payment);

  console.log(`Sending payment decline info mail to ${user.name} <${user.email}> for ${payment.amount_cents} cents.`);
  return sendMail(mail);
}

function sendRegistrationConfirmation(user) {
  var mail = mailTemplates.registrationConfirmationTemplate(user);

  console.log(`Sending registration confirmation mail to ${user.name} <${user.email}>.`);
  return sendMail(mail);
}

module.exports = {
  sendPaymentReminder,
  sendPaymentConfirmation,
  sendRegistrationConfirmation,
  sendPaymentDeclineInformation
}
