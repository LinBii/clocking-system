const { Attendance } = require('../../models');

let attendanceController = {
  postAttendance: (req, res, next) => {
    if (!req.body.date || !req.body.clockIn) {
      return res.json({
        status: 'error',
        message: '出勤時間不存在！',
      });
    }
    Attendance.findOne({ where: { date: req.body.date } })
      .then((data) => {
        if (data) {
          return res.json({ status: 'error', message: '今天已經打卡上班了！' });
        }
      })
      .then(
        Attendance.create({
          UserId: req.user.id,
          date: req.body.date,
          clockIn: req.body.clockIn,
        })
      )
      .then(() => {
        return res.json({
          status: 'success',
          message: 'created new clock-in successfully',
        });
      })
      .catch((err) => {
        next(err);
      });
  },
  updateAttendance: (req, res, next) => {
    return Attendance.findByPk(req.params.id)
      .then((attendance) => {
        if (!attendance) {
          return res.json({
            status: 'error',
            message: 'attendance record not found',
          });
        }
        return Attendance.update({
          clockOut: req.body.clockOut,
        });
      })

      .then((result) => {
        if (result[0] === 0) {
          return res.json({
            status: 'error',
            message: 'attendance record not found',
          });
        }
        return res.json({
          status: 'success',
          message: 'updated clock-out successfully',
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = attendanceController;
