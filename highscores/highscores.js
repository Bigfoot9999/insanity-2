let highScoresDiv = document.querySelector('#highScores')

let info = {}
const loadLocalStorage = () => {
    let i = localStorage.getItem('insanity2Info')
    info = i ? JSON.parse(i) : resetCache()
}
loadLocalStorage()

const saveHighScore = () => {
    let user = info.user
    highscores[user] = info.deaths
    loadHighScores()
}

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

let obj = {}
const loadHighScores = () => {
    highScoresDiv.innerHTML = ''
    let data = sort(highscores)
    for (let key in data) {
        obj[key] = data[key]
        highScoresDiv.innerHTML += `${key}: ${data[key]}<br>`
        //highScoreDiv += `${key}: ${highScores[key]}\n`
    }
}
loadHighScores() 
