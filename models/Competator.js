const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../config/database");

class Competator extends Model {}

Competator.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
        name: Sequelize.STRING
	},
	{
		sequelize: db,
		modelName: "competators",
        underscored: true
	}
);

module.exports = Competator;