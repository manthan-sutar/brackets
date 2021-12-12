const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../config/database");
const Tournament = require("./Tournament");

class Match extends Model {}

Match.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
        tournament_id: Sequelize.INTEGER,
		last_match_id: Sequelize.INTEGER,
		side: Sequelize.STRING,
		winner_id: Sequelize.INTEGER,
        round: Sequelize.INTEGER,
		sort: Sequelize.INTEGER
	},
	{
		sequelize: db,
		modelName: "matches",
        underscored: true
	}
);

Tournament.hasMany(Match, {foreignKey: 'tournament_id'})

module.exports = Match;