const names = require('../assets/names.json')

class NameHelper{
    async generateRandomName(){
        const randomNameIndex = Math.floor(Math.random() * names.length - 1)
        return names[randomNameIndex]
    }
}


module.exports = NameHelper;