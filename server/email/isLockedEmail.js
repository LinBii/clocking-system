const { getAdminEmails } = require('../email/absentEmail');
const { sendEmail } = require('../email/nodemailer');

async function sendIsLockedEmail(user) {
  // get admin mailList
  let mailList = [process.env.AUTH_EMAIL];

  const adminEmails = await getAdminEmails();
  for (adminEmail of adminEmails) {
    mailList.push(adminEmail.email);
  }

  const mailSubject = '使用者帳號遭到上鎖';

  const mailText = `使用者${user.name}的帳號因為密碼錯誤超過五次而遭到上鎖。\n使用者資料如下：\nID： ${user.id} | 名字： ${user.name} | 信箱： ${user.email}\n`;

  await sendEmail(mailList, mailSubject, mailText);
}

module.exports = {
  sendIsLockedEmail,
};
