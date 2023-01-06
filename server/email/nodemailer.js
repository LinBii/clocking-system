const nodemailer = require('nodemailer');

const sendEmail = (mailList, mailSubject, mailText) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    const mailConfigs = {
      from: process.env.AUTH_EMAIL,
      // send to admin
      to: mailList,
      subject: mailSubject,
      text: mailText,
    };

    transporter.sendMail(mailConfigs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: 'An error has occured' });
      }
      return resolve({ message: 'Email sent successfully' });
    });
  });
};

module.exports = {
  sendEmail,
};
