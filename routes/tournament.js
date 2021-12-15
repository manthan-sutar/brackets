const express = require("express");
const router = express.Router();
const NameHelper = require('../Helpers/NameHelper');
const Competitor = require("../models/Competitor");
const Tournament = require("../models/Tournament");
const shuffle = require('shuffle-array');
const Match = require("../models/Match");
const MatchCompetitor = require("../models/MatchCompetitor");
const BracketHelper = require("../Helpers/BracketHelper");
const bracketHelper = new BracketHelper()
const TournamentHelper = require("../Helpers/TournamentHelper");
const MatchHelper = require("../Helpers/MatchHelper");
const tournamentHelper = new TournamentHelper()
const matchHelper = new MatchHelper
// Public Routes End

//Store Tournament
router.post('/', async (req, res) => {
    //Create New Tournament And get the id of the tournament
    //FOr time being tournamnent name have been kept static

    const numberOfPlayers = req.body.numberOfPlayers // INT 8/16
    const competitors = req.body.competitors
    try {
        const tournament = await Tournament.create({
            number_of_competators: numberOfPlayers,
            is_active: false,
            name: "Brackets"//Name can be made dynamic
        })

        const tournamentId = tournament.id

        //Add generated Players for the newly created tournmanet

        competitors.forEach(async competitor => {
            await Competitor.create({
                tournament_id: tournamentId,
                name: competitor.name
            })
        });

        res.json({
            data: tournament,
            message: "Tournament Created!"
        })

    } catch (error) {
        res.json(error)
    }
})


router.get('/:id', async (req, res) => {
    const tournament = await tournamentHelper.getTournamentDataAndStatus({
        id: req.params.id
    })
    res.json(tournament)
})


///This route will generate random players
router.post("/generate-players", async (req, res) => {
    //total players (Int) - by which i gernerte random players for brackerts
    const numberOfPlayers = req.body.numberOfPlayers
    const players = tournamentHelper.generateRandomPlayers({
        numberOfPlayers: numberOfPlayers
    })
    res.json(players)
})


router.post('/submit-score', async (req, res) => {
    const body = req.body
    const matchId = body.match_id
    //Update Score
    await matchHelper.submitScore({
        score: body.score,
        match_competitor_id: body.match_competitor_id
    })

    //Check if Both Oponenets have submitted score
    const isScoredSubmittedByCompetitors = await matchHelper.isScoredSubmittedByCompetitors({
        match_id: matchId
    })

    var match = await Match.findOne({
        where: {
            id: matchId
        }
    })

    const tournamentId = match.tournament_id
    
    if (isScoredSubmittedByCompetitors === true) {
        await matchHelper.setWinnerWithHighestScore({
            match_id: matchId
        })
        const totalPlayers = await tournamentHelper.getNumberOfPlayers({
            tournament_id: tournamentId
        })
        const prevoiusSort = match.sort
        const winnerId = await matchHelper.getWinnerId({
            match_id: matchId
        })
        const nextRoundNumber = (Number(match.round) + 1)
        
        const previousRoundNumber = (Number(match.round))

        const currentRound = bracketHelper.getRoundData({
            competitingPlayers: totalPlayers,
            round: previousRoundNumber
        })
        //get position for next match bey grouping 2 succeinding matches.
        const positionForNextRound = bracketHelper.getNextRoundPosition({
            matchNumber: prevoiusSort,
            totalMatches: currentRound.totalMatches
        })

        const nextRound = await matchHelper.nextRound({
            round: nextRoundNumber,
            sort: positionForNextRound,
            tournament_id: tournamentId
        })
        

        //Check If Round is final 
        const isFinalRound = bracketHelper.isCurrentRoundIsFinal({
            roundNumber: previousRoundNumber,
            totalPlayers: totalPlayers
        })


        if(isFinalRound == true){
          try {
            await Tournament.update({
                is_active: false
            }, {
                where: {
                    id: tournamentId
                }
            })
            console.log("Winner is is Declared!! Tournament is Ended.");
          } catch (error) {
              console.log(error);
          }
           
        }else{
            if (nextRound.created == true) {
                const isCompetitorExists = await matchHelper.isCompetitorExist({
                    match_id: nextRound.data.id,
                    competitor_id: winnerId
                })
                if (isCompetitorExists == false) {
                    await matchHelper.addCompetitor({
                        match_id: nextRound.data.id,
                        competitor_id: winnerId
                    })
                }
            } else {
                const newMatchPayload = {
                    round: nextRoundNumber,
                    sort: positionForNextRound,
                    tournament_id: tournamentId,
                    side: match.side
                }
                const newMatch = await Match.create(newMatchPayload)
                await matchHelper.addCompetitor({
                    match_id: newMatch.id,
                    competitor_id: winnerId
                })
            }
        }
    }
    res.json("success")
})


router.post('/generate-matches/:id', async (req, res) => {
    const tournamentId = req.params.id
    //get the tournament
    try {
        //Get All Competitors of the tournament (Randomised using sequelise orderby function)
        var competitors = await Competitor.findAll({
            attributes: [
                'id',
                'tournament_id'
            ],
            where: {
                tournament_id: tournamentId
            }
        })

        //Shuffle Players for the brackets  Draw
        shuffle(competitors)

        //Split Brackets

        const totalPlayers = competitors.length
        var halfIndex = (totalPlayers / 2) - 1


        //If Count index is 2 reset the counter. and make new match with two intereating competitors
        var count = 1

        var matches = []

        //Temporary Match obejct store match data of every cycle of 2 count
        var match = {};

        //Create mathc of every 2 succeding competator after suffleing
        competitors.forEach(async (competitor, index) => {
            //Reset Counter when count is 2
            if (count > 2) {
                count = 1
            }
            if (count == 1) {
                //Add first comepetitor in the match object
                match.competitor_one = competitor.id
                match.tournament_id = competitor.tournament_id
            }
            if (count == 2) {
                //Add second comepetitor in the match object and clear match object after pushing match object matches
                match.competitor_two = competitor.id
                match.side = index > halfIndex ? "right" : "left"
                matches.push(match)
                match = {
                    tournament_id: competitor.tournament_id
                }
            }
            count = count + 1
        });

        //Commit Matches for the tournment;
        matches.forEach(async (element, index) => {
            var matchData = element
            matchData.round = 1
            try {
                const matchData = await Match.create({
                    tournament_id: tournamentId,
                    round: 1,
                    sort: (index + 1),
                    side: element.side
                })

                await MatchCompetitor.create({
                    match_id: matchData.id,
                    competitor_id: element.competitor_one,
                })


                await MatchCompetitor.create({
                    match_id: matchData.id,
                    competitor_id: element.competitor_two,
                })


                //Change tournament status to active
                await Tournament.update({
                    is_active: true
                }, {
                    where: {
                        id: tournamentId
                    }
                })
                res.json({
                    message: "Draw Generated!"
                })

            } catch (error) {
                res.json(error)
            }
        });

    } catch (error) {
        res.json(error)
    }

})

module.exports = router;