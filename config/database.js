const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  'brackets',
  'manthan',
  'admin1234',
  // 'root',
  // '12345678', 
  {
  host: 'localhost',
  logging: false,
  dialect: 'mysql'
});
