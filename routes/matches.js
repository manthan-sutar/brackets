const express = require("express");
const Match = require("../models/Match");
const router = express.Router();

router.get("/:tournament_id", async ( req, res) => {
    const tournamentId = req.params.tournament_id;
    try {
        const matches = await Match.findAll({
            where: {
                tournament_id: tournamentId
            }
        })
        res.json(matches)
    } catch (error) {
        res.json(error)
    }
})


module.exports = router;