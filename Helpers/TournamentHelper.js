const Tournament = require("../models/Tournament");
const BracketHelper = require("../Helpers/BracketHelper");
const Match = require("../models/Match");
const MatchCompetitor = require("../models/MatchCompetitor");
const Competitor = require("../models/Competitor");
const NameHelper = require("./NameHelper");
const bracketHelper = new BracketHelper()

class TournamentHelper {
    async getTournamentDataAndStatus({
        id
    }) {
        try {
            const tournament = await Tournament.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: Match,
                        include: [
                            {
                                model: MatchCompetitor,
                                include: [
                                    {
                                        model: Competitor
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
            // var tournamentData = []

            var matches = tournament.matches

            var tournamentRoundsAndMatches = bracketHelper.getRoundData({
                competitingPlayers: tournament.number_of_competators,
                round: "*"
            })

            tournamentRoundsAndMatches.forEach(element => {
                const roundMatches = matches.filter((match) => { return match.round == element.round })
                element.matches = roundMatches
            });

            const tournamentJson = tournament.toJSON()

            tournamentJson.matches = tournamentRoundsAndMatches

            return tournamentJson

        } catch (error) {
            return error
        }
    }

    generateRandomPlayers({
        numberOfPlayers
    }){
        var players = [];
        //creating users for the game;
        const nameHelper = new NameHelper()
        for (let index = 0; index < numberOfPlayers; index++) {
            var player = {
                name: nameHelper.generateRandomName()
            }
            //create player and save in database
            // var generatedPlayer = await Competitor.create(player)
            players.push(player);
        }

        return players
    
    }

    async getNumberOfPlayers({tournament_id}){
        const tournament = await Tournament.findOne({
            where: {
                id: tournament_id
            }
        })
        return tournament.number_of_competators
    }
}

module.exports = TournamentHelper