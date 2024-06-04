const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");

let width = 0;
let numberLength = 9;
let RestrictedDigits;
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
        difficultyScores += 5;
    }
    if (document.getElementById("reduceTime10").checked) {
        baseInterval -= 10;
        difficultyScores += 1;
    }
    if (document.getElementById("reduceTime15").checked) {
        baseInterval -= 15;
        difficultyScores += 2;
    }
    if (document.getElementById("3Digits").checked) {
        RestrictedDigits = 3;
        difficultyScores += 2;
    }
    if (document.getElementById("2Digits").checked) {
        RestrictedDigits = 2;
        difficultyScores += 3;
    }
    if (document.getElementById("1Digits").checked) {
        RestrictedDigits = 1;
        difficultyScores += 4;
    }

    const difficultyNames = ["Kolay", "Orta", "Zor"];
    let levelName = difficultyScores < 4 ? 0 : difficultyScores >= 10 ? 2 : 1;
    levelBox.innerText = difficultyNames[levelName];

    document.getElementById("myPopup").style.display = "none";
    scrbrd.innerText = `Puan: 0`;

    generateNumber(numberLength, RestrictedDigits);
    intervalId = setInterval(moveProgressBar, baseInterval);
}


function inputDisabled(id, relatedIds = []) {
    const element = document.getElementById(id);

    relatedIds.forEach(relatedId => {
        const relatedElement = document.getElementById(relatedId);
        if (relatedElement) {
            relatedElement.disabled = element.checked;
        }
    });
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
        generateNumber(numberLength, RestrictedDigits);
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
        generateNumber(numberLength, RestrictedDigits);
        updateScoreDisplay("green");
        if (shuffleNumpad) {
            shuffleNumpadKeys();
        }
    } else {
        endGame();
    }
}


function generateNumber(length, excludedCount) {
    let result = '';

    let excludedDigits = new Set();
    while (excludedDigits.size < excludedCount) {
        const digit = Math.floor(Math.random() * 9) + 1;
        excludedDigits.add(digit);
    }

    console.log("Seçilen rakamlar:", Array.from(excludedDigits)); // Seçilen rakamları konsola yazdır

    for (let i = 1; i <= 9; i++) {
        if (!excludedDigits.has(i)) {
            result += i.toString();
        }
    }

    while (result.length < length) {
        const randomIndex = Math.floor(Math.random() * result.length);
        const randomDigit = Math.floor(Math.random() * 9) + 1;
        result = result.slice(0, randomIndex) + randomDigit.toString() + result.slice(randomIndex);
    }

    document.getElementById("number-display").innerText = result;
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