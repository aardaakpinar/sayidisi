const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let score = 0;
let width = 20; // maksimum bar uzunluğu
let currentBar = width;
let intervalId;
let timerSpeed = 400; // ms per tick
let currentNumbers = [];
let currentDifficulty = 2;

function clearLine() {
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
}

function drawTimerBar() {
    const full = "#".repeat(currentBar);
    const empty = " ".repeat(width - currentBar);
    clearLine();
    process.stdout.write(`[${full}${empty}]  Skor: ${score}`);
}

function startTimer() {
    currentBar = width;
    drawTimerBar();
    intervalId = setInterval(() => {
        currentBar--;
        drawTimerBar();
        if (currentBar <= 0) {
            console.log("\n⏰ Süre doldu!");
            endGame();
        }
    }, timerSpeed);
}

function resetTimer() {
    currentBar = width;
    drawTimerBar();
}

function generateNumber() {
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let removed = [];

    for (let i = 0; i < 4; i++) {
        let idx = Math.floor(Math.random() * digits.length);
        removed.push(digits.splice(idx, 1)[0]);
    }

    const added = [];
    for (let i = 0; i < 4; i++) {
        let idx = Math.floor(Math.random() * digits.length);
        added.push(digits[idx]);
    }

    digits = digits.concat(added);

    // Karıştır
    for (let i = digits.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    const result = digits.join("").slice(0, 9);
    currentNumbers = result.split("");
    console.log("\n🧠 Sayı: " + result);
    process.stdout.write("🚀 Rakam gir: ");
}

function checkAnswer(input) {
    const number = input.trim();
    if (!/^[1-9]$/.test(number)) {
        console.log("\n❌ Sadece 1-9 arası rakam gir!");
        process.stdout.write("🚀 Rakam gir: ");
        return;
    }

    if (!currentNumbers.includes(number)) {
        score += currentDifficulty;
        console.log("\n✅ Doğru! Skor:", score);
        resetTimer();
        generateNumber();
    } else {
        console.log("\n❌ Yanlış! Bu rakam vardı.");
        endGame();
    }
}

function endGame() {
    clearInterval(intervalId);
    process.stdin.pause(); // giriş akışını durdur

    console.log("\n🛑 Oyun bitti! Toplam skor:", score);
    rl.close();
}

function startGame() {
    score = 0;
    console.clear();
    console.log("=== 🎮 OLMAYAN RAKAMI BUL ===");
    console.log("Kurallar: 9 haneli sayıda bulunmayan bir rakamı seç!");
    console.log("Süre dolmadan doğru rakamı bul. Yanlış yaparsan oyun biter.\n");

    generateNumber();
    startTimer();
}

// Sadece rakam girdisi dinle
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (key) {
    if (key === '\u0003') {
        process.exit(); // Ctrl+C
    }

    checkAnswer(key);
});

startGame();