let highScoresDiv = document.querySelector('#highScores')
highScoresDiv.innerHTML = ''

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

let request = new XMLHttpRequest()
request.open('GET', './highscores.json')
request.responseType = 'json'
request.send()
request.onload = () => {
    let highScores = sort(request.response)
    for (let key in highScores) {
        highScoresDiv.innerHTML += `${key}: ${highScores[key]}<br>`
    }
}