//Selectors

const player8btn = $("#btn-8-p")
const player16btn = $("#btn-16-p")
const gameTypeElement = $("#game-type")
const generatePlayersButton = $("#generate-players")
const startBracketsButton = $("#start-brackets")
const createTournamentBtn = $("#btn-create-tournament")
const bracketsView = $("#brackets-view")


//Stores
const baseUrl = "http://localhost:8080/api/"

var numberOfPlayers = null

var players = []

var typeOfGame;

var competitorData


// $(document).ready(function () {
//     runFunctionsForSpecificRoutes("/tournaments/" + getLastUrlParam(), fetchMatches)
// });


$(player8btn).click(function (e) {
    e.preventDefault();
    setTypeOfBracket("8 Player")
    numberOfPlayers = 8
});

$(player16btn).click(function (e) {
    e.preventDefault();
    setTypeOfBracket("16 Player")
    numberOfPlayers = 16
});

$(generatePlayersButton).click(async function (e) {
    players = await getPlayersForTheTournament()
    showGeneratedPlayers()
});


$(createTournamentBtn).click(async function (e) {
    createTournament()
})

$(startBracketsButton).click(async function () {
    startTournament()
})

function setTypeOfBracket(type) {
    typeOfGame = type
    gameTypeElement.html(type);
}


async function getPlayersForTheTournament() {
    if (numberOfPlayers == null) {
        alert("Please Select Number Players!!")
    } else {
        const rawResponse = await fetch(baseUrl + "tournament/generate-players", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numberOfPlayers: numberOfPlayers
            })
        });
        const content = await rawResponse.json();
        console.log(content);
        return content
    }
}



function showGeneratedPlayers() {
    var playersHtmlBody = ""

    players.forEach(player => {
        playersHtmlBody += '<span class="mt-6 mr-2 inline-flex items-center text-white bg-blue-600 rounded-full px-4 py-2 hover:bg-teal-900 font-semibold lowercase duration-700">' +
            '<i class="fas fa-user"></i>&nbsp;&nbsp;&nbsp;' + player.name +
            '</span>'
    });

    bracketsView.html(playersHtmlBody)
    createTournamentBtn.show()
}


async function createTournament() {
    const rawResponse = await fetch(baseUrl + "tournament", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            numberOfPlayers: numberOfPlayers,
            competitors: players
        })
    });
    if (rawResponse.status == 200) {
        window.location = "tournaments"
    }
}



async function startTournament() {
    const rawResponse = await fetch(baseUrl + "tournament/generate-matches/" + getLastUrlParam(), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    if (rawResponse.status == 200) {
        window.location = ""
    }
}



// function runFunctionsForSpecificRoutes(route, nestedFunction) {
//     if (window.location.pathname == route) {
//         nestedFunction()
//     }
// }


function getLastUrlParam() {
    const pathSegments = window.location.pathname.split('/')
    var lastSegment = pathSegments.pop() || pathSegments.pop();  // handle potential trailing slash
    return lastSegment
}



async function submitScore() {
    const payload = {
        "match_id": competitorData.match_id,
        "match_competitor_id": competitorData.id,
        "score": Number($("#score").val())
    }

    const rawResponse = await fetch(baseUrl + "tournament/submit-score", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (rawResponse.status == 200) {
        window.location = ""
        $("#score").val("")
    }


}

// async function fetchMatches(tournamentId){
//     const response = await fetch(baseUrl + "matches/"+getLastUrlParam(), {
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// }

function openScoreModal(data) {
    competitorData = JSON.parse(data)
    document.getElementById('modal').classList.toggle('hidden')
}

function closeScoreModal(){
    document.getElementById('modal').classList.toggle('hidden')
}