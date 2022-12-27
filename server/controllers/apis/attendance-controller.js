const { Attendance } = require('../../models');

let attendanceController = {
  postAttendance: async (req, res, next) => {
    if (!req.body.date || !req.body.clockIn) {
      return res.json({
        status: 'error',
        message: '出勤時間不存在！',
      });
    }
    try {
      const data = await Attendance.findOne({ where: { date: req.body.date } });
      if (data) {
        return res.json({ status: 'error', message: '今天已經打卡上班了！' });
      }
      await Attendance.create({
        UserId: req.user.id,
        date: req.body.date,
        clockIn: req.body.clockIn,
      });
      return res.json({
        status: 'success',
        message: 'created new clock-in successfully',
      });
    } catch (err) {
      next(err);
    }
  },
  updateAttendance: async (req, res, next) => {
    try {
      const data = await Attendance.findOne({
        where: { date: req.body.date, UserId: req.params.id },
      });
      console.log(data.id);
      if (!data) {
        return res.json({
          status: 'error',
          message: 'attendance record not found',
        });
      }
      await Attendance.update(
        {
          clockOut: req.body.clockOut,
        },
        {
          where: { id: data.id },
        }
      );

      return res.json({
        status: 'success',
        message: 'updated clock-out successfully',
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = attendanceController;
