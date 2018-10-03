//browser-sync start --server -f -w
// import anime from 'node_modules/animejs'

const grid = new Array(2)
const vacuum = {
    position: 0,
    prevPos: null,
    shaking: false,
    moving: null,
    move: function () {
        if (grid[this.position]) {
            this.shaking = true
            grid[this.position] = false
        } else if (this.position === 0 && this.prevPos != 1) {
            this.prevPos = this.position
            this.position = 1
            this.moving = 'Right'
        } else if (this.position === 1 && this.prevPos != 0) {
            this.prevPos = this.position
            this.position = 0
            this.moving = 'Left'
        }
    }
}
setup = () => {
    angleMode(DEGREES)
    size = Math.min(windowWidth, windowHeight) / 3
    time = 0
    createCanvas(windowWidth - 20, windowHeight - 20);
    grid[0] = true
    grid[1] = true
    nextButton = createButton('Next')
    nextButton.position(10, size + 20)
    nextButton.mouseClicked(() => {
        vacuum.move()
    })
    restartButton = createButton('Randomize')
    restartButton.position(10, size + 100)
    restartButton.mouseClicked(() => {
        vacuum.position = Math.floor(Math.random() * 2)
        vacuum.prevPos = null
        grid.forEach((box, boxIndex, boxList) => {
            boxList[boxIndex] = Math.random() >= 0.5
        });
    })
    randomizeButton = createButton('Restart')
    randomizeButton.position(10, size + 60)
    randomizeButton.mouseClicked(() => {
        vacuum.position = 0
        vacuum.prevPos = null
        grid.fill(true)
    })
    vacuumImg = loadImage('img/vacuum.png')
    dirtImg = loadImage('img/dirt.png')
}

draw = () => {
    background(255)
    grid.forEach((dirty, boxIndex) => {
        rect(10 + size * boxIndex, 10, size, size)
        if (dirty) {
            image(dirtImg, 10 + size * boxIndex, 10, size, size)
        }
    });
    if (vacuum.shaking && time + 2000 > millis()) {
        push()
        tint(255, 255 * ((time + 2000 - millis()) / 2000))
        image(dirtImg, 10 + size * vacuum.position, 10, size, size)
        pop()
        push()
        rectMode(CENTER);
        translate(10 + size * vacuum.position + size / 2, 10 + size / 2)
        rotate(random(-45, 45))
        ellipse(0, 0, 10)
        image(vacuumImg, -size / 2, -size / 2, size, size)
        pop()

    } else if ((vacuum.moving === 'Right' || vacuum.moving === 'Left') && time + 2000 > millis()) {
        push()
        let change = -size * ((millis() - time) / 2000)
        translate(10 + size * vacuum.prevPos + size / 2, 10 + size / 2)
        vacuum.moving === 'Right' ? scale(-1.0, 1.0) : scale(1)
        image(vacuumImg, -size / 2 + change, -size / 2, size, size)
        pop()
    } else {
        time = millis()
        vacuum.shaking = false
        vacuum.moving = null
        image(vacuumImg, 10 + size * vacuum.position, 10, size, size)
    }
}

mouseClicked = () => {
    let x = Math.ceil((mouseX - 10) / size) - 1
    let y = Math.ceil((mouseY - 10) / size)
    if ((x === 0 || x === 1) && y == 1) {
        vacuum.position = x
    }
}