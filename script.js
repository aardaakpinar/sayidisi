// Firebase config
const firebaseConfig = {
    apiKey: atob("QUl6YVN5Q2pGSjFyQVFmVE40Rkp2YWpYLXN6NFQ4QzA5U2tKRjdB"),
    databaseURL: atob("aHR0cHM6Ly9uYXItc2F5aWRpc2ktZGVmYXVsdC1ydGRiLmV1cm9wZS13ZXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcA"),
    projectId: atob("bmFyLXNheWlkaXNp"),
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

firebase.auth().signInAnonymously()
    .then(() => {
      console.log("Anonim giriş başarılı!");
    })
    .catch((error) => {
      console.error("Hata:", error.code, error.message);
    });

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const isAnonymous = user.isAnonymous;
        const uid = user.uid;
        localStorage.setItem("uid", uid);
        console.log("Giriş yapıldı. UID:", uid, "Anonim:", isAnonymous);
    } else {
        console.log("Henüz giriş yapılmadı.");
    }
});

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
        width = 0;
        score--;
        scrbrd.textContent = score;
        generateNumber(RestrictedDigits);
    } else {
        width++;
        progressBar.style.width = width + "%";
    }
}

function generateNumber(count) {
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let removed = [];

    for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * digits.length);
        const removedDigit = digits.splice(idx, 1)[0];
        removed.push(removedDigit);
    }

    while (digits.length < 9) {
        let candidate;
        do {
            candidate = Math.floor(Math.random() * 9) + 1;
        } while (removed.includes(candidate));
        digits.push(candidate);
    }

    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    tiles.forEach((tile, i) => {
        if (tile) tile.textContent = digits[i];
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
    tiles.forEach((tile) => (displayValue += tile.textContent));

    if (gameStarted) {
        if (!displayValue.includes(number.toString())) {
            // Doğru seçim: tüm tiles yeşil
            tiles.forEach((tile) => tile.classList.add("correct-all"));

            score++;
            scrbrd.textContent = score;
            width = 0;

            // 600ms sonra eski haline dön ve yeni sayı üret
            setTimeout(() => {
                tiles.forEach((tile) => tile.classList.remove("correct-all"));
                generateNumber(RestrictedDigits);
            }, 600);
        } else {
            endGame();

            tiles.forEach((tile) => {
                if (tile.textContent === number.toString()) tile.classList.add("wrong");
            });

            setTimeout(() => {
                tiles.forEach((tile) => tile.classList.remove("wrong"));
            }, 600);
        }
    } else {
        gameStarted = true;
        startGame();
        leaderboard();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code.startsWith("Numpad")) {
        const num = event.code.slice(6);
        if (!isNaN(num) && num.length === 1 && num !== "0") {
            if (!gameStarted) {
                gameStarted = true;
                startGame();
                leaderboard();
            } else {
                checkNumber(num);
            }
        }
    }
});

async function leaderboard() {
    let playerId = localStorage.getItem("uid");

    playerId = playerId.trim().replace(/[.#$[\]]/g, "");

    const playerRef = database.ref("leaderboard");
    const snapshot = await playerRef.once("value");
    const data = snapshot.val() || {};
    const lb = document.getElementById("leaderboard");

    const player = data[playerId];

    if (player) {
        if (player.score < highScore) {
            playerRef.child(playerId).update({ score: highScore });
        }

        const sorted = Object.keys(data)
            .map((k) => ({ uid: k, score: data[k].score }))
            .sort((a, b) => b.score - a.score);

        const rank = sorted.findIndex((p) => p.uid === playerId) + 1;
        lb.innerText = rank > 0 ? rank + "." : "?";

        lb.removeAttribute("gold");
        lb.removeAttribute("silver");
        lb.removeAttribute("bronze");

        if (rank === 1) lb.setAttribute("gold", "");
        else if (rank === 2) lb.setAttribute("silver", "");
        else if (rank >= 3 && rank <= 5) lb.setAttribute("bronze", "");
    } else {
        playerRef.child(playerId).set({ score: Number(highScore) });
        lb.innerText = Object.keys(data).length + 1 + ".";

        lb.removeAttribute("gold");
        lb.removeAttribute("silver");
        lb.removeAttribute("bronze");

        const newRank = Object.keys(data).length + 1;
        if (newRank === 1) lb.setAttribute("gold", "");
        else if (newRank === 2) lb.setAttribute("silver", "");
        else if (newRank >= 3 && newRank <= 5) lb.setAttribute("bronze", "");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < 9; i++) {
        const tile = document.getElementById(`tile-${i}`);
        if (tile) tiles.push(tile);
    }

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((el) => new bootstrap.Tooltip(el));

    updateStatistics();
    leaderboard();
});


const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = modal.querySelector(".close-btn");

document.getElementById("info").addEventListener("click", () => {
  modalBody.innerHTML = `
    <h2>Nasıl Oynanır?</h2>
    <ul class="rules">
        <li>Oyunun ekranı ikiye ayrılır. <b>Üst tarafta</b> rastgele üretilmiş sayı görünür.</li>
        <li><b>Amacınız</b> bu sayıda <u>olmayan</u> rakamı bulmaktır.</li>
        <li>Bulduğunuz rakamı verilen süre içinde 
        <b>Alt taraftaki Klavye</b> veya <b>Numpad</b> kullanarak işaretleyin.</li>
    </ul>

    <h2>Menüde ki sayılar ne?</h2>
    <span>Orda oyun hakkında bilgiler yazmaktadır. Sırayla:</span>
    <ul>
        <li>Mevcut puanın</li>
        <li>Oynadığın oyun sayısı</li>
        <li>Genel sıralaman</li>
    </ul>
    `;
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
