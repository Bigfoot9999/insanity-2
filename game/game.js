//Copyright 2018 Ethan Baker. All rights reserved.
//Email ethandbaker01@gmail.com for additional rights.

//Loading local storage functions

let insanity2Info = {
    deaths: 0,
    levelIndex: 0,
    playerSkin: 'playerSkin1',
    newSession: true,
    background: 'background1',
    user: '',
}

let defaultCache = () => JSON.parse(JSON.stringify({
    deaths: 0,
    levelIndex: 0,
    playerSkin: 'playerSkin1',
    newSession: true,
    background: 'background1',
    user: '',
}))

const resetCache = () => insanity2Info = defaultCache()

let first = true
const load = () => {
    let i = localStorage.getItem('insanity2Info')
    insanity2Info = i ? JSON.parse(i) : resetCache()
    if (first) {
        insanity2Info.newSession = true
        first = false
    }
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
        background: 'background1',
        user: '',
    }
    save()
    location.reload()
}

//Sets up variables used in the game object

let score = 0
let leftV = -160
let rightV = 160
let upV = -160

let switchOff = false
let ran = true
let switchStatus, switched

let deathCounter, levelCounter

let deathCount, levelCount

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
        'x                                x                x',
        'x                                x                x',
        'x                                x       o        x',
        'x                                x                x',
        'x                                x                x',
        'x                                x               xx',
        'xxxxxxxxxxxx                     x!!!!!x          x',
        'xxxxxxxxxxxx                     x                x',
        'xxxxxxxxxxxx                s    x           x    x',
        'xxxxxxxxxxxx                   o x           !    x',
        'xxxxxxxxxxxx!!        xxxxxxxxxxxx!!!x            x',
        'xxxxxxxxxxxx                     x                x',
        'xxxxxxxxxxxx                     x         x      x',
        'xxxxxxxxxxxx                     d         !      x',
        'xxxxxxxxxxxx                     d               xx',
        'xxxxxxxxxxxx                o    x                x',
        'xxxxxxxxxxxx!!!!!!!xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                                             xo  x',
        'x                                             x   x',
        'x                                             x  xx',
        'x                                             x   x',
        'x                                             xx  x',
        'x                                             x   x',
        'x                                             x  xx',
        'xxxxxxxxxtttttttttttttttttttttttttttttttttttttxtttx',
        'xwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww!!!!!!xwwwx',
        'xwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxwwwx',
        'xwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwOwxwwwx',
        'xwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxwwwx',
        'xwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww!!!!!!xwwwx',
        'x!www!wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxwwwx',
        'x!www!wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwxwwwx',
        'x!wOw!wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 
    ],
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x     x     x                                     x',
        'x     x     x                                 x   x',
        'x     x  o  x                                 x   x',
        'x     x     x                                 x   x',
        'x     x     x                            xxxjjx   x',
        'x     x     xxxx                              x   x',
        'x      p                                      x   x',
        'xxxxxxxxjjxx   rr!!!!!!!!!!!!!!xxxxx!!jj!!!!!!x   x',
        'xxxxxxxxxxxx!!!!!!xxxxxxxxxxxxxxxxxxxxxxxxxxxxx   x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x    o            o                               x',
        'x!!!!x!!!!!!!!!!!jx!!!!!!!!!!!lll!!!!!!!!!!!!!llllx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                                                 x',
        'x                                                ox',
        'x                                                 x',
        'x                                                 x',
        'x                                         x       !',
        'x                                x        x    rrr!',
        'x                 rrrr                    !       !',
        'x                                         !lll    x',
        'xxxxxxx      j                            !       x',
        'x!!!!!!!   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!x!!!!   x',
        'x                                                 x',
        'x                                                 x',
        'x                                                 x',
        'x          p                                      x',
        '!         xxxxxx                                  x',
        '!lllll    !                                       x',
        '!         !          j        o                   x',
        'x    rrrrr!                   x                   x',
        'x      !!!!                                       x',
        'x         !                                       x',
        'x         !                                       x',
        'x        o!                           j         xxx',
        'x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!x',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x               !!!!!!!!!!!!!!!!              x',
        'x               !!!!!!!!!!!!!!!               x',
        'x               !!!!!!!!!!!!!!                x',
        'x               !!!!!!!!!!!!!    xttttttttttttx',
        'x               !!!!!!!!!!!!     xwwww!wwwwwwwx',
        'x               !!!!!!!!!!!!     xww!wwwwwww!wx',
        'xxxxxxxxxxx    !!!!!!!!!!!!!    jxwwwwwwwwwwwwx',
        'x!!!!!!!!!    !!!!!!!!!!!!!!     x!!!!!!wwwww!x',
        'x!!!!!!!!    !!!!!!!!!!!!!!!     xwwwwwwwwwwwwx',
        'x!!!!!!!    !!!!!!!!!!!!!!!!j    xwwwwwwww!!!!x',
        'x!!!!!!    !!!!!!!!!!!!!!!!!     xwwwww!!!!wwwx',
        'xxxxx!    !!!!xxxxxxxxxxxxxx    xxwwww!wwww!wwx',
        'x o                              xwww!wwwwwwwwx',
        'xxxxxxxxxxxxxxxxxxxx    xxxxxxxxxx!ww!wwwwwwwwx',
        'xxxxxxxxxxxxxxxxxxx!    !xxxxxxxxx!wwwwwwww!wwx',
        'xxxxxxxxxxxxxxxxxxx!   r!xxxxxxxxx!wwwwwwwww!wx',
        'xxxxxxxxxxxxxxxxxxx!    !xxxxxxxxx!!wwww!wwww!x',
        'xxxxxxxxxxxxxxxxxxx!l   !xxxxxxxxx!!!ww!!wwww!x',
        'xxxxxxxxxxxxxxxxxxx!    !xxxxxxxxx!!!!!!!www!wx',
        'xxxxxxxxxxxxxxxxxxx!o  r!xxxxxxxxx!!!!!!!!wwwOx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ], 
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                           x         !                  x',
        'x                           !                            x',
        'x                                     o                  x',
        'x                           o                            x',
        'x                                     x  !!!!!xxx        x',
        'x                           x         !!!!!!!!!xx        x',
        'xxxxxxxxxxrrrrrr          !!!!!!!!!!!!!!!!!!!!!!x        x',
        'x!!!!!!!!!!!!!!!!!!!!!!!!!!         !!!!!!!!!!!!!       !x',
        'x                       x           !!!!!!!!!!!!       !!x',
        'x                                 o !!!!!!!!!!!       !!!x',
        'x                                   !!!!!!!!!!       !!!!x',
        'x                  xrr      DD!!!!!!!!!!!!!!!       !!!!!x',
        'x      rrr                  !!!!!!!!!!!!!!!!       !!!!!!x',
        'x                           !!!!!!!!!!!!!!!       !!!!!!!x',
        'x   x                       !!!!!!!!!!!!!!       !!!!!!!!x',
        'x                                   !!!!!       !!!!!!!!!x',
        'xS     x                            !!!!         !!!!!!!!x',
        'x                 llx               !!!          !!!!!!!!x',
        'x              x                                 !!!!!!!!x',
        'x                           x                  rr!!!!!!!!x',
        'x                                          !!!!!!!!!!!!!!x',
        'xx          j                       jjxxxx!!!!!!!!!!!!!!!x',
        'x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!x',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x!                     !!x!!!               !!!!!!!!!!!!!!!x',
        'x                       !x!!                    !!!!!!!!!!!x',
        'x  xxxxxxxxxxxx         !x!            rr        !!!!!!!!!!x',
        'x  x                 ll!x             !!!!!       !!!!!!!!!x',
        'x  x    ddxxx         !!x             !!  !!       !!!!!!!!x',
        'x  xxx      x!x!!!!!!!!!x             !! o !!       !!!!!!!x',
        'x   x        xxxxxxxxxxxxx!jj         !!    !!       !!!!!!x',
        'x   x                 s  !!!!         !!     !!       !!!!!x',
        'x!  x                    !!!          !!xx    !!       !!!!x',
        'x!  x      j            !!!          j!!       !!       !!!x',
        'x!  x                   !!            !!     xx!!       !!!x',
        'x!  x                  !!           x !!       !!       !!!x',
        'x!  x              j   !           xxx!!xx      !!     !!!!x',
        'x!  x             xxx!!       o       !!        !!     !!!!x',
        'x!  x!!!!    xx!!!!!!       xxxx!     !!     x   !!   !!!!!x',
        'x!       !xxx!!             !!!!!!!!!!!!     !!!!!!   !!!!!x',
        'x!                      x!!!!!!!!!!!!!!!xx    !!!        o x',
        'x!                    !!!!!!!!!!!!!!!!!!!!!    !dddxxxxxxxxx',
        'xxrrr!!            x!!!!!!!!!!!!!!!!!!!!!!!!       !!!!!!!!x',
        'xxxxxx!!xxxxx!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!j     !!!!!!!!x',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x!!!!!!x                                     x',
        'x!!!!!!x    llxxxxxxxxxxxxxxxx            x  x',
        'x!!!!!!x  !!!!!!!!!!!!!!!!!!!!!!xxx    xx!!x x',
        'x                !!! !!!!!!!!!!!!xx          x',
        'x!!x     x         !!!!!!!!!!!!!!!!      xxxxx',
        'xo d     x           !!!!!!!!!!!!xxx         x',
        'xxxxxxxxxx             !!!!!!!!!!!!!xttttttttx',
        'x!!!!!!!!!               !!!!!!!!!!!xwwwwww!!x',
        'x!!!!!!!!!     !!!!        !!!!!!!!!xwwwwwwwwx',
        'x!!!!!!!!!   !!xxxx!       !!!!!!!!!x!!!!wwwwx',
        'xxxxxxxxxxjj!!xxxxxx!      !!!!xxxx!xwwwwwwwwx',
        'x!!wwwwwwwwww!xxxxxx!      !!!Owwwwwwwwwwwwwwx',
        'x!!www!!!wwww!xxxxxx!      !!!xx!!xxxwwwww!!!x',
        'x!!ww!!!!wwww!xxxxxx!      !!!!!!!!!xwwwwwwwwx',
        'x!!ww!!!!!wwww!xxxx!       !!!!!!!!!x!wwwwwwwx',
        'x!!ww!!!!!!wwww!!!!        !!!!!!!!!xwwwwww!!x',
        'x!!ww!!!!!!!wwwwwww       !!!!x!!!!!xwwwwwwwwx',
        'x!!wwxxxxxxxxwwwwww     !!!!! s    !x!!!!wwwwx',
        'x!!wwxxxxxxxxxxxxxx   !!!!!!!x      xwwwwwwwwx',
        'xxxwwxxxxxxxxxxxxxxjjjxxxxxxxxx     xxxxxxwwxx',
        'x              !!!!!!!!    !!!!x    d   !    x',
        'x               !!!!!!      !!!!!   d   !    x',
        'x                                   x   !    x',
        'xrrrr                              jx    j   x',
        'x!!!!                               x        x',
        'x!!!!llll       rrr     jj    r     x       xx',
        'x!!!!!!!!!    !!!!!!!!!!!!!!!!!!!!!!x x     ox',
        'x!!!!!!!!!!jj!!!!!!!!!!!!!!!!!!!!!!!x       xx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx!!!!!!!xx',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ]
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
            this.load.image('background1', './game-assets/backgrounds/stone-background-dark.png')
            this.load.image('background2', './game-assets/backgrounds/wood-background.png')
            this.load.image('playerSkin1', './game-assets/skins/playerSkin1.png')
            this.load.spritesheet('playerSkin2', './game-assets/skins/playerSkin2.png', {frameWidth: 16, frameHeight: 16, endFrame: 10})
            //this.load.image('playerSkin3', './game-assets/images/playerSkin2.png')
            //this.load.image('playerSkin4', './game-assets/images/playerSkin3.png')
            this.load.image('wall', './game-assets/other/wall.png')
            this.load.image('death', './game-assets/other/lava.jpg')
            this.load.spritesheet('speed', './game-assets/other/speed.png', {frameWidth: 16, frameHeight: 16, endFrame: 7})
            this.load.spritesheet('jump', './game-assets/other/trampoline.png', {frameWidth: 16, frameHeight: 16, endFrame: 5})
            this.load.spritesheet('coin', './game-assets/other/coins.png', {frameWidth: 16, frameHeight: 16, endFrame: 7})
            this.load.spritesheet('waterCoin', './game-assets/other/water-coins.png', {frameWidth: 16, frameHeight: 16, endFrame: 7})
            this.load.spritesheet('waterTop', './game-assets/other/water-top.png', {frameWidth: 16, frameHeight: 16, endFrame: 8})
            this.load.image('water', './game-assets/other/water.png')
            this.load.image('switchUp', './game-assets/other/switch-up.png')
            this.load.image('switchDown', './game-assets/other/switch-down.png')
            this.load.image('switchDoor', './game-assets/other/red-door.png')
            this.load.image('emptyDoor', './game-assets/other/empty-door.png')
            this.load.image('pushBlock', './game-assets/other/push-block.png')
            //this.load.audio('collect', '/game-assets/audio/Mario-coin-sound.mp3')
            //this.load.audio('die', '/game-assets/audio/beep-03.mp3')



        },
        create() { //Sets up the game
            //Prevents cheating
            levelCount = insanity2Info.levelIndex

            //Will destroy the player if there is a new level
            if (insanity2Info.levelIndex !== 0 && !insanity2Info.newSession) {
                this.player.destroy()
            } else {
                //Sets up the animations
                this.anims.create({
                    key: 'coinSpin',
                    frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 6, first: 6}), 
                    framerate: 5,
                    repeat: -1,
                })
                this.anims.create({
                    key: 'waterCoinSpin',
                    frames: this.anims.generateFrameNumbers('waterCoin', {start: 0, end: 7, first: 7}),
                    framerate: 5,
                    repeat: -1
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
                this.anims.create({
                    key: 'waves',
                    frames: this.anims.generateFrameNumbers('waterTop', {start: 0, end: 8, first: 8}),
                    framerate: 12,
                    repeat: -1,
                })
                this.anims.create({
                    key: 'rainbow',
                    frames: this.anims.generateFrameNumbers('playerSkin2', {start: 0, end: 9, first: 9}),
                    framerate: 5,
                    repeat: -1,
                })
                insanity2Info.newSession = false
            }

            if (insanity2Info.playerSkin === 'playerSkin2') {
                    this.player.play('rainbow')
            }

            //Sets up the background
            if (insanity2Info.levelIndex === 9) {
                insanity2Info.background = 'background2'
            } else if (insanity2Info.levelIndex === 18) {
                insanity2Info.background = 'background3'
            }
            this.add.image(0, 0, insanity2Info.background).setOrigin(0, 0)

            //Sets up the player
            //this.player = this.physics.add.sprite(playerX, playerY, insanity2Info.playerSkin) // sets this.player equal to the sprite
            this.player = this.physics.add.sprite(100, 100, 'playerSkin1')
            this.player.setCollideWorldBounds(true)
            this.player.setDepth(1)
            
            //sets up the input
            this.cursors = this.input.keyboard.createCursorKeys()

            //Sets up the groups of items
            this.walls = this.physics.add.staticGroup()
            this.coins = this.physics.add.staticGroup()
            this.waterCoins = this.physics.add.staticGroup()
            this.deathBlocks = this.physics.add.staticGroup()
            this.speedLeftBlocks = this.physics.add.staticGroup()
            this.speedRightBlocks = this.physics.add.staticGroup()
            this.jumpBlocks = this.physics.add.staticGroup()
            this.waterBlocks = this.physics.add.staticGroup()
            this.topWaterBlocks = this.physics.add.staticGroup()
            this.onSwitches = this.physics.add.staticGroup()
            this.offSwitches = this.physics.add.staticGroup()
            this.doors = this.physics.add.staticGroup()
            this.emptyDoors = this.physics.add.staticGroup()
            this.pushables = this.physics.add.group()
    
            //Sets up physics
            this.physics.add.collider(this.player, this.jumpBlocks, this.jump, null, this)
            this.physics.add.collider(this.player, this.speedLeftBlocks, this.speedLeft, null, this)
            this.physics.add.collider(this.player, this.speedRightBlocks, this.speedRight, null, this)
            this.physics.add.collider(this.player, this.walls, this.stopV, null, this)
            this.physics.add.collider(this.player, this.doors, this.stopV, null, this)
            this.physics.add.collider(this.walls, this.pushables, this.stopPushV, null, this)
            this.physics.add.collider(this.deathBlocks, this.pushables, this.stopPushV, null, this)
            this.physics.add.collider(this.jumpBlocks, this.pushables, this.stopPushV, null, this)
            this.physics.add.collider(this.speedLeftBlocks, this.pushables, this.pushLeft, null, this)
            this.physics.add.collider(this.speedRightBlocks, this.pushables, this.pushRight, null, this)
            this.physics.add.collider(this.pushables, this.pushables)
            this.physics.add.collider(this.player, this.pushables, this.push, null, this)
            this.physics.add.overlap(this.player, this.coins, this.takeCoin, null, this)
            this.physics.add.overlap(this.player, this.waterCoins, this.takeWaterCoin, null, this)
            this.physics.add.overlap(this.player, this.deathBlocks, this.restart, null, this)
            this.physics.add.overlap(this.player, this.waterBlocks, this.swim, null, this)
            this.physics.add.overlap(this.player, this.onSwitches, this.switchOff, null, this)
            this.physics.add.overlap(this.player, this.offSwitches, this.switchOn, null, this)

            //High scores
            if (insanity2Info.levelIndex === 44) {
                insanity2Info.user = prompt('You Win! Enter your initials to be put on the high score leader board!')
                saveHighScore(insanity2Info.user, insanity2Info.deaths)
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
            //load()
            if (insanity2Info.deaths < deathCount) {
                insanity2Info.deaths = deathCount
                save()
                alert('NO CHEATING')
                location.reload()
            }
            if (insanity2Info.levelIndex !== levelCount) {
                insanity2Info.levelIndex = levelCount
                save()
                alert('NO CHEATING')
                location.reload() 
            }
            ran = true
        },
        extend:{ //Extra functions to run
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

                        else if (levels[insanity2Info.levelIndex][i][j] == 'O') {
                            let coin = this.add.sprite(30+16*j, 30+16*i, 'waterCoin')
                            coin.play('waterCoinSpin')
                            this.waterCoins.add(coin)
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

                        else if (levels[insanity2Info.levelIndex][i][j] == 'w') {
                            let water = this.add.sprite(30+16*j, 30+16*i, 'water')
                            this.waterBlocks.add(water)
                            water.immovable = true; 
                        }                        

                        else if (levels[insanity2Info.levelIndex][i][j] == 't') {
                            let water = this.add.sprite(30+16*j, 30+16*i, 'waterTop')
                            this.topWaterBlocks.add(water)
                            water.play('waves')
                            water.immovable = true; 
                        }
                        
                        else if (levels[insanity2Info.levelIndex][i][j] == 's') {
                            let switchBlock = this.add.sprite(30+16*j, 30+16*i, 'switchUp')
                            this.onSwitches.add(switchBlock)
                        } 

                        else if (levels[insanity2Info.levelIndex][i][j] == 'S') {
                            let switchBlock = this.add.sprite(30+16*j, 30+16*i, 'switchDown')
                            this.offSwitches.add(switchBlock)
                        } 

                        else if (levels[insanity2Info.levelIndex][i][j] == 'd') {
                            let door = this.add.sprite(30+16*j, 30+16*i, 'switchDoor')
                            this.doors.add(door)
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'D') {
                            let door = this.add.sprite(30+16*j, 30+16*i, 'emptyDoor')
                            this.emptyDoors.add(door)
                        } 

                        else if (levels[insanity2Info.levelIndex][i][j] == 'p') {
                            let block = this.add.sprite(30+16*j, 30+16*i, 'pushBlock')
                            this.pushables.add(block)
                            block.body.bounce.y = 0.5
                        }  

                    }
                }
            },
            stopV() {
                upV = -160
                leftV = -160
                rightV = 160
                this.physics.config.gravity.y = 300
                if (this.player.body.touching.down) {
                    switched = true
                }
            },
            takeCoin(player, coin) {
                upV = 0
                coin.anims.isPlaying = false
                coin.destroy()
                if (ran) {
                    //this.sound.play('collect')
                    score += 1
                    ran = false
                }
            },
            takeWaterCoin(player, coin) {
                let water = this.add.sprite(coin.x, coin.y, 'water')
                this.waterBlocks.add(water)
                water.immovable = true
                coin.anims.isPlaying = false
                coin.destroy()
                if (ran) {
                    //this.sound.play('collect')
                    score += 1
                    ran = false
                }
            },
            restart(player, deathBlock) {
                this.coins.getChildren().map(child => {this.coins.killAndHide(child)})
                leftV = -160
                rightV = 160
                player.x = 100
                player.y = 100
                score = 0
                deathCount = insanity2Info.deaths
                if (ran) {
                    //this.sound.play('die')
                    ran = false
                    if (insanity2Info.deaths >= 9999999) {
                        insanity2Info.deaths = 9999999
                    } else {
                        insanity2Info.deaths += 1
                    }
                }
                for (let i = 0; i < levels[insanity2Info.levelIndex].length; i++) {
                    for (let j = 0; j < levels[insanity2Info.levelIndex][i].length; j++) {
                        if (levels[insanity2Info.levelIndex][i][j] == 'o') {
                            let coin = this.add.sprite(30+16*j, 30+16*i, 'coin');
                            coin.play('coinSpin')
                            this.coins.add(coin);
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'O') {
                            let coin = this.add.sprite(30+16*j, 30+16*i, 'waterCoin')
                            coin.play('waterCoinSpin')
                            this.waterCoins.add(coin)
                        }
                    }
                }

                //Resets switches, doors, and push-blocks
                let length1 = this.emptyDoors.children.entries.length
                for (let i = 0; i < length1; i++) {
                    this.emptyDoors.killAndHide(this.emptyDoors.children.entries[0])
                    this.emptyDoors.children.entries[0].destroy()
                }
                let length2 = this.doors.children.entries.length
                for (let i = 0; i < length2; i++) {
                    this.doors.killAndHide(this.doors.children.entries[0])
                    this.doors.children.entries[0].destroy()
                }
                let length3 = this.onSwitches.children.entries.length
                for (let i = 0; i < length3; i++) {
                    this.onSwitches.killAndHide(this.onSwitches.children.entries[0])
                    this.onSwitches.children.entries[0].destroy()
                }
                let length4 = this.offSwitches.children.entries.length
                for (let i = 0; i < length4; i++) {
                    this.offSwitches.killAndHide(this.onSwitches.children.entries[0])
                    this.offSwitches.children.entries[0].destroy() 
                }
                let length5 = this.pushables.children.entries.length
                for (let i = 0; i < length5; i++) {
                    this.pushables.killAndHide(this.pushables.children.entries[0])
                    this.pushables.children.entries[0].destroy()
                }
                for (let i = 0; i < levels[insanity2Info.levelIndex].length; i++) {
                    for (let j = 0; j < levels[insanity2Info.levelIndex][i].length; j++) {
                        if (levels[insanity2Info.levelIndex][i][j] == 's') {
                            let switchBlock = this.add.sprite(30+16*j, 30+16*i, 'switchUp')
                            this.onSwitches.add(switchBlock)
                        } 

                        else if (levels[insanity2Info.levelIndex][i][j] == 'S') {
                            let switchBlock = this.add.sprite(30+16*j, 30+16*i, 'switchDown')
                            this.offSwitches.add(switchBlock)
                        } 

                        else if (levels[insanity2Info.levelIndex][i][j] == 'd') {
                            let door = this.add.sprite(30+16*j, 30+16*i, 'switchDoor')
                            this.doors.add(door)
                        }

                        else if (levels[insanity2Info.levelIndex][i][j] == 'D') {
                            let door = this.add.sprite(30+16*j, 30+16*i, 'emptyDoor')
                            this.emptyDoors.add(door)
                        } 

                        else if (levels[insanity2Info.levelIndex][i][j] == 'p') {
                            let block = this.add.sprite(30+16*j, 30+16*i, 'pushBlock')
                            this.pushables.add(block)
                        }  
                    }
                }

                deathCounter.setText(`Deaths: ${insanity2Info.deaths}`)
                save()
            },
            speedRight() {
                upV = -160
                leftV = -160
                if (this.player.body.touching.down) {
                    this.player.x += .5
                }
                if (this.cursors.left.isDown) {
                    leftV = -160
                } else if (this.cursors.right.isDown) {
                    rightV = 220
                }
            },
            speedLeft() {
                upV = -160
                rightV = 160
                if (this.player.body.touching.down) {
                    this.player.x -= .5
                }
                if (this.cursors.right.isDown) {
                    rightV = 160
                } else if (this.cursors.left.isDown) {
                    leftV = -220
                } 
            },
            jump(player, block) {
                rightV = 160
                leftV = -160
                if (this.cursors.up.isDown) {
                    block.play('jumpUp')
                    setTimeout(() => {block.isPlaying = false}, 500)
                    upV = -220
                } else {
                    block.play('jumpUp')
                    setTimeout(() => {block.isPlaying = false}, 500)
                    this.player.setVelocityY(-120)
                }
            },
            swim() {
                leftV = -100
                rightV = 100
                if (this.cursors.down.isDown) {
                    this.player.setVelocityY(100)
                    return
                }
                if (!this.cursors.up.isDown) {
                    this.player.setVelocityY(40)
                } else {
                    this.player.setVelocityY(-80)
                }
            },
            switchOff(player, switchBlock) {
                upV = 100
                if (switched) {
                    //switches appearance of switch
                    switchBlock.destroy()
                    let item = this.add.sprite(switchBlock.x, switchBlock.y, 'switchDown')
                    this.offSwitches.add(item)
                    switched = false

                    //changed status of doors
                    let length = this.doors.children.entries.length
                    for (let i = 0; i < length; i++) {
                        this.doors.killAndHide(this.doors.children.entries[0])
                        let item = this.add.sprite(this.doors.children.entries[0].x, this.doors.children.entries[0].y, 'emptyDoor')
                        this.emptyDoors.add(item)
                        this.doors.children.entries[0].destroy()
                    }

                }
 
            },
            switchOn(player, switchBlock) {
                upV = 100
                if (switched) {
                    //switches appearance of switch
                    switchBlock.destroy()
                    let item = this.add.sprite(switchBlock.x, switchBlock.y, 'switchUp')
                    this.onSwitches.add(item)
                    switched = false

                    //changed status of doors
                    let length = this.emptyDoors.children.entries.length
                    for (let i = 0; i < length; i++) {
                        this.emptyDoors.killAndHide(this.emptyDoors.children.entries[0])
                        let item = this.add.sprite(this.emptyDoors.children.entries[0].x, this.emptyDoors.children.entries[0].y, 'switchDoor')
                        this.doors.add(item)
                        this.emptyDoors.children.entries[0].destroy()
                    }
                    
                }
            },
            push(item, pushBlock) {
                if (pushBlock.body.touching.left || pushBlock.body.touching.right) {
                    pushBlock.body.velocity.x = this.player.body.velocity.x
                }
            }, 
            stopPushV(wall, pushBlock) {
                pushBlock.body.velocity.x = 0
            },
            pushLeft(speedBlock, pushBlock) {
                pushBlock.x -= .5
                this.stopPushV(null, pushBlock)
            },
            pushRight(speedBlock, pushBlock) {
                pushBlock.x += .5
                this.stopPushV(null, pushBlock)
            }
        }
    }
}

//Run the game
let game = new Phaser.Game(gameObject)
