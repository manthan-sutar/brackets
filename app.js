const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
var cors = require('cors')
const server = require('http').createServer(app)

const bodyParser = require('body-parser');

app.use(cors())


app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

app.set('view engine', 'ejs');

app.use(express.static("views"));

const tournamentRoutes = require('./routes/tournament')
const matchesRoutes = require('./routes/matches')
const nameRoutes = require('./routes/names')
const webRoutes = require('./routes/web')

const api = "/api"

const public = "/public"

///Api Routes
app.use(api+'/tournament',tournamentRoutes)
app.use(api+'/name',nameRoutes)
app.use(api+'/matches',matchesRoutes)

///Public View Routes
app.use('',webRoutes)

server.listen(PORT, () => {
    console.log("Server Running on port "+PORT)
})

