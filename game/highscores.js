const fs = require('fs')

let insanity2Info = {}
const loadLocalStorage = () => {
    let i = localStorage.getItem('insanity2Info')
    insanity2Info = i ? JSON.parse(i) : resetCache()
    //levelCounter.innerText = 'Level: ' + Number(insanity2Info.levelIndex+1)
    //deathCounter.innerText = 'Deaths: ' + Number(insanity2Info.deaths)
}
loadLocalStorage()

const saveHighScore = (name, score) => {
    let raw = fs.readFileSync('highscores.json')
    let highscores = JSON.parse(raw)
    highscores[name] = score
    console.log(highscores)
    fs.writeFileSync('highscores.json', JSON.stringify(highscores))
}

saveHighScore("TST", insanity2Info.deaths)

//-----------------------------------

const sort = (object) => {
    let sorted = []
    let newObject = {}
    for (let key in object) {
        sorted.push(object[key])
    }
    sorted.sort((a, b) => {return a-b})
    for (let item of sorted) {
        for (let key in object) {
            if (object[key] === item) {
                newObject[key] = item
            }
        }
    }
    return newObject
}

let highScoreDiv
const loadHighScores = () => {
    let raw = fs.readFileSync('highscores.json')
    let data = JSON.parse(raw)
    let highScores = sort(data)
    for (let key in highScores) {
        //highScoresDiv.innerHTML += `${key}: ${highScores[key]}<br>`
        highScoreDiv += `${key}: ${highScores[key]}\n`
    }
}

loadHighScores()