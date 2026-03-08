if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sayidisi/service-worker.js")
            .then((reg) => console.log("Service Worker kayitli:", reg.scope))
            .catch((err) => console.error("SW hatasi:", err));
    });
}

const progressBar = document.getElementById("progress");
const scoreBoard = document.getElementById("score");
const highScoreBoard = document.getElementById("highScore");
const tiles = [];

let score = 0;
let gameStarted = false;
let startTime = null;
const duration = 2500;
const restrictedDigits = 3;
let gamesPlayed = Number.parseInt(localStorage.getItem("gamesPlayed"), 10) || 0;
let highScore = Number.parseInt(localStorage.getItem("highScore"), 10) || 0;

function updateStatistics() {
    highScoreBoard.textContent = highScore;
    scoreBoard.textContent = score;
}

function startGame() {
    score = 0;
    updateStatistics();
    generateNumber(restrictedDigits);
    startTime = null;
    requestAnimationFrame(updateProgressBar);
}

function endGame() {
    gamesPlayed += 1;
    if (score > highScore) {
        highScore = score;
    }

    localStorage.setItem("gamesPlayed", String(gamesPlayed));
    localStorage.setItem("highScore", String(highScore));

    score = 0;
    gameStarted = false;
    progressBar.style.width = "0%";
    updateStatistics();
}

function updateProgressBar(timestamp) {
    if (!gameStarted) {
        return;
    }

    if (!startTime) {
        startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;
    progressBar.style.width = `${Math.min(progress * 100, 100)}%`;

    if (progress >= 1) {
        score -= 1;
        scoreBoard.textContent = score;
        generateNumber(restrictedDigits);
        startTime = timestamp;
    }

    requestAnimationFrame(updateProgressBar);
}

function generateNumber(count) {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const removed = [];

    for (let i = 0; i < count; i += 1) {
        const idx = Math.floor(Math.random() * digits.length);
        const removedDigit = digits.splice(idx, 1)[0];
        removed.push(removedDigit);
    }

    while (digits.length < 9) {
        let candidate = 0;
        do {
            candidate = Math.floor(Math.random() * 9) + 1;
        } while (removed.includes(candidate));
        digits.push(candidate);
    }

    for (let i = digits.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    tiles.forEach((tile, i) => {
        tile.textContent = digits[i];
    });
}

function highlightChoice(number, correct) {
    const btn = document.getElementById(String(number));
    if (!btn) {
        return;
    }

    btn.classList.add(correct ? "is-correct" : "is-absent");
    setTimeout(() => btn.classList.remove("is-correct", "is-absent"), 600);
}

function checkNumber(number) {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
        return;
    }

    const value = String(number);
    const displayValue = tiles.map((tile) => tile.textContent).join("");
    const isCorrect = !displayValue.includes(value);

    if (isCorrect) {
        tiles.forEach((tile) => tile.classList.add("correct-all"));
        score += 1;
        scoreBoard.textContent = score;

        setTimeout(() => {
            tiles.forEach((tile) => tile.classList.remove("correct-all"));
            generateNumber(restrictedDigits);
        }, 600);
        return;
    }

    tiles.forEach((tile) => {
        if (tile.textContent === value) {
            tile.classList.add("wrong");
        }
    });

    setTimeout(() => {
        tiles.forEach((tile) => tile.classList.remove("wrong"));
    }, 600);

    endGame();
}

document.addEventListener("keydown", (event) => {
    let value = null;

    if (event.code.startsWith("Numpad")) {
        const num = event.code.slice(6);
        if (num.length === 1 && num !== "0" && !Number.isNaN(Number(num))) {
            value = num;
        }
    } else if (event.code.startsWith("Digit")) {
        const num = event.code.slice(5);
        if (num.length === 1 && num !== "0" && !Number.isNaN(Number(num))) {
            value = num;
        }
    }

    if (value) {
        checkNumber(value);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < 9; i += 1) {
        const tile = document.getElementById(`tile-${i}`);
        if (tile) {
            tiles.push(tile);
        }
    }

    // Bootstrap JS yuklu degilse tooltip init'i guvenli sekilde atla.
    if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
        const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        triggers.forEach((el) => new bootstrap.Tooltip(el));
    }

    updateStatistics();
});

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = modal.querySelector(".close-btn");
const infoBtn = document.getElementById("info");

infoBtn.addEventListener("click", () => {
    modalBody.innerHTML = `
    <h2>Nasil Oynanir?</h2>
    <ul class="rules">
        <li>Oyunun ekrani ikiye ayrilir. <b>Ust tarafta</b> rastgele uretilmis sayi gorunur.</li>
        <li><b>Amaciniz</b> bu sayida <u>olmayan</u> rakami bulmaktir.</li>
        <li>Buldugunuz rakami verilen sure icinde
        <b>Alt taraftaki klavye</b> veya <b>numpad</b> kullanarak isaretleyin.</li>
    </ul>

    <h2>Menudeki sayilar ne?</h2>
    <span>Orada oyun hakkinda bilgiler yazmaktadir. Sirayla:</span>
    <ul>
        <li>Mevcut puanin</li>
        <li>En yuksek puanin</li>
    </ul>
    `;
    modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});
