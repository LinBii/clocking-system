const { User, Attendance } = require('../../models');

const adminController = {
  getAttendances: async (req, res, next) => {
    try {
      const attendance = await Attendance.findAll({
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
        order: [['id', 'DESC']],
      });
      res.json(attendance);
    } catch (err) {
      next(err);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'isLocked'],
        include: [
          {
            model: Attendance,
          },
        ],
        order: [['id', 'ASC']],
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  getAbsentUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'isLocked'],
        include: [
          {
            model: Attendance,
            where: {
              absent: true,
            },
          },
        ],
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  putAbsence: async (req, res, next) => {
    if (Number(req.params.id) !== Number(req.body.attendanceId)) {
      return res.status(401).json({ status: 'error', message: '拒絕存取！' });
    }
    try {
      const attendance = await Attendance.findByPk(req.params.id);
      if (attendance.absent === false) {
        return res
          .status(409)
          .json({ status: 'error', message: '這筆記錄並未缺勤！' });
      }
      await attendance.update({ absent: false });
      return res.json({ status: 'success', message: '缺勤修改成功！' });
    } catch (err) {
      next(err);
    }
  },
  unlockUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user.isLocked === false) {
        return res
          .status(409)
          .json({ status: 'error', message: '這位使用者並未上鎖！' });
      }
      await user.update({ isLocked: false, wrongPasswordTimes: 0 });
      return res.json({ status: 'success', message: '使用者解鎖成功！' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
