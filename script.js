const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");

let width = 0;
let numberLength = 9;
let score = 0;
let intervalId;
let shuffleNumpad = false;

let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;


function updateStatistics() {
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('currentScore').textContent = score;
}


function startGame() {
    let baseInterval = 25;
    let difficultyScores = 0;

    shuffleNumpad = document.getElementById("shuffleNumpad").checked;
    if (shuffleNumpad) {
        shuffleNumpadKeys();
        difficultyScores += 6;
    }

    if (document.getElementById("reduceTime10").checked) {
        baseInterval -= 10;
        difficultyScores += 3;
    }
    if (document.getElementById("reduceTime15").checked) {
        baseInterval -= 15;
        difficultyScores += 5;
    }

    const difficultyNames = ["Kolay", "Orta", "Zor"];
    let levelName = difficultyScores < 4 ? 0 : difficultyScores >= 8 ? 2 : 1;
    levelBox.innerText = difficultyNames[levelName];

    document.getElementById("myPopup").style.display = "none";
    scrbrd.innerText = `Puan: 0`;

    generateNumber(numberLength);
    intervalId = setInterval(moveProgressBar, baseInterval);
}


function inputDisabled(nbr) {
    const elementId = nbr == 10 ? "reduceTime15" : "reduceTime10";
    const element = document.getElementById(elementId);
    element.disabled = !element.disabled;
}


function endGame() {
    clearInterval(intervalId);
    document.getElementById("myPopup").style.display = "block";
    gamesPlayed++;
    if (score > highScore) {
        highScore = score;
    }
    localStorage.setItem('gamesPlayed', gamesPlayed);
    localStorage.setItem('highScore', highScore);
    updateStatistics();
    width = 0;
    score = 0;
    scrbrd.innerText = `Puan: ${score}`;
}


function pauseGame() {
    clearInterval(intervalId);
}


function moveProgressBar() {
    if (width >= 100) {
        width = 0;
        score--;
        scrbrd.innerText = `Puan: ${score}`;
        generateNumber(numberLength);
        updateScoreDisplay("red");
        if (shuffleNumpad) {
            shuffleNumpadKeys();
        }
    } else {
        width++;
        progressBar.style.width = width + "%";
    }
}


function checkNumber(number) {
    const numberToCheck = number.toString();
    const displayValue = document.getElementById("number-display").innerText;
    if (!displayValue.includes(numberToCheck)) {
        score++;
        scrbrd.innerText = `Puan: ${score}`;
        width = 0;
        generateNumber(numberLength);
        updateScoreDisplay("green");
        if (shuffleNumpad) {
            shuffleNumpadKeys();
        }
    } else {
        endGame();
    }
}


function generateNumber(length) {
    let number = "";
    for (let i = 0; i < length; i++) {
        const digit = Math.floor(Math.random() * 9) + 1;
        number += digit;
    }
    document.getElementById("number-display").innerText = number;
}


function shuffleNumpadKeys() {
    const numpadButtons = Array.from(document.getElementsByClassName("number-button"));
    const shuffledNumbers = numpadButtons.map(button => button.innerText).sort(() => Math.random() - 0.5);

    numpadButtons.forEach((button, index) => {
        button.innerText = shuffledNumbers[index];
    });
}


function updateScoreDisplay(color) {
    const scoreElement = document.getElementById(`${color}-increase`);
    scoreElement.style.opacity = "1";
    scoreElement.style.transform = "translateY(0)";
    setTimeout(() => {
        scoreElement.style.opacity = "0";
        scoreElement.style.transform = "translateY(-40px)";
    }, 1000);
}

document.addEventListener('DOMContentLoaded', updateStatistics);