const progressBar = document.getElementById('progress');
let width = 0;
let score = 0;
const scrbrd = document.getElementById("score");
let intervalId;

// Başlatma fonksiyonu
function startGame() {
    document.getElementById("myPopup").style.display = "none";
    generateNumber();
    intervalId = setInterval(move, 50);
}

// Bitirme fonksiyonu
function endGame() {
    clearInterval(intervalId);
    width = 0;
    score = 0;
    scrbrd.innerText = score;
    generateNumber();
}

// Durdurma fonksiyonu
function pauseGame() {
    clearInterval(intervalId);
}

function move() {
    if (width >= 100) {
        width = 0;
        score = 0;
        scrbrd.innerText = 0;
        generateNumber();
    } else {
        width++;
        progressBar.style.width = width + '%';
    }
}

function checkNumber(number) {
    const numberToCheck = number.toString();
    const displayValue = document.getElementById("number-display").innerText;
    if (displayValue.includes(numberToCheck)) {
        showPopup(numberToCheck + " rakamı sayını içinde var. Puan'ın:" + score, 5000)
        width = 0;
        score = score - 1;
        scrbrd.innerText = score;
    } else {
        score++;
        scrbrd.innerText = score;
        width = 0;
        generateNumber();
    }
}

function generateNumber() {
    let number = "";
    for (let i = 0; i < 9; i++) {
        const digit = Math.floor(Math.random() * 9) + 1;
        number += digit;
    }
    document.getElementById("number-display").innerText = number;
}

// Popup gösterme fonksiyonu
function showPopup(text, duration) {
  const popup = document.getElementById("myPopup");
  const popupContent = document.querySelector(".popup-content");
  popupContent.innerHTML = "<p>" + text + "</p>";
  popup.style.display = "block";
  
  if (duration) {
      setTimeout(function() {
          document.getElementById("myPopup").style.display = "none";
      }, duration);
  }
}