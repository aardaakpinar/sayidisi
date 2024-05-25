const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");
let width = 0;
let numberLength = 9;
let score = 0;
let intervalId;
let shuffleNumpad = false;

// Başlatma fonksiyonu
function startGame() {
    let baseInterval = 25;
    let difficultyScores = 0;
    let levelName = 0;
    const reduceTime5 = document.getElementById("reduceTime5").checked;
    const reduceTime10 = document.getElementById("reduceTime10").checked;
    const reduceTime15 = document.getElementById("reduceTime15").checked;
    const shuffleNbrpad = document.getElementById("shuffleNumpad").checked;
    if (shuffleNbrpad == true) {shuffleNumpad = true} else {shuffleNumpad = false}
    
    if (shuffleNumpad) {
        shuffleNumpadKeys();
        difficultyScores += 5;
    }
    if (reduceTime5) {
        baseInterval -= 5;
        difficultyScores += 1;
    }
    if (reduceTime10) {
        baseInterval -= 10;
        difficultyScores += 3;
    }
    if (reduceTime15) {
        baseInterval -= 15;
        difficultyScores += 5;
    }

    const difficultyNames = ["Kolay", "Orta", "Zor"];
    if (difficultyScores < 4) {
        levelName = 0;
    } else if (difficultyScores > 8) {
        levelName = 2;
    } else {
        levelName = 1;
    }
    levelBox.innerText = difficultyNames[levelName];
    document.getElementById("myPopup").style.display = "none";
    scrbrd.innerText = `Puan: 0`;

    generateNumber(numberLength);
    intervalId = setInterval(move, baseInterval);
}

function endGame(numberToCheck) {
    clearInterval(intervalId);
    document.getElementById("myPopup").style.display = "block";
    width = 0;
    score = 0;
    scrbrd.innerText = `Puan: ${score}`;
}

function pauseGame() {
    clearInterval(intervalId);
}

function move() {
    if (width >= 100) {
        width = 0;
        score -= 1;
        scrbrd.innerText = `Puan: ${score}`;
        generateNumber(numberLength);
        increaseScore("red");
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
        increaseScore("green");
        if (shuffleNumpad) {
            shuffleNumpadKeys();
        }
    } else {
        endGame(numberToCheck);
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
    const numbers = numpadButtons.map((button) => button.innerText);
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);

    numpadButtons.forEach((button, index) => {
        button.innerText = shuffledNumbers[index];
    });
}

function increaseScore(color) {
  const scoreIncreaseElement = document.getElementById(color + "-increase");
  scoreIncreaseElement.style.opacity = "1";
  scoreIncreaseElement.style.transform = "translateY(0)";
  setTimeout(() => {
      scoreIncreaseElement.style.opacity = "0";
      scoreIncreaseElement.style.transform = "translateY(-40px)";
  }, 1000);
}

// yakında
function showStats() {
}
