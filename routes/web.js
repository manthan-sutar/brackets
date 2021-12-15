const express = require("express");
const router = express.Router();
const NameHelper = require('../Helpers/NameHelper');
const TournamentHelper = require('../Helpers/TournamentHelper');
const Tournament = require("../models/Tournament");
const tournamentHelper = new TournamentHelper()


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
    const tournament = await tournamentHelper.getTournamentDataAndStatus({
        id: req.params.id
    })
    res.render('tournaments/tournament', {
        tournament: tournament
    })
})



module.exports = router;