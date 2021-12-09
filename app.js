const express = require('express');
const app = express();
const PORT = process.env.PORT || 8082;
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

app.get('/', (req, res)=>{
    res.send("Brackets Tournament")
})

const tournamentRoutes = require('./routes/tournament')
const nameRoutes = require('./routes/names')

const api = "/api"
const public = "/public"

///Api Routes
app.use(api+'/tournament',tournamentRoutes)
app.use(api+'/name',nameRoutes)

///Public View Routes
app.use(public+'/',tournamentRoutes)

server.listen(PORT, () => {
    console.log("Server Running on port "+PORT)
})

