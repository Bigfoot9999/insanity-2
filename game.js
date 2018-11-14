//Copyright 2018 Ethan Baker. All rights reserved.
//Email ethandbaker01@gmail.com for additional rights.

//Loading local storage functions

let insanity2Info = {
    deaths: 0,
    levelIndex: 0,
    playerSkin: 'playerSkin1',
    newSession: true,
}

let defaultCache = () => JSON.parse(JSON.stringify({
    deaths: 0,
    levelIndex: 0,
    playerSkin: 'playerSkin1',
    newSession: true,
}))

const resetCache = () => insanity2Info = defaultCache()

const load = () => {
    let i = localStorage.getItem('insanity2Info')
    insanity2Info = i ? JSON.parse(i) : resetCache()
    insanity2Info.newSession = true
    levelCounter.innerText = 'Level: ' + Number(insanity2Info.levelIndex+1)
    deathCounter.innerText = 'Deaths: ' + Number(insanity2Info.deaths)
}

const save = () => {
    localStorage.setItem('insanity2Info',JSON.stringify(insanity2Info))
}

const resetStorage = () => {
    insanity2Info = {
        deaths: 0,
        levelIndex: 0,
        playerSkin: 'playerSkin1',
        newSession: true,
    }
    save()
    location.reload()
}

//Sets up variables used in the game object
let deathCounter = document.querySelector('#deathCounter')
let levelCounter = document.querySelector('#levelCounter')

let score = 0
let leftV = -160
let rightV = 160
let upV = -160

const levels = [
    [
        'xxxxxxxxxxxxxxxxxxxxxxx',
        'x!         !          x',
        'x!                 o  x',
        'x!         o          x',
        'x!                    x',
        'x!     o   !    x     x',
        'xxxxxxxxxxxxxxxxx!!!!!x',
        'xxxxxxxxxxxxxxxxxxxxxxx'
    ], 
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x     x                                           x',
        'x     x                                       x   x',
        'x     x  o                                    x   x',
        'x     x                                       x   x',
        'x     x                                  xxxjjx   x',
        'x     x                                       x   x',
        'x                                             x   x',
        'xxxxxxxxjjx!!!sss!!!!!!!!!!!!!!xjjjj!!!!!!!!!!x   x',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x    o            o                               x',
        'x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!sss!!!!!!!!!!!!!ssssx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [

    ],
]


//Sets up the object that gets passed into the game

let gameObject = {
    width: 1000, //Dimensions of the game
    height: 800,
    physics: { //Physics of the game
        default: 'arcade',
        arcade: { //Type of physics
            gravity: { //Sets up gravity for the game
                y: 300,
                x: 0,
            },
            //debug: true,
        },
    },
    scene: { //Parts of the game that make it work
        preload() { //Pre-loads images and audio in the game to reduce lag
            load()
            this.load.image('background', './assets/images/background.png')
            this.load.image('playerSkin1', './assets/images/playerSkin1.png')
            //this.load.image('playerSkin2', './assets/images/playerSkin2.png')
            //this.load.image('playerSkin3', './assets/images/playerSkin3.png')
            this.load.spritesheet('player2Skin', './assets/images/playerSkin2.png', {frameWidth: 16, frameHeight: 16, endFrame: 10})
            this.load.image('wall', './assets/images/wall.png')
            this.load.image('death', './assets/images/death.png')
            this.load.image('speed', './assets/images/speed.png')
            this.load.image('jump', './assets/images/jump.png')
            this.load.image('coin', './assets/images/coin.png')
        },
        create() { //Sets up the game
            //Will destroy the player if there is a new level
            if (insanity2Info.levelIndex !== 0 && !insanity2Info.newSession) {
                this.player.destroy()
            }
            insanity2Info.newSession = false

            //Sets up the background and player
            this.add.image(0, 0, 'background').setOrigin(0, 0)
            //this.player = this.physics.add.sprite(playerX, playerY, insanity2Info.playerSkin) // sets this.player equal to the sprite
            this.player = this.physics.add.sprite(100, 100, 'playerSkin1')
            this.player.setCollideWorldBounds(true)
            
            //Sets up the animations
            console.log(this)
            if (insanity2Info.playerSkin === 'playerSkin2') {
                this.anims.create({
                    key: 'rainbow',
                    frames: this.anims.generateFrameNumbers('player2Skin', {start: 0, end: 9, first: 9}),
                    framerate: 10,
                    repeat: -1,
                })
                this.player.play('rainbow')
            }

            //sets up the input
            this.cursors = this.input.keyboard.createCursorKeys()

            //Sets up the groups of items
            this.walls = this.physics.add.staticGroup()
            this.coins = this.physics.add.staticGroup()
            this.deathBlocks = this.physics.add.staticGroup()
            this.speedBlocks = this.physics.add.staticGroup()
            this.jumpBlocks = this.physics.add.staticGroup()

            //Sets up physics
            this.physics.add.collider(this.player, this.speedBlocks, this.speed, null, this)
            this.physics.add.collider(this.player, this.jumpBlocks, this.jump, null, this)
            this.physics.add.collider(this.player, this.walls);
            this.physics.add.overlap(this.player, this.coins, this.takeCoin, null, this)
            this.physics.add.overlap(this.player, this.deathBlocks, this.restart, null, this)

            //Creates the level
            this.createLevel()
        },
        update() { //Checks for events in the game; runs every "tick"
            if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down === true ) { //&& (this.player.body.touching.right === false && this.player.body.touching.left === false)
                    this.player.setVelocityY(upV)
                } else if (this.cursors.left.isDown) { //if the cursor (input) key is down, the player will move left (-x direction)
                    this.player.setVelocityX(leftV)
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(rightV)
                } else {
                    this.player.setVelocityX(0)
                }
                if (score === 3) {
                    insanity2Info.levelIndex += 1
                    score = 0
                    levelCounter.innerText = 'Level: ' + Number(insanity2Info.levelIndex+1)
                    this.create()
                    save()
                }
                collectedCoin = true
                died = true
        },
        extend: { //Extra functions to run
            createLevel() {
                for (let i = 0; i < levels[insanity2Info.levelIndex].length; i++) {
                    for (let j = 0; j < levels[insanity2Info.levelIndex][i].length; j++) {
                
                        // Create a wall and add it to the 'walls' group
                        if (levels[insanity2Info.levelIndex][i][j] == 'x') {
                            let wall = this.add.sprite(30+16*j, 30+16*i, 'wall');
                            this.walls.add(wall);
                            wall.immovable = true; 
                        }
                
                        // Create a coin and add it to the 'coins' group
                        else if (levels[insanity2Info.levelIndex][i][j] == 'o') {
                            let coin = this.add.sprite(30+16*j, 30+16*i, 'coin');
                            this.coins.add(coin);
                        }
                
                        // Create a lava space and add it to the 'lavas' group
                        else if (levels[insanity2Info.levelIndex][i][j] == '!') {
                            let death = this.add.sprite(30+16*j, 30+16*i, 'death');
                            this.deathBlocks.add(death);
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 's') {
                            let speed = this.add.sprite(30+16*j, 30+16*i, 'speed')
                            this.speedBlocks.add(speed)
                            speed.immovable = true; 
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'j') {
                            let jump = this.add.sprite(30+16*j, 30+16*i, 'jump')
                            this.jumpBlocks.add(jump) 
                            jump.immovable = true; 
                        }
                    }
                }
            },
            takeCoin(player, coin) {
                coin.destroy()
                if (collectedCoin) {
                    score += 1
                    collectedCoin = false
                }
            },
            restart(player, deathBlock) {
                player.x = 100
                player.y = 100
                score = 0
                if (died) {
                    console.log(this)
                    console.log(deathBlock)
                    console.log(player)
                    died = false
                    insanity2Info.deaths += 1
                }
                for (let i = 0; i < levels[insanity2Info.levelIndex].length; i++) {
                    for (let j = 0; j < levels[insanity2Info.levelIndex][i].length; j++) {
                        if (levels[insanity2Info.levelIndex][i][j] == 'o') {
                            let coin = this.add.sprite(30+16*j, 30+16*i, 'coin');
                            this.coins.add(coin);
                        }
                    }
                }
                deathCounter.innerText = 'Deaths: ' + insanity2Info.deaths
                save()
            },
            speed() {
                upV = -160
                if (this.cursors.left.isDown) {
                    leftV = -220
                    setTimeout(() => {leftV = -160}, 5000)
                } else if (this.cursors.right.isDown) {
                    rightV = 220
                    setTimeout(() => {rightV = 160}, 5000)
                }
            },
            jump() {
                rightV = 160
                leftV = -160
                if (this.cursors.up.isDown) {
                    upV = -220
                    setTimeout(() => {upV = -160}, 5000)
                }
            }
        }
    }
}

//Run the game
let game = new Phaser.Game(gameObject)