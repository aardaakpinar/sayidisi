const firebaseConfig = {
    apiKey: atob("QUl6YVN5Q2pGSjFyQVFmVE40Rkp2YWpYLXN6NFQ4QzA5U2tKRjdB"),
    databaseURL: atob("aHR0cHM6Ly9uYXItc2F5aWRpc2ktZGVmYXVsdC1ydGRiLmV1cm9wZS13ZXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcA"),
    projectId: atob("bmFyLXNheWlkaXNp"),
};

// Firebase başlat
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const database = firebase.database();
const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
const playerName = localStorage.getItem("uid");

let width = 0;
let score = 0;
let intervalId;
let gameStarted = false;
let RestrictedDigits = 2;
let gamesPlayed = Number.parseInt(localStorage.getItem("gamesPlayed")) || 0;
let highScore = Number.parseInt(localStorage.getItem("highScore")) || 0;

// İstatistikleri güncelle
function updateStatistics() {
    document.getElementById("gamesPlayed").textContent = "🎮" + gamesPlayed;
    document.getElementById("highScore").textContent = "🎯" + highScore;
}

// Oyun başlat
function startGame() {
    score = 0;
    scrbrd.innerText = `Puan: ${score}`;
    generateNumber(RestrictedDigits);
    intervalId = setInterval(moveProgressBar, 25);
}

// Oyun bitir
function endGame() {
    clearInterval(intervalId);
    gamesPlayed++;
    if (score > highScore) {
        highScore = score;
    }
    localStorage.setItem("gamesPlayed", gamesPlayed);
    localStorage.setItem("highScore", highScore);
    updateStatistics();
    leaderboard();
    width = 0;
    score = 0;
    scrbrd.innerText = `Puan: ${score}`;
    gameStarted = false;
}

// İlerleme çubuğu
function moveProgressBar() {
    if (width >= 100) {
        endGame();
    } else {
        width++;
        progressBar.style.width = width + "%";
    }
}

// Sayı üret
function generateNumber(count) {
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (count < 1 || count > 4) {
        throw new Error("Count must be between 1 and 4.");
    }
    
    // For other modes, use original logic
    const removedDigits = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        removedDigits.push(digits.splice(randomIndex, 1)[0]);
    }

    const addedDigits = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        addedDigits.push(digits[randomIndex]);
    }
    digits = digits.concat(addedDigits);

    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    const result = digits.join("");
    document.getElementById("number-display").innerText = result;
    return result;
}

// Kontrol et
function checkNumber(number) {
    if (gameStarted == true) {
        const displayValue = document.getElementById("number-display").innerText;
        if (!displayValue.includes(number.toString())) {
            score++;
            scrbrd.innerText = `Puan: ${score}`;
            width = 0;
            generateNumber(RestrictedDigits);
        } else {
            endGame();
        }
    } else {
        gameStarted = true;
        startGame();
        leaderboard();
    }
}

// PC için Numpad
document.addEventListener("keydown", (event) => {
    if (event.code.startsWith("Numpad")) {
        if (!gameStarted) {
            gameStarted = true;
            startGame();
            leaderboard();
        }
        const button = document.getElementById(event.key);
        if (button) button.click();
    }
});

// Mobil için dokunma
document.addEventListener("touchstart", () => {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
        leaderboard();
    }
}, { once: true });


// UID oluştur
function generateUID() {
    return "SAxxxxxxxyxxxxIxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Liderlik tablosu
async function leaderboard() {
    let playerId = localStorage.getItem("uid");
    if (!playerId) {
        playerId = generateUID();
        localStorage.setItem("uid", playerId);
    }
    const playerRef = database.ref("leaderboard");
    const snapshot = await playerRef.once("value");
    const data = snapshot.val() || {};
    const player = data[playerId];
    if (player) {
        if (player.score < highScore) {
            playerRef.child(playerId).update({ score: highScore });
        }
        const sortedPlayers = Object.keys(data)
            .map((key) => ({ uid: key, score: data[key].score }))
            .sort((a, b) => b.score - a.score);
        const playerRank = sortedPlayers.findIndex((p) => p.uid === playerId) + 1;
        document.getElementById("leaderboard").innerText = playerRank > 0 ? playerRank + "." : "Sıralama hatası";
    } else {
        playerRef.child(playerId).set({ score: Number(highScore) });
        document.getElementById("leaderboard").innerText = Object.keys(data).length + 1 + ".";
    }
}

// Sayfa yüklenince başlat
document.addEventListener("DOMContentLoaded", () => {
    updateStatistics();
    leaderboard();
});