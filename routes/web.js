const express = require("express");
const router = express.Router();
const NameHelper = require('../Helpers/NameHelper');
const Competitor = require("../models/Competitor");
const Match = require("../models/Match");
const MatchCompetitor = require("../models/MatchCompetitor");
const Tournament = require("../models/Tournament");


router.get('/', async (req, res) => {
    const nameHelper = new NameHelper()
    const randomName = await nameHelper.generateRandomName()
    res.render('tournaments/create', {
        name: randomName
    });
})

router.get('/tournaments', async (req, res) => {
    const tournaments = await Tournament.findAll({
        order: [
            ['id', "DESC"]
        ]
    })
    res.render('tournaments/index', {
        tournaments: tournaments
    })
})


router.get('/tournaments/:id', async (req, res) => {
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

    var leftMatches = []
    var rightMatches = []

    tournament.matches.forEach(element => {
        if(element.round == 1){
            if(element.side == "left"){
                leftMatches.push(element)
            }else{
                rightMatches.push(element)
            }
        }
    });


// res.json({
//     tournament: tournament,
//         leftMatches: leftMatches,
//         rightMatches: rightMatches
// })

    res.render('tournaments/tournament', {
        tournament: tournament,
        leftMatches: leftMatches,
        rightMatches: rightMatches
    })

   } catch (error) {
       res.json(error)
   }


    // return
    // const competitors = tournament.competitors


    // //Fetch Competitors of left group
    // var leftMatches = await Match.findAll({
    //     where: {
    //         tournament_id: tournament.id,
    //         side: "left"
    //     }
    // })

    // // Join names of competitors by id. get competitor object from competitors array fetched from tournaments

    // leftMatches.forEach(element => {
    //     element.competitor_one = competitors.filter((x) => { return x.id == element.competitor_one })[0]
    //     element.competitor_two = competitors.filter((x) => { return x.id == element.competitor_two })[0]
    // });


    // //Fetch Competitors of right group
    // const rightMatches = await Match.findAll({
    //     where: {
    //         tournament_id: tournament.id,
    //         side: "right"
    //     }
    // })

    // // Join names of competitors by id. get competitor object from competitors array fetched from tournaments


    // rightMatches.forEach(element => {
    //     element.competitor_one = competitors.filter((x) => { return x.id == element.competitor_one })[0]
    //     element.competitor_two = competitors.filter((x) => { return x.id == element.competitor_two })[0]
    // });
})


module.exports = router;