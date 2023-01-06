const schedule = require('node-schedule');
const { User, Attendance } = require('../models');
const { sendEmail } = require('./nodemailer');

async function getAbsentUsers(req, res, next) {
  const users = await User.findAll({
    include: [
      {
        model: Attendance,
        where: { absent: true },
      },
    ],
  });

  const stringUsers = JSON.stringify(users);
  const jsonUsers = JSON.parse(stringUsers);
  return jsonUsers;
}

async function getAdminEmails(req, res, next) {
  const adminEmails = await User.findAll({
    where: { role: 'admin' },
    attributes: ['email'],
  });

  const stringAdminEmails = JSON.stringify(adminEmails);
  const jsonAdminEmails = JSON.parse(stringAdminEmails);
  return jsonAdminEmails;
}

async function sendAbsentUserEmail() {
  try {
    const absentUsers = await getAbsentUsers();

    let mailText = '缺勤的名單如下： \n';

    for (absentUser of absentUsers) {
      mailText += `id： ${absentUser.id} | 名字： ${absentUser.name} | Email： ${absentUser.email}\n`;
    }

    // get admin mailList
    let mailList = [process.env.AUTH_EMAIL];

    const adminEmails = await getAdminEmails();
    for (adminEmail of adminEmails) {
      mailList.push(adminEmail.email);
    }

    sendEmail(mailList, mailText);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendAbsentUserEmail,
};
