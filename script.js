const progressBar = document.getElementById('progress');
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");
let width = 0;
let numberLenght = 9;
let score = 0;
let intervalId;


// Başlatma fonksiyonu
function startGame(level) {
    scrbrd.innerText = score;
    if (level == 0) {
        numberLenght = 7;
        levelBox.innerText = "kolay";
        document.getElementById("myPopup").style.display = "none";
        generateNumber(numberLenght);
        intervalId = setInterval(move, 50);
    } else if (level == 1) {
        numberLenght = 8;
        levelBox.innerText = "orta";
        document.getElementById("myPopup").style.display = "none";
        generateNumber(numberLenght);
        intervalId = setInterval(move, 35);
    } else if (level == 2) {
        numberLenght = 9;
        levelBox.innerText = "zor";
        document.getElementById("myPopup").style.display = "none";
        generateNumber(numberLenght);
        intervalId = setInterval(move, 20);
    }
}

// Bitirme fonksiyonu
function endGame(numberToCheck) {
    clearInterval(intervalId);
    document.getElementById("text").innerHTML =  numberToCheck + " Sayısı zaten vardı. PUAN'IN: " + score;
    document.getElementById("myPopup").style.display = "block";
    width = 0;
    score = 0;
    scrbrd.innerText = score;
    generateNumber(numberLenght);
    
}

// Durdurma fonksiyonu
function pauseGame() {
    clearInterval(intervalId);
}

function move() {
    if (width >= 100) {
        width = 0;
        score += -1;
        scrbrd.innerText = score;
        generateNumber(numberLenght);
    } else {
        width++;
        progressBar.style.width = width + '%';
    }
}

function checkNumber(number) {
    const numberToCheck = number.toString();
    const displayValue = document.getElementById("number-display").innerText;
    if (displayValue.includes(numberToCheck)) {
        endGame(numberToCheck)
    } else {
        score++;
        scrbrd.innerText = score;
        width = 0;
        generateNumber(numberLenght);
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