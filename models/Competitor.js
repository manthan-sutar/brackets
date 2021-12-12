const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../config/database");
const MatchCompetitor = require("./MatchCompetitor");
const Tournament = require("./Tournament");

class Competitor extends Model {}

Competitor.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
        name: Sequelize.STRING,
		tournament_id: Sequelize.INTEGER
	},
	{
		sequelize: db,
		modelName: "competitors",
        underscored: true
	}
);


MatchCompetitor.belongsTo(Competitor, {foreignKey: 'competitor_id'})

module.exports = Competitor;