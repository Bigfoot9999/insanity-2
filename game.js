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
    //levelCounter.innerText = 'Level: ' + Number(insanity2Info.levelIndex+1)
    //deathCounter.innerText = 'Deaths: ' + Number(insanity2Info.deaths)
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

let score = 0
let leftV = -160
let rightV = 160
let upV = -160

let deathCounter, levelCounter

const deathCounterStyle = {
    fontSize: '6em',
    fontFamily: '-apple-system BlinkMacSystemFont Segoe UI Roboto Oxygen Ubuntu Cantarell Open Sans Helvetica Neue sans-serif',
    color: 'white',
    zIndex: 11,
}

const levelCounterStyle = {
    fontSize: '6em',
    fontFamily: '-apple-system BlinkMacSystemFont Segoe UI Roboto Oxygen Ubuntu Cantarell Open Sans Helvetica Neue sans-serif',
    color: 'white',
    zIndex: 11,
}

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
        'xxxxxxxxjjx!!!rrr!!!!!!!!!!!!!!xxxxx!!jj!!!!!!x   x',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x    o            o                               x',
        'x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!lll!!!!!!!!!!!!!llllx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [

    ],
]

//Sets up the object that gets passed into the game

let gameObject = {
    width: 1420, //Dimensions of the game
    height: 1000,
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
            this.load.image('background1', './game-assets/backgrounds/stone-background1.png')
            this.load.image('background2', './game-assets/backgrounds/wood-background.png')
            this.load.image('playerSkin1', './game-assets/skins/playerSkin1.png')
            //this.load.image('playerSkin2', './game-assets/images/playerSkin2.png')
            //this.load.image('playerSkin3', './game-assets/images/playerSkin3.png')
            this.load.spritesheet('player2Skin', './game-assets/skins/playerSkin2.png', {frameWidth: 16, frameHeight: 16, endFrame: 10})
            this.load.image('wall', './game-assets/other/wall.png')
            this.load.image('death', './game-assets/other/lava.jpg')
            this.load.spritesheet('speed', './game-assets/other/speed.png', {frameWidth: 16, frameHeight: 16, endFrame: 7})
            this.load.spritesheet('jump', './game-assets/other/trampoline.png', {frameWidth: 16, frameHeight: 16, endFrame: 5})
            this.load.spritesheet('coin', './game-assets/other/coins.png', {frameWidth: 16, frameHeight: 16, endFrame: 7})
            //this.load.audio('collect', '/game-assets/audio/Mario-coin-sound.mp3')
            //this.load.audio('die', '/game-assets/audio/beep-03.mp3')

        },
        create() { //Sets up the game

            //Will destroy the player if there is a new level
            if (insanity2Info.levelIndex !== 0 && !insanity2Info.newSession) {
                this.player.destroy()
            }
            insanity2Info.newSession = false

            //Sets up the background and player
            this.add.image(0, 0, 'background1').setOrigin(0, 0)
            //this.player = this.physics.add.sprite(playerX, playerY, insanity2Info.playerSkin) // sets this.player equal to the sprite
            this.player = this.physics.add.sprite(100, 100, 'playerSkin1')
            this.player.setCollideWorldBounds(true)
            
            //sets up the input
            this.cursors = this.input.keyboard.createCursorKeys()

            //Sets up the groups of items
            this.walls = this.physics.add.staticGroup()
            this.coins = this.physics.add.staticGroup()
            this.deathBlocks = this.physics.add.staticGroup()
            this.speedLeftBlocks = this.physics.add.staticGroup()
            this.speedRightBlocks = this.physics.add.staticGroup()
            this.jumpBlocks = this.physics.add.staticGroup()

            //Sets up physics
            this.physics.add.collider(this.player, this.jumpBlocks, this.jump, null, this)
            this.physics.add.collider(this.player, this.speedLeftBlocks, this.speedLeft, null, this)
            this.physics.add.collider(this.player, this.speedRightBlocks, this.speedRight, null, this)
            this.physics.add.collider(this.player, this.walls, this.stopV, null, this);
            this.physics.add.overlap(this.player, this.coins, this.takeCoin, null, this)
            this.physics.add.overlap(this.player, this.deathBlocks, this.restart, null, this)

           //Sets up the animations
        this.anims.create({
            key: 'coinSpin',
            frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 6, first: 6}), 
            framerate: 5,
            repeat: -1,
        })
        this.anims.create({
            key: 'speedRight',
            frames: this.anims.generateFrameNumbers('speed', {start: 0, end: 3, first: 3}),
            framerate: 7,
            repeat: -1,

        })
        this.anims.create({
            key: 'speedLeft',
            frames: this.anims.generateFrameNumbers('speed', {start: 4, end: 7, first: 7}),
            framerate: 7,
            repeat: -1,

        })
        this.anims.create({
            key: 'jumpUp',
            frames: this.anims.generateFrameNumbers('jump', {start: 0, end: 5, first: 5}),
            framerate: 4,
            repeat: 0,
        })
        if (insanity2Info.playerSkin === 'playerSkin2') {
            this.anims.create({
                key: 'rainbow',
                frames: this.anims.generateFrameNumbers('player2Skin', {start: 0, end: 9, first: 9}),
                framerate: 5,
                repeat: -1,
            })
            this.player.play('rainbow')
        }
            //Creates the level
            this.createLevel()

            //Sets up text
            deathCounter = this.add.text(1000, 600, `Deaths: ${insanity2Info.deaths}`, deathCounterStyle)
            levelCounter = this.add.text(1000, 525, `Level: ${insanity2Info.levelIndex+1}`, levelCounterStyle)
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
                    levelCounter.setText(`Level: ${insanity2Info.levelIndex+1}`)
                    this.create()
                    save()
                }
            collectedCoin = true
            died = true

            //Creates text
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
                            coin.play('coinSpin')
                            this.coins.add(coin);
                        }
                
                        // Create a lava space and add it to the 'lavas' group
                        else if (levels[insanity2Info.levelIndex][i][j] == '!') {
                            let death = this.add.sprite(30+16*j, 30+16*i, 'death');
                            this.deathBlocks.add(death);
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'r') {
                            let speed = this.add.sprite(30+16*j, 30+16*i, 'speed')
                            this.speedRightBlocks.add(speed)
                            speed.play('speedRight')
                            speed.immovable = true; 
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'l') {
                            let speed = this.add.sprite(30+16*j, 30+16*i, 'speed')
                            this.speedLeftBlocks.add(speed)
                            speed.play('speedLeft')
                            speed.immovable = true; 
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'j') {
                            let jump = this.add.sprite(30+16*j, 30+16*i, 'jump')
                            this.jumpBlocks.add(jump)
                            jump.play('jumpUp')
                            jump.immovable = true; 
                        }
                    }
                }
            },
            stopV() {
                upV = -160
                leftV = -160
                rightV = 160
            },
            takeCoin(player, coin) {
                coin.anims.isPlaying = false
                coin.destroy()
                if (collectedCoin) {
                    //this.sound.play('collect')
                    score += 1
                    collectedCoin = false
                }
            },
            restart(player, deathBlock) {
                this.coins.getChildren().map(child => {this.coins.killAndHide(child)})
                leftV = -160
                rightV = 160
                player.x = 100
                player.y = 100
                score = 0
                if (died) {
                    //this.sound.play('die')
                    died = false
                    insanity2Info.deaths += 1
                }
                for (let i = 0; i < levels[insanity2Info.levelIndex].length; i++) {
                    for (let j = 0; j < levels[insanity2Info.levelIndex][i].length; j++) {
                        if (levels[insanity2Info.levelIndex][i][j] == 'o') {
                            let coin = this.add.sprite(30+16*j, 30+16*i, 'coin');
                            coin.play('coinSpin')
                            this.coins.add(coin);
                        }
                    }
                }
                deathCounter.setText(`Deaths: ${insanity2Info.deaths}`)
                save()
            },
            speedRight() {
                upV = -160
                this.player.x += .5
                if (this.cursors.left.isDown) {
                    leftV = -160
                } else if (this.cursors.right.isDown) {
                    rightV = 220
                    setTimeout(() => {rightV = 160}, 5000)
                }
            },
            speedLeft() {
                upV = -160
                this.player.x -= .5
                if (this.cursors.right.isDown) {
                    rightV = 160
                } else if (this.cursors.left.isDown) {
                    leftV = -220
                    setTimeout(() => {leftV = -160}, 5000)
                } 
            },
            jump(player, block) {
                rightV = 160
                leftV = -160
                if (this.cursors.up.isDown) {
                    block.play('jumpUp')
                    setTimeout(() => {block.isPlaying = false}, 500)
                    upV = -220
                    setTimeout(() => {upV = -160}, 5000)
                } else {
                    block.play('jumpUp')
                    setTimeout(() => {block.isPlaying = false}, 500)
                    this.player.setVelocityY(-120)
                }
            }
        }
    }
}

//Run the game
let game = new Phaser.Game(gameObject)