const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
const { User, Attendance } = require('../models');
const { sendEmail } = require('./nodemailer');

async function getYesterdayAbsentUsers(req, res, next) {
  // Set the date at the timezone of GMT+8, subtract 1 day because the mail offers yesterday's absent users' information
  let date = dayjs()
    .utcOffset(8)
    .subtract(1, 'day')
    .format('YYYY-MM-DD 00:00:00');

  const users = await User.findAll({
    include: [
      {
        model: Attendance,
        where: { date: date, absent: true },
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
    // get admin mailList
    let mailList = [process.env.AUTH_EMAIL];

    const adminEmails = await getAdminEmails();
    for (adminEmail of adminEmails) {
      mailList.push(adminEmail.email);
    }

    let date = dayjs().utcOffset(8).subtract(1, 'day').format('YYYY-MM-DD');

    const mailSubject = `${date}的缺勤名單通知`;

    const absentUsers = await getYesterdayAbsentUsers();

    let mailText = '';

    if (absentUsers.length === 0) {
      mailText = `${date}沒有人缺勤！`;
    } else {
      mailText = `${date}的缺勤名單如下： \n`;

      for (absentUser of absentUsers) {
        mailText += `ID： ${absentUser.id} | 名字： ${absentUser.name} | 信箱： ${absentUser.email}\n`;
      }
    }

    sendEmail(mailList, mailSubject, mailText);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAdminEmails,
  sendAbsentUserEmail,
};
