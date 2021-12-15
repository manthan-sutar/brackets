const Match = require("../models/Match");
const MatchCompetitor = require("../models/MatchCompetitor");
const BracketHelper = require('./BracketHelper')
const bracketHelper = new BracketHelper()

class MatchHelper {
    async submitScore({
        score,
        match_competitor_id
    }) {
        try {
            const submitScore = await MatchCompetitor.update({
                score: score
            }, {
                where: {
                    id: match_competitor_id
                }
            })
            console.log(submitScore);
        } catch (error) {
            console.log(error);
        }
    }

    async isScoredSubmittedByCompetitors({
        match_id
    }){
        const matchCompetation = await MatchCompetitor.findAll({
            where: {
                match_id: match_id
            }
        })

        var isSubmitted = true

        matchCompetation.forEach(element => {
            if (element.score === null) {
                isSubmitted = false
            }
        });
        
        return isSubmitted
    }

    async setWinnerWithHighestScore({
        match_id
    }){
        const match = await Match.findOne({
            where: {
                id: match_id
            }
        })

        const matchCompetitors = await MatchCompetitor.findAll({
            where: {
                match_id: match_id
            }
        })

        if (matchCompetitors[0].score > matchCompetitors[1].score) {
           return await match.update({
                winner_id: matchCompetitors[0].competitor_id
            })
        } else {
           return await match.update({
                winner_id: matchCompetitors[1].competitor_id
            })
        }
    }

    async getWinnerId({
        match_id
    }){
        const match = await Match.findOne({
            where: {
                id: match_id
            }
        })

        return match.winner_id
    }

    async nextRound({
        round, sort, tournament_id
    }){
       try {
        const match = await Match.findOne({
            where: {
                round: round,
                sort: sort,
                tournament_id: tournament_id
            }
        })
        return match == null ? {created: false,data: match} : {created: true,data: match}
       } catch (error) {
           return error
       }
    }

    async isCompetitorExist({
        match_id,
        competitor_id
    }){
        const matchCompetitor = await MatchCompetitor.findOne({
            where: {
                match_id: match_id,
                competitor_id: competitor_id
            }
        })
        return matchCompetitor == null ? false : true
    }


    async addCompetitor({
        match_id, competitor_id
    }){
        const newCompetitor = await MatchCompetitor.create({
            match_id: match_id,
            competitor_id: competitor_id,
        })

        console.log("Added competitor in the next round!");
    }
}

module.exports = MatchHelper