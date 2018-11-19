let highScoresDiv = document.querySelector('#highScores')

let insanity2Info = {}
const load = () => {
    let i = localStorage.getItem('insanity2Info')
    insanity2Info = i ? JSON.parse(i) : resetCache()
}

const saveHighScore = () => {
    load()
    let highScore = insanity2Info.deaths
    let user = insanity2Info.user

    highScores[user] = insanity2Info.deaths
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
    let data = sort(highScores)
    for (let key in data) {
        obj[key] = data[key]
        highScoresDiv.innerHTML += `${key}: ${data[key]}<br>`
        //highScoreDiv += `${key}: ${highScores[key]}\n`
    }
    highScores = obj
}
loadHighScores() 
