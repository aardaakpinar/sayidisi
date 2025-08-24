// Firebase config
const firebaseConfig = {
    apiKey: atob("QUl6YVN5Q2pGSjFyQVFmVE40Rkp2YWpYLXN6NFQ4QzA5U2tKRjdB"),
    databaseURL: atob("aHR0cHM6Ly9uYXItc2F5aWRpc2ktZGVmYXVsdC1ydGRiLmV1cm9wZS13ZXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcA"),
    projectId: atob("bmFyLXNheWlkaXNp"),
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
let width = 0,
    score = 0,
    intervalId,
    gameStarted = false;
let RestrictedDigits = 3;
let gamesPlayed = Number.parseInt(localStorage.getItem("gamesPlayed")) || 0;
let highScore = Number.parseInt(localStorage.getItem("highScore")) || 0;

// Tiles dizisi
const tiles = [];

function updateStatistics() {
    document.getElementById("gamesPlayed").textContent = gamesPlayed;
    document.getElementById("highScore").textContent = highScore;
    scrbrd.textContent = score;
}

function startGame() {
    score = 0;
    updateStatistics();
    generateNumber(RestrictedDigits);
    width = 0;
    intervalId = setInterval(moveProgressBar, 25);
}

function endGame() {
    clearInterval(intervalId);
    gamesPlayed++;
    if (score > highScore) highScore = score;
    localStorage.setItem("gamesPlayed", gamesPlayed);
    localStorage.setItem("highScore", highScore);
    updateStatistics();
    leaderboard();
    width = 0;
    score = 0;
    gameStarted = false;
    progressBar.style.width = "0%";
}

function moveProgressBar() {
    if (width >= 100) {
        endGame();
    } else {
        width++;
        progressBar.style.width = width + "%";
    }
}

function generateNumber(count) {
  let digits = [1,2,3,4,5,6,7,8,9];

  // Rastgele sayı çıkar
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * digits.length);
    digits.splice(idx,1);
  }

  // Eksik rakamları tekrar ekle
  while(digits.length < 9) {
    digits.push(Math.floor(Math.random()*9)+1);
  }

  // Karıştır
  for (let i = digits.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  // Tiles’a yaz
  tiles.forEach((tile,i)=>{
    if(tile) tile.textContent = digits[i];
  });

  return digits.join("");
}

function highlightChoice(number, correct) {
    const btn = document.getElementById(number);
    if (btn) {
        btn.classList.add(correct ? "is-correct" : "is-absent");
        setTimeout(() => btn.classList.remove("is-correct", "is-absent"), 600);
    }
}

function checkNumber(number) {
    let displayValue = "";
    tiles.forEach(tile => displayValue += tile.textContent);

    if (gameStarted) {
        if (!displayValue.includes(number.toString())) {
            // Doğru seçim: tüm tiles yeşil
            tiles.forEach(tile => tile.classList.add("correct-all"));

            score++;
            scrbrd.textContent = score;
            width = 0;

            // 600ms sonra eski haline dön ve yeni sayı üret
            setTimeout(() => {
                tiles.forEach(tile => tile.classList.remove("correct-all"));
                generateNumber(RestrictedDigits);
            }, 600);

        } else {
            endGame();

            tiles.forEach(tile => {
                if (tile.textContent === number.toString()) tile.classList.add("wrong");
            });

            setTimeout(() => {
                tiles.forEach(tile => tile.classList.remove("wrong"));
            }, 600);
        }
    } else {
        gameStarted = true;
        startGame();
        leaderboard();
    }
}

document.addEventListener("keydown", (event) => {
    if(event.code.startsWith("Numpad")) {
        if(!gameStarted){
            gameStarted = true;
            startGame();
            leaderboard();
        } else {
            const num = event.code.replace("Numpad", "");
            checkNumber(num);
        }
    }
});

function generateUID() {
    return "SAxxxxxxxyxxxxIxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

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
        const sorted = Object.keys(data)
            .map((k) => ({ uid: k, score: data[k].score }))
            .sort((a, b) => b.score - a.score);
        const rank = sorted.findIndex((p) => p.uid === playerId) + 1;
        document.getElementById("leaderboard").innerText = rank > 0 ? rank + "." : "?";
    } else {
        playerRef.child(playerId).set({ score: Number(highScore) });
        document.getElementById("leaderboard").innerText = Object.keys(data).length + 1 + ".";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < 9; i++) {
        const tile = document.getElementById(`tile-${i}`);
        if (tile) tiles.push(tile);
    }

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

    updateStatistics();
    leaderboard();
});