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
    try {
        const tournament = await Tournament.findOne({
            where: {
                id: req.params.id
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


        var tournamentRoundsAndMatches = bracketHelper.getRoundData({
            competitingPlayers: tournament.number_of_competators,
            round: "*"
        })


        tournamentRoundsAndMatches.forEach(element => {
            element
        });


        // tournament.matches.forEach(match => {
           

        //     ///Checkc if the particular round data has already added in tournament data
        //     if(tournamentData.length == 0){
        //         tournamentData.push(tournamentRoundsAndMatches)
        //     }else{
                
        //     }
        //     // if(tournamentData.length == 0){
        //     //     tournamentData.forEach((data) => {
        //     //         data = tournamentRoundsAndMatches
        //     //         data.matches = []
        //     //         data.matches.push(match)
        //     //     })
        //     // }
        // });

        // console.log(tournamentData);

        

        //All round data by which i get tournamen status
        // [
        //     {
        //         "round": 1,
        //         "totalMatches": 8
        //     },
        //     {
        //         "round": 2,
        //         "totalMatches": 4
        //     },
        //     {
        //         "round": 3,
        //         "totalMatches": 2
        //     },
        //     {
        //         "round": 4,
        //         "totalMatches": 1
        //     }
        // ]
        

        
    } catch (error) {
        res.json(error)
    }
})


function ifObjectExist({
    list,
    key
}){
    
}

///This route will generate random players
router.post("/generate-players", async (req, res) => {
    //total players (Int) - by which i gernerte random players for brackerts
    const numberOfPlayers = req.body.numberOfPlayers // INT 8/16
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
    res.json(players)
})


router.post('/submit-score', async (req, res) => {
    var roundMatches = []
    var round = 1
    var competitingPlayers = 16


    const body = req.body
    const matchId = body.match_id




    try {
        //Submit Score 
        await MatchCompetitor.update({
            score: body.score
        }, {
            where: {
                id: body.match_competitor_id
            }
        })

        //Check if opoenent have submited. if submitted declare winner

        const matchCompetation = await MatchCompetitor.findAll({
            where: {
                match_id: matchId
            }
        })

        var isScoreSubmittedByBothCompetitors = true

        matchCompetation.forEach(element => {
            if (element.score === null) {
                isScoreSubmittedByBothCompetitors = false
            }
        });

        // Set Winner based on highest score


        const match = await Match.findOne({
            where: {
                id: matchId
            }
        })





        if (isScoreSubmittedByBothCompetitors === true) {
            if (matchCompetation[0].score > matchCompetation[1].score) {
                await match.update({
                    winner_id: matchCompetation[0].competitor_id
                })
            } else {
                await match.update({
                    winner_id: matchCompetation[1].competitor_id
                })
            }

            //Check if next round is already created
            const tournament = await Tournament.findOne({
                where: {
                    id: match.tournament_id
                }
            })

            const totalPlayers = tournament.number_of_competators
            const prevoiusSort = match.sort
            const winnerId = match.winner_id
            const nextRoundNumber = (Number(match.round) + 1)
            const previousRoundNumber = (Number(match.round))


            //Thiss will give data for next round. to get the match position.
            const nextRoundData = bracketHelper.getRoundData({
                competitingPlayers: totalPlayers,
                round: nextRoundNumber
            })


            const previousRoundData = bracketHelper.getRoundData({
                competitingPlayers: totalPlayers,
                round: previousRoundNumber
            })

            //get position for next match bey grouping 2 succeinding matches.

            const positionForNextRound = bracketHelper.getNextRoundPosition({
                matchNumber: prevoiusSort,
                totalMatches: previousRoundData.totalMatches
            })


            //Check if Neext Round match is created 
            const nextRound = await Match.findOne({
                where: {
                    round: nextRoundNumber,
                    sort: positionForNextRound,
                    tournament_id: tournament.id
                }
            })

            if (nextRound == null) {
                //Create Match and add competitor
                const newMatch = await Match.create({
                    round: nextRoundNumber,
                    sort: positionForNextRound,
                    tournament_id: tournament.id,
                    side: match.side
                })

                const newCompetitor = await MatchCompetitor.create({
                    match_id: newMatch.id,
                    competitor_id: winnerId,
                })

            } else {

                const matchCompetitor = await MatchCompetitor.findOne({
                    where: {
                        match_id: nextRound.id,
                        competitor_id: winnerId
                    }
                })

                if (matchCompetitor == null) {
                    const newCompetitor = await MatchCompetitor.create({
                        match_id: nextRound.id,
                        competitor_id: winnerId,
                    })
                    console.log(newCompetitor);
                }

            }
        }

        res.json(match)
    } catch (error) {
        res.json(error)
    }
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