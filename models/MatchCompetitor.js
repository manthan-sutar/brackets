const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../config/database");
const Competitor = require("./Competitor");
const Match = require("./Match");

class MatchCompetitor extends Model {}

MatchCompetitor.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
            autoIncrement: true
		},
        match_id: Sequelize.INTEGER,
		competitor_id: Sequelize.INTEGER,
		last_users_position: Sequelize.INTEGER,
        score: Sequelize.INTEGER
	},
	{
		sequelize: db,
		modelName: "match_competitors",
        underscored: true
	}
);

Match.hasMany(MatchCompetitor, {foreignKey: 'match_id'})

module.exports = MatchCompetitor;