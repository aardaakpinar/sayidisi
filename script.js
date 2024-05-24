const progressBar = document.getElementById('progress');
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");
let width = 0;
let numberLength = 9;
let score = 0;
let intervalId;
let baseInterval = 50;
let shuffleNumpad = false;
let difficultyScores = 0;
  
// Başlatma fonksiyonu
function startGame() {
    const reduceTime5 = document.getElementById("reduceTime5").checked;
    const reduceTime15 = document.getElementById("reduceTime15").checked;
    const reduceTime25 = document.getElementById("reduceTime25").checked;
    let levelName = 0;
    shuffleNumpad = document.getElementById("shuffleNumpad").checked;
    
    if (shuffleNumpad) {shuffleNumpadKeys();difficultyScores += 5}
    if (reduceTime5) {baseInterval -= 5;difficultyScores += 1;}
    if (reduceTime15) {baseInterval -= 15;difficultyScores += 3;}
    if (reduceTime25) {baseInterval -= 25;difficultyScores += 5;}
  
    const difficultyNames = ["Kolay", "Orta", "Zor"];
    if (difficultyScores < 4) {
        levelName = 0;
    } else if (difficultyScores > 8) {
        levelName = 2;
    } else {levelName = 1;}
    levelBox.innerText = difficultyNames[levelName];
    document.getElementById("myPopup").style.display = "none";
    scrbrd.innerText = `Puan: 0`;
    
    generateNumber(numberLength);
    intervalId = setInterval(move, baseInterval);
  }

// Bitirme fonksiyonu
function endGame(numberToCheck) {
  clearInterval(intervalId);
  document.getElementById("myPopup").style.display = "block";
  width = 0;
  score = 0;
  scrbrd.innerText = `Puan: ${score}`;
}

// Durdurma fonksiyonu
function pauseGame() {
  clearInterval(intervalId);
}

// Zaman ilerleme fonksiyonu
function move() {
  if (width >= 100) {
    width = 0;
    score -= 1;
    scrbrd.innerText = `Puan: ${score}`;
    generateNumber(numberLength);
    if (shuffleNumpad) {
        shuffleNumpadKeys();
      }
  } else {
    width++;
    progressBar.style.width = width + '%';
  }
}

// Sayıyı kontrol etme fonksiyonu
function checkNumber(number) {
  const numberToCheck = number.toString();
  const displayValue = document.getElementById("number-display").innerText;
  if (!displayValue.includes(numberToCheck)) {
    score++;
    scrbrd.innerText = `Puan: ${score}`;
    width = 0;
    generateNumber(numberLength);
    if (shuffleNumpad) {
        shuffleNumpadKeys();
      }
  } else {
    endGame(numberToCheck);
  }
}

// Rastgele sayı oluşturma fonksiyonu
function generateNumber(length) {
  let number = "";
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 9);
    number += digit;
  }
  document.getElementById("number-display").innerText = number;
}

// Numpad tuşlarını karıştırma fonksiyonu
function shuffleNumpadKeys() {
  const numpadButtons = Array.from(document.getElementsByClassName("number-button"));
  const numbers = numpadButtons.map(button => button.innerText);
  const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);

  numpadButtons.forEach((button, index) => {
    button.innerText = shuffledNumbers[index];
  });
}

// İstatistikleri gösterme fonksiyonu
function showStats() {
  // İstatistik gösterme kodu buraya gelecek
}
