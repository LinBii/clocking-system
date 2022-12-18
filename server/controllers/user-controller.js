const bcrypt = require('bcryptjs');
const { User } = require('../models');

const userController = {
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body;
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (!name || !email || !password)
      return res.json({ status: 'error', message: '請確實填寫欄位！' });
    if (password !== passwordCheck)
      return res.json({ status: 'error', message: '兩次密碼輸入不相符!' });
    if (name.length > 50)
      return res.json({ status: 'error', message: '字數超出上限！' });
    if (email.search(emailRule) == -1)
      return res.json({ status: 'error', message: '請確認Email格式!' });
    User.findOne({ where: { email } })
      .then((userEmail) => {
        if (userEmail)
          return res.json({ status: 'error', message: 'email重複註冊！' });
        return bcrypt.hash(password, 10);
      })
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
          role: 'user',
        })
      )
      .then((user) => {
        res.json({ status: 'success', message: '帳號註冊成功！' });
      })
      .catch((err) => next(err));
  },
};

module.exports = userController;
