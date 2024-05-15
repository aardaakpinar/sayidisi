const progressBar = document.getElementById('progress');
  let width = 0;
  var score = 0;

  function move() {
    if (width >= 100) {
      width = 0;
      generateNumber()
    } else {
      width++;
      progressBar.style.width = width + '%';
    }
  }

  setInterval(move, 50);

  function checkNumber(number) {
    var numberToCheck = number.toString();
    var displayValue = document.getElementById("number-display").innerText;
    if (displayValue.includes(numberToCheck)) {
        alert(numberToCheck + " zaten mevcut! Puan'ın:" + score);
        width = 0;
        generateNumber()
        score = 0;
    } else {
        score = score + 1;
        width = 0;
        generateNumber();
    }
  }

  function generateNumber() {
  var number = "";
  for (var i = 0; i < 9; i++) {
    var digit = Math.floor(Math.random() * 9) + 1;
    number += digit;
  }
  document.getElementById("number-display").innerText = number;
}