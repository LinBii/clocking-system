const dayjs = require('dayjs');
const { User, Attendance } = require('../models');
const { sendEmail } = require('./nodemailer');

let date = dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00');

async function getTodayAbsentUsers(req, res, next) {
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

    date = dayjs(date).format('YYYY-MM-DD');

    const mailSubject = `${date}缺勤名單通知`;

    const absentUsers = await getTodayAbsentUsers();

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
  sendAbsentUserEmail,
};
