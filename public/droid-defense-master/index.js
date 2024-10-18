let gameManager = {}

let player = null
let homeBase = null
let playerRadius = 90
let guideLine = null

let leaderBoard = []
let leaderCounter = 0
let maxLeaderBoard = 5

let bullets = []
let bulletsDirection = null
let homeBaseBullets = []
let homeBaseBulletsMax = 10
let homeBaseBulletsCounter = 0
let homeBaseShot = []

let bulletCounter = 0
let bulletsMax = 30

let scale = 4

let mouseX = 0
let mouseY = 1


let x0 = -1
let y0 = -1
let x00 = -1
let y00 = -1

let aliens = []

let paused = false
let moved = false
let lost = false

let displacement = [0, 0]

let score = 0
let Health = 100

let waveNumber = 1
let message = ""
let powerUpPaused = false
let poweupsAssets = ["heart.png", "qmark.png"]
let poweupsMethods = [() => {
    player.playerHealth = (player.playerHealth > 50) ? 100 : (player.playerHealth + 50) % 100
}, () => {

    for (let i = 0; i < aliens.length * Math.random(); i++) {
        aliens.pop()
    }
}]
const delay = ms => new Promise(res => setTimeout(res, ms));


class GameObject {
    constructor(x, y, width, height, color, svg = "") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.svg = svg
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    move(dx, dy, ctx) {
        ctx.fillStyle = gameManager.bg
        ctx.fillRect(this.x, this.y, this.width, this.height)
        this.x += dx
        this.y += dy
        this.draw(ctx)
    }

    collides(obj) {
        return (this.x < obj.x + obj.width
            && this.x + this.width > obj.x
            && this.y < obj.y + obj.height
            && this.y + this.height > obj.y);
    }
}

class Bullet extends GameObject {
    constructor(x, y, width, height, color, svg = "", direction = [0, -20]) {
        super(x, y, width, height, color, svg)
        this.direction = direction
    }
    draw(ctx) {
        ctx.fillStyle = "#90f542"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    move(ctx, scalar = 20, direction = this.direction) {
        super.move(scalar * direction[0], scalar * direction[1], ctx)
    }
}

class Alien extends GameObject {
    constructor(x, y, width, height, color, svg = "", direction = [0, 1]) {
        super(x, y, width, height, color, svg)
        this.direction = direction
        this.name = "alien-img"
    }

    draw(ctx) {
        let img = document.getElementById(this.name)
        // ctx.strokeRect(this.x + this.width / 2, this.y + 1.5 * this.height, 2 * this.width, 2 * this.height) // show hitboxes
        ctx.drawImage(img, this.x - this.width, this.y - this.height / 2, 5 * this.width, 5.8 * this.height)
    }
    move(playerDir, ctx) {
        let mod = Math.sqrt(((this.x - playerDir[0]) * (this.x - playerDir[0])) + ((this.y - playerDir[1]) * (this.y - playerDir[1])))
        let normalisedCoords = [-(this.x - playerDir[0]) / mod, -(this.y - playerDir[1]) / mod]
        this.x += normalisedCoords[0]
        this.y += normalisedCoords[1]
        this.draw(ctx)
    }
    collides(obj) {
        return ((this.x + this.width / 2) < obj.x + obj.width
            && (this.x + this.width / 2) + 2 * this.width > obj.x
            && (this.y + 1.5 * this.height) < obj.y + obj.height
            && (this.y + 1.5 * this.height) + 2 * this.height > obj.y);
    }
}
class ShooterAlien extends Alien {
    constructor(x, y, width, height, color, svg) {
        super(x, y, width, height, color, svg)
        this.color = "#dd0000"

        this.bullet = ""

        this.name = "shooter-img"
    }

    shoot(ctx) {
        let mod = Math.sqrt(((player.x - this.x) * (player.x - this.x)) + ((player.y - this.y) * (player.y - this.y)))
        if (this.bullet == "") {
            this.bullet = new Bullet(this.x + 5 * this.width / 2, this.y + 5.8 * this.height / 2, 10, 20, "#efefef", "", [(player.x - this.x) / mod, (player.y - this.y) / mod])
        }
    }
    move(playerDir, ctx) {
        super.move(playerDir, ctx)
        if (this.bullet != "" && this.bullet != " ") {
            this.bullet.move(ctx, 2.5)
            if (this.bullet.collides(player)) {
                player.damage()
                this.bullet = " "
            }
        }
    }
}

class CryingAlien extends Alien {
    constructor(x, y, width, height, color, svg) {
        super(x, y, width, height, color, svg)
        this.color = "#dd0000"
        this.bullet = ""
        this.name = "crying-img"
    }

    shoot(ctx) {

    }
    draw(ctx) {
        let img = document.getElementById(this.name)

        ctx.drawImage(img, this.x - this.width, this.y - this.height / 2, 1.5 * this.width, 1.8 * this.height)
    }


    move(playerDir, ctx) {
        super.move(playerDir, ctx)
    }
}

class ShootingHomingAlien extends ShooterAlien {
    constructor(x, y, width, height, color, svg) {
        super(x, y, width, height, color, svg)
        this.color = "#660000"
        this.name = "homing-img"
    }

    shoot(ctx) {
        let mod = Math.sqrt(((player.x - this.x) * (player.x - this.x)) + ((player.y - this.y) * (player.y - this.y)))
        if (this.bullet == "") {
            this.bullet = new Bullet(this.x + 5 * this.width / 2, this.y + 5.8 * this.height / 2, 10, 20, "#efefef", "", [(player.x - this.x) / mod, (player.y - this.y) / mod])
        }
    }

    move(playerDir, ctx) {
        super.move(playerDir, ctx)
        let mod = Math.sqrt(((player.x - this.bullet.x) * (player.x - this.bullet.x)) + ((player.y - this.bullet.y) * (player.y - this.bullet.y)))
        if (this.bullet != "" && this.bullet != " ") {
            this.bullet.direction = [(player.x - this.bullet.x) / mod, (player.y - this.bullet.y) / mod]
            this.bullet.move(ctx, 2.5)
            if (this.bullet.collides(player)) {
                this.bullet = " "
                player.damage()
            }
        }
    }
}

class Player extends GameObject {
    constructor(x, y, width, height, color, svg = "", guideLine) {
        super(x, y, width, height, color, svg)
        this.color = "#f54242"
        this.guideLine = guideLine

        this.rectW = 25
        this.rectH = 50
        this.rectCordX = this.x - Math.floor(this.rectW / 2)
        this.rectCordY = this.y - this.width / 2 - (this.rectH - 2)
        this.rot = 0
        this.shoot = [this.x + this.width / 2, this.y - 10]
        this.r = Math.sqrt((this.rectCordX - this.x) * (this.rectCordX - this.x) + (this.rectCordY - this.y) * (this.rectCordY - this.y))

        this.playerHealth = 100
    }

    shoot() {
        console.log("shoot!")
    }

    damage() {
        this.playerHealth -= 10
    }

    draw(ctx) {
        let img = document.getElementById("spaceship")
        ctx.drawImage(img, this.x - this.width / 2, this.y, 2 * this.width, 2 * this.height)

        ctx.fillStyle = "red"
        ctx.strokeStyle = "red"
        ctx.fillRect(this.x - this.width, this.y + this.height + 20, this.playerHealth, 10)
        ctx.strokeRect(this.x - this.width, this.y + this.height + 20, 100, 10)
        homeBase.draw(ctx)
    }

    rotate(x = -1, y = -1, ctx) {
        // save
        ctx.save()
        ctx.translate(this.x, this.y + this.height / 2)

        if (x != -1) {
            let m = (y - player.y) / (x - player.x)
            if (m > 0)
                this.rot = (Math.atan(m)) - Math.PI / 2
            else
                this.rot = (Math.atan(m)) + Math.PI / 2
            // console.log(this.rot, x, y, m)
            if (y > this.y) {
                this.rot += Math.PI
            }
        }

        ctx.rotate(this.rot)
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height))
        let img = document.getElementById("spaceship")
        ctx.drawImage(img, this.x - this.width / 2, this.y, 2 * this.width, 2 * this.height)


        ctx.restore()
    }
    move(dx, dy, ctx) {
        ctx.fillStyle = "red"
        ctx.fillRect(this.x - this.width, this.y + this.height + 20, this.playerHealth, 10)
        ctx.strokeRect(this.x - this.width, this.y + this.height + 20, this.playerHealth, 10)
        let inBoundX = this.x + this.width / 2 + dx < board.width && this.x - this.width / 2 + dx > 0
        let inBoundY = this.y + this.height / 2 + dy < board.height && this.y - this.height / 2 + dy > board.height / 2
        this.x = (inBoundX) ? this.x + dx : this.x
        this.y = (inBoundY) ? this.y + dy : this.y
        this.rotate(-1, -1, ctx)

        if (this.playerHealth === 0) {
            loseGame(ctx)
            return
        }
    }
}
class PowerUp extends Alien {
    constructor(x, y, width, height, color, svg = "", guideLine) {
        super(x, y, width, height, color, svg)
        this.poweupNumber = Math.floor((poweupsMethods.length) * Math.random())
        this.imageElement = 1
    }

    apply() {
        poweupsMethods[this.poweupNumber]()
    }

    draw(ctx) {
        this.imageElement = document.getElementById(poweupsAssets[this.poweupNumber])
        this.imageElement.src = poweupsAssets[this.poweupNumber]
        this.imageElement.height = this.height
        this.width = this.imageElement.height
        ctx.drawImage(this.imageElement, this.x - this.width / 2, this.y, this.width, this.height)
    }

    move(playerDir, ctx) {
        this.height = 80

        this.y += playerDir[1]
        this.draw(ctx)
    }

    collides(obj) {
        return (this.x - this.width / 2 < obj.x + obj.width
            && this.x + this.width / 2 > obj.x
            && this.y < obj.y + obj.height
            && this.y + this.height > obj.y);
    }
}

class Boss extends ShooterAlien {
    constructor(x, y, width, height, color, svg) {
        super(x, y, width, height, color, svg)
        this.color = color
        this.BossHealth = 1000
        this.height = board.width / 8
        this.width = board.width / 8
    }
    move(a, ctx) {
        ctx.fillStyle = gameManager.bg
        ctx.beginPath()
        ctx.arc(this.x, this.y, board.width / 8, 0, 2 * Math.PI)
        ctx.fill()

        this.y += 0.2
        this.draw(ctx)
    }

    damage(ctx) {
        this.BossHealth -= 5
        if (this.BossHealth <= 0) {
            aliens = []
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, board.width / 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = "red"
        ctx.fillRect(this.x - board.width / 8, this.y - board.width / 8 - 25, this.BossHealth / 2, 10)
        ctx.strokeStyle = "red"
        ctx.strokeRect(this.x - board.width / 8, this.y - board.width / 8 - 25, this.BossHealth / 2, 10)
    }


    collides(obj) {
        return (this.x < obj.x + obj.width
            && this.x + this.width > obj.x
            && this.y < obj.y + obj.height
            && this.y + this.height > obj.y);
    }

}

let board = document.getElementById('board')
let ctx = board.getContext("2d")

const ratio = window.devicePixelRatio;

board.width = window.innerWidth * ratio;
board.height = window.innerHeight * ratio;
board.style.width = window.innerWidth + "px";
board.style.height = window.innerHeight + "px";

document.body.style.cursor = "none"
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    moved = true
})

function drawCrossHair(ctx) {
    requestAnimationFrame(gameLoop)
    let mouse = [mouseX - player.x, mouseY - player.y]
    let mouseMod = Math.sqrt(mouse[0] * mouse[0] + mouse[1] * mouse[1])
    mouse[0] /= mouseMod
    mouse[1] /= mouseMod

    bulletsDirection = mouse

    let imageElement = document.getElementById("crosshair.png")
    imageElement.height = 6
    let width = imageElement.width
    ctx.drawImage(imageElement, mouseX - width / 2, mouseY, width, 100 * imageElement.height / width)

    if (moved) {
        player.rotate(mouseX, mouseY, ctx)

        x0 = mouseX
        y0 = mouseY
        moved = false
    }
}

function gameSetup() {
    if (JSON.parse(sessionStorage.getItem('game')) != null) {
        leaderBoard = JSON.parse(sessionStorage.getItem('game')).leaderboard
    }

    let bg = document.getElementById("bg")
    bg.loop = true
    bg.play()

    // setup spaceship asset
    let assetPath = `Spaceships - ${Math.floor(234 * Math.random()) % 3 + 1}.png`
    let imageElement = document.createElement("img")
    imageElement.src = assetPath
    imageElement.id = "spaceship"
    document.body.appendChild(imageElement)

    gameManager.bg = "#101010"
    guideLine = new GameObject(90, board.height - playerRadius, board.width - 180, 3, "#303030")
    player = new Player(board.width / 2, board.height - playerRadius, 90, 90, guideLine)
    homeBase = new GameObject(board.width - 400, board.height - 250, 150, 150, "green", "")
    document.onclick = (e) => {
        if (!lost) {
            bulletCounter = (bulletCounter + 1) % bulletsMax
            let centerX = player.x
            let centerY = player.y + player.height / 2
            bullets[bulletCounter] = (new Bullet(centerX, centerY, 5, 10, "", "", bulletsDirection))
            let y = document.getElementById("shoot")
            y.play()
        } else {
            let eventX = e.clientX
            let eventY = e.clientY
            console.log(eventX, eventY, (board.width / 3.7 + 900 / 3.55 - 10))
            if (eventX > (board.width / 3.7 + 900 / 3.55 - 10) && (eventY > (board.height / 7 + 450) && eventY < (board.height / 7 + 480))) {
                console.log("refresh")
                document.location.reload()
            } else {
                console.log("closed")
                window.close()
            }
        }
    }
    document.addEventListener('keydown', async function (e) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "h") {
            if (!paused) { displacement = [-scale, 0] }
        }
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "j") {
            if (!paused) {
                displacement = [0, scale]
            }
        }
        if (e.key === "p") {
            paused = !paused
        }
        if (e.key === "q" && paused) {
            window.close()
        }
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "k") {
            if (!paused) {
                displacement = [0, -scale]
            }
        }
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "l") {
            if (!paused) { displacement = [scale, 0] }
        }
    })

    //chekcing
    bullets = Array(20).fill("")
    homeBaseBullets = Array(20).fill("")
    aliens = Array(20).fill("")
    for (let j = 1; j <= 2; j++) {
        for (let i = 0; i < 10; i++) {
            // powerup
            // shooter alien
            // shooter alien (homing)
            // alien
            let rand = Math.floor(10000 * Math.random())
            if (rand % 5 == 0)
                aliens[i + 10 * (j - 1)] = new PowerUp(((Math.floor(poweupsMethods.length * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
            else if (rand % 5 == 1)
                aliens[i + 10 * (j - 1)] = new ShooterAlien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
            else if (rand % 5 == 2)
                aliens[i + 10 * (j - 1)] = new Alien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
            else if (rand % 5 == 3)
                aliens[i + 10 * (j - 1)] = new ShootingHomingAlien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
            else if (rand % 5 == 4)
                aliens[i + 10 * (j - 1)] = new CryingAlien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")

        }
    }
    player.draw(ctx)

}
function drawNavBar(score, ctx) {


    ctx.font = "40px mcfont"
    ctx.fillStyle = "white"
    ctx.fillText("Health: ", 10, 40)

    ctx.fillStyle = "red"
    ctx.strokeStyle = "red"
    ctx.fillRect(190, 15, Health * 4, 25)
    ctx.strokeRect(190, 15, 400, 25)

    ctx.font = "40px mcfont"
    ctx.fillStyle = "white"
    ctx.fillText(`Score: ${score}`, board.width - 200, 40)

    // draw "HOME" text at home
    ctx.font = "40px mcfont"
    ctx.fillStyle = "white"
    ctx.fillText(`HOME`, homeBase.x + homeBase.width / 6, homeBase.y + homeBase.height / 2)

    ctx.font = "40px mcfont"
    ctx.fillStyle = "white"
    ctx.fillText(`Wave: ${waveNumber}`, board.width / 2, 40)
}


async function nextWave(ctx) {
    waveNumber++;

    if (waveNumber % 4 == 0) {
        aliens = []
        ctx.font = "90px mcfont"
        ctx.fillStyle = "white"
        ctx.fillText(`BOSS LEVEL`, board.width / 2 - 180, board.height / 2 + 45)

        aliens[0] = new Boss(700, 20, 2, 3, "#454334", "")

    } else {
        for (let j = 1; j <= waveNumber; j++) {
            for (let i = 0; i < 10; i++) {
                let rand = Math.floor(100000 * Math.random())
                if (rand % 5 == 0)
                    // powerup
                    aliens[i + 10 * (j - 1)] = new PowerUp(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
                else if (rand % 5 == 1)
                    // shooter alien
                    aliens[i + 10 * (j - 1)] = new ShooterAlien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
                else if (rand % 5 == 2)
                    // shooter alien (homing)
                    aliens[i + 10 * (j - 1)] = new Alien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
                else if (rand % 5 == 3)
                    // alien
                    aliens[i + 10 * (j - 1)] = new ShootingHomingAlien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
                else if (rand % 5 == 4)
                    // alien
                    aliens[i + 10 * (j - 1)] = new CryingAlien(((Math.floor(4 * Math.random())) % 2 == 0 ? 1 : -1) * board.width * Math.random(), -board.height * Math.random(), 30, 20, "#ffffff", "")
            }
        }
    }
}

async function gameLoop() {
    let imageElement = document.getElementById("bg-img")
    imageElement.height = board.height
    ctx.drawImage(imageElement, 0, 0, board.width, board.height)

    if (!paused && !powerUpPaused) {
        // draw home base
        homeBase.draw(ctx)

        if (Health == 0) {
            message = "You Ran Out of Health!"
            loseGame()
            return
        }
        let dirn = (powerUpPaused) ? [0, 0] : [player.x, player.y]
        //collision
        for (let i = 0; i < aliens.length; i++) {
            if (aliens[i] != "") {

                if (!powerUpPaused) {
                    if (aliens[i] instanceof PowerUp && !powerUpPaused) (aliens[i].y >= board.height) ? aliens.splice(i, 1) : aliens[i].move([0, 1], ctx)
                    else if (aliens[i] instanceof ShooterAlien) aliens[i].move([player.x, player.y], ctx)
                    else if (aliens[i] instanceof CryingAlien) aliens[i].move([player.x, player.y], ctx)
                    else if (aliens[i] instanceof Alien) aliens[i].move([homeBase.x, homeBase.y], ctx)
                    else if (aliens[i] instanceof ShootingHomingAlien) aliens[i].move([player.x, player.y], ctx)
                    else aliens[i].move(dirn, ctx)
                } else {
                    aliens[i].move([0.01, 0.01], ctx)
                }
                if (aliens[i] instanceof ShooterAlien || aliens[i] instanceof ShootingHomingAlien) {
                    if (((player.x - aliens[i].x) * (player.x - aliens[i].x) + (player.y - aliens[i].y) * (player.y - aliens[i].y)) <= 500 * 500) {
                        aliens[i].shoot(ctx)
                    }
                }
                if (aliens[i] != undefined && aliens[i].color != gameManager.bg) {
                    if (aliens[i].collides(player) && aliens[i] instanceof Alien && !(aliens[i] instanceof PowerUp)) {
                        message = "you collided with alien"
                        loseGame()
                        return
                    }
                    else if (aliens[i].collides(homeBase)) {
                        if (Health != 0) Health -= 2
                        else if (Health == 0) {
                            message = "You ran out of health!"
                            loseGame()

                        }
                        aliens.splice(i, 1)
                    }
                }
                if (aliens[i] != undefined) {
                    let dist = (homeBase.x - aliens[i].x) * (homeBase.x - aliens[i].x) + (homeBase.y - aliens[i].y) * (homeBase.y - aliens[i].y)
                    if (dist <= 200 * 200) {
                        if (!homeBaseShot.includes(i)) {
                            homeBaseBulletsCounter = (homeBaseBulletsCounter + 1) % homeBaseBulletsMax
                            homeBaseBullets[homeBaseBulletsCounter] = (new Bullet(homeBase.x, homeBase.y, 10, 20, "blue", "", [(aliens[i].x - homeBase.x) / dist, (aliens[i].y - homeBase.y) / dist]))
                            homeBaseShot.push(i)
                        }
                    }
                }
            }
        }
        //movement
        for (let i = 0; i < bullets.length; i++) {
            // move player bullets
            let bullet = bullets[i]
            if (bullet != "" && bullet != undefined) {
                bullet.move(ctx)
                if (bullet.y < 0) {
                    bullets[i] = ""
                    clear = true
                }
            }
            for (let j = 0; j < aliens.length; j++) {
                if (aliens[j] != "" && bullet != undefined && aliens[j].collides(bullet)) {
                    console.log(aliens[j])
                    if (aliens[j] instanceof Boss) {
                        bullets[i] = ""
                        aliens[j].damage()
                    } else {
                        if (aliens[j] instanceof PowerUp) {
                            (aliens[j].apply())
                        }
                        aliens.splice(j, 1)
                        bullets[i] = ""
                        score++
                        break
                    }
                }
            }
        }

        for (let i = 0; i < homeBaseBullets.length; i++) {
            if (homeBaseBullets[i] != "") {
                homeBaseBullets[i].move(ctx, 100)
                if (homeBaseBullets[i].x >= board.width || homeBaseBullets.x < 0 || homeBaseBullets.y >= board.height || homeBaseBullets[i].y < 0) {
                    homeBaseBullets[i] = ""
                } else {
                    for (let j = 0; j < aliens.length; j++) {
                        if (aliens[j].collides(homeBaseBullets[i]) && !(aliens[j] instanceof PowerUp)) {
                            aliens.splice(j, 1)
                        }
                    }
                }
            }
        }

        player.move(displacement[0], displacement[1], ctx)
        drawCrossHair(ctx)
        drawNavBar(score, ctx)
        if (aliens.toString() === '') nextWave(ctx)
    } else if (lost) {
        loseGame(message)
    } else if (paused) {
        // draw pause screen
        // ctx.fillStyle = "#3636360e"
        ctx.fillStyle = "#363636ae"
        ctx.fillRect(0, 0, board.width, board.height)

        ctx.font = "200px mcfont"
        ctx.fillStyle = "white"
        let cen = ctx.measureText("PAUSED").width
        ctx.fillText("PAUSED", (board.width - cen) / 2, (board.height) / 2)

        ctx.font = "50px mcfont"
        ctx.fillStyle = "white"
        ctx.fillText("Press 'P' to resume", (board.width - cen + ctx.measureText("Press 'p' to resume").width / 2) / 2, (board.height) / 2 + 100)

        ctx.font = "50px mcfont"
        ctx.fillStyle = "white"
        ctx.fillText("Press 'Q' to quit", (board.width - cen + ctx.measureText("Press 'Q' to resume quit").width / 2) / 2, (board.height) / 2 + 200)
        requestAnimationFrame(gameLoop)
    }
}


function gameInit() {
    gameSetup()
    requestAnimationFrame(gameLoop)
}

function createModal(ctx, color, width, height, text) {

    ctx.fillStyle = color
    ctx.strokeStyle = "black"
    ctx.lineWidth = 15
    ctx.fillRect((board.width - width) / 2, (board.height - width) / 2, width, height)
    ctx.strokeRect((board.width - width) / 2, (board.height - width) / 2, width, height)
}

function loseGame() {
    document.body.style.cursor = "default"
    let width = 750
    let height = 750

    createModal(ctx, "#550000", width, height)

    ctx.font = "160px mcfont"
    ctx.fillStyle = "#990000"
    ctx.fillText("You Lost!", (board.width - width) / 2 + ctx.measureText("You Lost!").width / 2 - 350, (board.height - height) / 2 + 150)

    ctx.font = "50px mcfont"
    ctx.fillStyle = "red"
    ctx.fillText(message, (board.width - width) / 2 + 95, (board.height - height) / 2 + 350)

    ctx.font = "50px mcfont"
    ctx.fillStyle = "red"
    ctx.fillText("Score: " + score, (board.width + width / 64) / 2 - 200, (board.height - height) / 2 + 450)

    // setting up behaviours for the buttons

    //Quit button
    ctx.font = "90px mcfont"
    ctx.fillStyle = "#8b0000"

    let quitButtonX0 = (board.width - width) / 2
    let quitButtonX1 = (board.width - width) / 2 + 2.8 * ctx.measureText("Quit").width
    let quitButtonY0 = (board.height - height) / 2 - 90
    let quitButtonY1 = (board.height - height) / 2 + 600

    let inBoundXQuit = (quitButtonX0 < mouseX && mouseX < (board.width - quitButtonX1))
    let inBoundYQuit = ((quitButtonY0) < mouseY && mouseY < (quitButtonY1))

    if (inBoundXQuit) {
        ctx.font = "90px mcfont"
        ctx.fillStyle = "blue"
        ctx.fillText("Quit", (board.width - width) / 2 + ctx.measureText("Quit").width / 2 - 40, (board.height - height) / 2 + 600)
    } else if (!inBoundXQuit || !inBoundYQuit) {
        ctx.font = "90px mcfont"
        ctx.fillStyle = "#8b0000"
        ctx.fillText("Quit", (board.width - width) / 2 + ctx.measureText("Quit").width / 2 - 40, (board.height - height) / 2 + 600)
    }


    //new game btn
    ctx.font = "90px mcfont"
    ctx.fillStyle = "#dc143c"

    let newGameButtonX0 = (board.width - width) / 2 + 80 + ctx.measureText("Quit").width + 30
    let newGameButtonX1 = newGameButtonX0 + (width - 320)
    let newGameButtonY0 = (board.height - height) / 2 + 600 - 60
    let newGameButtonY1 = (board.height - height) / 2 + 600

    let inBoundXNewGame = (newGameButtonX0 < mouseX && mouseX < (newGameButtonX1))


    if (inBoundXNewGame) {
        ctx.font = "90px mcfont"
        ctx.fillStyle = "green"
        ctx.fillText("New Game", (board.width - width) / 2 + ctx.measureText("New Game").width / 2 + 80, (board.height - height) / 2 + 600)
    } else if (!inBoundXNewGame || !inBoundYQuit) {
        ctx.font = "90px mcfont"
        ctx.fillStyle = "#dc143c"
        ctx.fillText("New Game", (board.width - width) / 2 + ctx.measureText("New Game").width / 2 + 80, (board.height - height) / 2 + 600)
    }


    // handling text "button" onclicks
    document.onclick = (e) => {


        // quit
        let inBoundXQuit = (quitButtonX0 < mouseX && mouseX < (board.width - quitButtonX1))
        let inBoundYQuit = ((quitButtonY0) - 800 < mouseY && mouseY < (quitButtonY1) + 800)

        // new game
        let inBoundXNewGameOnclick = (newGameButtonX0 < e.clientX && e.clientX < (newGameButtonX1))

        if (inBoundXQuit && inBoundYQuit) {

            localStorage.setItem("game", JSON.stringify({ "leaderboard": leaderBoard }))
            window.close()

        }
        else if (inBoundXNewGameOnclick && inBoundYQuit) {
            localStorage.setItem("game", JSON.stringify({ "leaderboard": leaderBoard }))
            window.location.reload()
        }
    }

    requestAnimationFrame(loseGame)
    if (!lost) {
        leaderCounter++
        leaderBoard[leaderCounter % maxLeaderBoard] = score
    }
    lost = true
}

gameInit()