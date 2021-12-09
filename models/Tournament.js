const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../config/database");

class Tournament extends Model {}

Tournament.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
        name: Sequelize.STRING,
        number_of_competators: Sequelize.INTEGER,
        is_active: Sequelize.BOOLEAN
	},
	{
		sequelize: db,
		modelName: "tournaments",
        underscored: true
	}
);

module.exports = Tournament;