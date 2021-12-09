const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../config/database");
const Message = require("./Message");

class Match extends Model {}

Match.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
        tournament_id: Sequelize.INTEGER,
        competitor_one: Sequelize.INTEGER,
        competitor_otwo: Sequelize.INTEGER,
        winner_id: Sequelize.INTEGER,
        round: Sequelize.INTEGER,
	},
	{
		sequelize: db,
		modelName: "matches",
        underscored: true
	}
);

module.exports = Match;