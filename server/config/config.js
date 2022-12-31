require('dotenv').config();
module.exports = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+08:00',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    use_env_variable: 'CLEARDB_DATABASE_URL',
  },
};
