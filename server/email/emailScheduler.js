const { User, Attendance } = require('../models');

async function getAbsentUsers() {
  const users = await User.findAll({
    include: [
      {
        model: Attendance,
        where: { absent: true },
      },
    ],
  });

  return users;
}

async function sendAbsentUserEmail() {
  try {
    const absentUsers = await getAbsentUsers();
    // Send email to absent users...
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendAbsentUserEmail,
};
