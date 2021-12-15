class BracketHelper {
    getRoundData({
        competitingPlayers,
        round,
    }) {
        var roundMatches = []
        var count = 0
        while (competitingPlayers > 1) {
            competitingPlayers = Math.floor(competitingPlayers / 2); // Update the value of `value`
            roundMatches.push({
                round: count + 1,
                totalMatches: competitingPlayers
            })
            count++;
        }

        if(round == "*"){
            return roundMatches
        }else{
            return roundMatches.filter((x) => { return x.round == round })[0]
        } 
    }


    getNextRoundPosition({totalMatches, matchNumber}) {
        var previousMatches = []
        var matchGroup = []
        for (let index = 1; index <= totalMatches; index++) {
            if (index % 2 === 0) {
                matchGroup.push(index)
                previousMatches.push(matchGroup)
                matchGroup = []
            } else {
                matchGroup.push(index)
            }
        }

        var positionForNextRound

        previousMatches.forEach((element, matchGroupIndex) => {
            element.forEach(sortId => {
                if(sortId === matchNumber){
                    positionForNextRound = matchGroupIndex
                }
            });
        });
        return positionForNextRound + 1
    }
    
}

module.exports = BracketHelper