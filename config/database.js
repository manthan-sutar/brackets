const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  'brackets',
  'manthan',
  '12345678',
  // 'root',
  // '12345678', 
  {
  host: 'localhost',
  logging: false,
  dialect: 'mysql'
});
