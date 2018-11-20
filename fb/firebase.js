// Initialize Firebase
var config = {
    apiKey: "AIzaSyAsmm45HcFWbQpAJfZTtLUPKCQrmyqDBLg",
    authDomain: "insanity2-27cd2.firebaseapp.com",
    databaseURL: "https://insanity2-27cd2.firebaseio.com",
    projectId: "insanity2-27cd2",
    storageBucket: "insanity2-27cd2.appspot.com",
    messagingSenderId: "130163424798"
    };
firebase.initializeApp(config)

//Load the firebase reference
let ref = firebase.database().ref('players/')

//Get the high scores div
let highScoresDiv = document.querySelector('#highScores')

//Saves the high score sent in by game.js at the end

const saveHighScore = (x, y) => {
    ref.push({
        user: x,
        score: y
    })
}

//-------------------------
//Load the high scores, sort them, and put them into the right div

const sort = (object) => {
    let sorted = []
    let string = ''
    for (let key in object) {
        sorted.push(object[key].score)
    }
    sorted.sort((a, b) => {return a-b})
    for (let i = 0; i<sorted.length; i++) {
        for (let item in object) {
            if (object[item].score === sorted[i]) {
                string += `${object[item].user} --- ${object[item].score}<br>`
            }
        }
    }
    return string
}




let leaderboard = document.querySelector('#highScores')

let scores = {}
//Load high scores and put them on the leader board
if (leaderboard) {
    ref.on("value", (snapshot) => {
        leaderboard.innerHTML = ''
        let data = snapshot.val()
        leaderboard.innerHTML += sort(data)
    }, (error) => {
        console.log("Error: " + error.code);
    })
}

//leaderboard.innerHTML += `Name: ${data[item].user} --- Score: ${data[item].score}<br>`