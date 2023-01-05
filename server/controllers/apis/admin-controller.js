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
      await attendance.update({ absent: false });
      return res.json({ status: 'success', message: '缺勤修改成功！' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
