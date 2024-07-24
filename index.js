// constants & variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 10, y: 17 }];
let food = { x: 6, y: 7 };

//functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function startGame() {
    document.querySelector('.container').classList.remove('blur');
    document.getElementById('startButton').style.display = 'none';
    musicSound.muted = false;
    musicSound.play();
    main(0); // Start the game
}
debugger
function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 20 || snake[0].x <= 0 || snake[0].y >= 20 || snake[0].y <= 0) {
        return true;
    }

    return false;

}

function gameEngine() {
    // Define the minimum and maximum coordinates for generating the food
    const a = 2;
    const b = 16;

    // increasing speed of the snake to increase difficulty
    if (score % 5 === 0 && score >= 5 && score <= 400) {
        speed += 1; // Increase the speed by 1
        console.log(speed)
        score += 1;
    }


    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        document.querySelector('.container').classList.add('blur');
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        document.getElementById('startButton').style.display = 'block'; // Display start button
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 10, y: 17 }];
        musicSound.play();
        score = 0;
        speed = 10;
        scoreBox.innerHTML = "Score: " + score;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        // Regenerate the food if it's in the snake's body
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        while (snakeArr.some(e => e.x === food.x && e.y === food.y)) {
            food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    // display the snake array and food
    // display the snake
    playzone.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        playzone.appendChild(snakeElement);
    });
    // Generate and display the food
    let foodElement = document.querySelector('.food');
    if (!foodElement) {
        foodElement = document.createElement('div');
        playzone.appendChild(foodElement);
    }
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
}

//main logic
musicSound.muted = true;
musicSound.play();
document.getElementById('startButton').addEventListener('click', startGame);

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 } // start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});