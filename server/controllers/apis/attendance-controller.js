const { Attendance } = require('../../models');

let attendanceController = {
  postAttendance: (req, res, next) => {
    if (!req.body.date || !req.body.clockIn) {
      return res.json({
        status: 'error',
        message: 'attendance time not exist!',
      });
    }
    return Attendance.create({
      UserId: req.user.id,
      date: req.body.date,
      clockIn: req.body.clockIn,
    })
      .then((attendance) => {
        return res.json({
          status: 'success',
          message: 'created new clock-in successfully',
          attendanceId: attendance.id,
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
