const { Attendance } = require('../../models');
const dayjs = require('dayjs');

let attendanceController = {
  postAttendance: async (req, res, next) => {
    if (!req.body.date || !req.body.clockIn) {
      return res.json({
        status: 'error',
        message: '出勤時間不存在！',
      });
    }
    try {
      const data = await Attendance.findOne({
        where: { date: req.body.date, UserId: req.body.userId },
      });
      if (data) {
        return res.json({ status: 'error', message: '今天已經打卡上班了！' });
      }
      await Attendance.create({
        UserId: req.body.userId,
        date: req.body.date,
        clockIn: req.body.clockIn,
        elapsedTime: 0,
        absent: true,
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
        where: { date: req.body.date, UserId: req.body.userId },
      });
      if (!data) {
        return res.json({
          status: 'error',
          message: 'attendance record not found',
        });
      }
      // Calculate the elapsed time in seconds
      const elapsedTime = dayjs(req.body.clockOut).diff(
        dayjs(data.clockIn),
        'second'
      );
      // Set the value of absent to true if elapsedTime is less than 8 hours (28800 seconds) and false otherwise
      const absent = elapsedTime < 28800;
      console.log(absent);
      await Attendance.update(
        {
          clockOut: req.body.clockOut,
          elapsedTime,
          absent,
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
