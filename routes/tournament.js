const express = require("express");
const router = express.Router();
const NameHelper = require('../Helpers/NameHelper')

router.get('/', async(req, res)=>{
    const nameHelper = new NameHelper()
    const randomName = await nameHelper.generateRandomName()
    res.render('index',{
        name: randomName
    });
})


module.exports = router;