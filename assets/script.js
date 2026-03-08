if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sayidisi/service-worker.js")
      .then((reg) => console.log("Service Worker kayıtlı:", reg.scope))
      .catch((err) => console.error("SW hatası:", err));
  });
}

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
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code.startsWith("Numpad")) {
        const num = event.code.slice(6);
        if (!isNaN(num) && num.length === 1 && num !== "0") {
            if (!gameStarted) {
                gameStarted = true;
                startGame();
            } else {
                checkNumber(num);
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < 9; i++) {
        const tile = document.getElementById(`tile-${i}`);
        if (tile) tiles.push(tile);
    }

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((el) => new bootstrap.Tooltip(el));

    updateStatistics();
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
        <li>En yüksek puanın</li>
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