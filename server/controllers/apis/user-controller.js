const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

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
  signIn: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ status: 'error', message: '請確實填寫欄位！' });

    try {
      const user = await User.findOne({ where: { email } });
      // Prevent users from knowing if certain user is exist or not
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: '請確認是否輸入正確的帳號密碼' });
      }
      if (user.wrongPasswordTimes >= 5 || user.isLocked) {
        return res
          .status(401)
          .json({ status: 'error', message: '你的帳號已被上鎖！' });
      } else if (!bcrypt.compareSync(password, user.password)) {
        User.increment('wrongPasswordTimes', {
          by: 1,
          where: { id: user.id },
        });
        if (user.wrongPasswordTimes === 4) {
          User.update(
            { isLocked: true },
            {
              where: {
                id: user.id,
              },
            }
          );
          return res.status(401).json({
            status: 'error',
            message: '因為密碼錯誤已達五次，帳號已被鎖定！',
          });
        }
        return res
          .status(401)
          .json({ status: 'error', message: '請確認是否輸入正確的帳號密碼' });
      } else {
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.json({
          status: 'success',
          message: 'ok',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getCurrentUser: (req, res) => {
    const { id, name, email, role, password } = req.user;
    res.json({
      id,
      name,
      email,
      role,
      password,
    });
  },
  updatePassword: async (req, res, next) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.status(401).json({ status: 'error', message: '拒絕存取！' });
    }
    try {
      const user = await User.findByPk(req.params.id);
      const hash = await bcrypt.hash(req.body.newPassword, 10);
      await user.update({ password: hash });
      return res.json({ status: 'success', message: '密碼更改成功！' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
