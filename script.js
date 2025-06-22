const firebaseConfig = {
    apiKey: atob("QUl6YVN5Q2pGSjFyQVFmVE40Rkp2YWpYLXN6NFQ4QzA5U2tKRjdB"),
    databaseURL: atob("aHR0cHM6Ly9uYXItc2F5aWRpc2ktZGVmYXVsdC1ydGRiLmV1cm9wZS13ZXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcA"),
    projectId: atob("bmFyLXNheWlkaXNp"),
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const database = firebase.database();
const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");
const playerName = localStorage.getItem("uid");

let width = 0;
let RestrictedDigits = 4;
let score = 0;
let intervalId;
let shuffleNumpad = false;
let gamesPlayed = Number.parseInt(localStorage.getItem("gamesPlayed")) || 0;
let highScore = Number.parseInt(localStorage.getItem("highScore")) || 0;
let currentGameMode = "classic";
let currentNumbers = [];
let currentIndex = 0;

// Game mode descriptions
const modeDescriptions = {
    classic: {
        title: "📋 Klasik Mod",
        description: "Geleneksel oyun modu. 9 haneli sayıda bulunmayan rakamı bulmaya çalış. Doğru cevap verdiğinde puan kazan, yanlış cevap verdiğinde oyun biter.",
    },
    reverse: {
        title: "🔄 Ters Mod",
        description: "Zorlayıcı sıralı mantık! Ekranda gösterilen rakamları soldan sağa doğru sırayla tuşlamaya çalış. Yanlış sırada basarsan oyun biter, doğru sırayı tamamlarsan puan kazan.",
    },
    shuffle: {
        title: "🔀 Karışık Mod",
        description: "Klavye sürekli karışır! Her yeni sayıda klavye düzeni değişir. Hem olmayan rakamı bul hem de değişen klavyeye alış.",
    },
    speed: {
        title: "⚡ Hız Modu",
        description: "Adrenalin dolu hızlı oyun! Süre çok daha kısa, reflekslerin test edilecek. Hızlı düşün, hızlı oyna!",
    },
};

function switchTab(tabName) {
    // Remove active class from all tab buttons and contents
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.remove("active");
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
    });

    // Add active class to clicked tab button
    event.target.classList.add("active");

    // Show corresponding tab content
    document.getElementById(tabName).classList.add("active");
}

function updateStatistics() {
    document.getElementById("gamesPlayed").textContent = gamesPlayed;
    document.getElementById("highScore").textContent = highScore;
    document.getElementById("currentScore").textContent = score;
}

function startGame() {
    // Get selected game mode
    const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;
    currentGameMode = selectedMode;

    let baseInterval = 25;
    let difficultyScores = 2;

    // Configure game based on mode
    switch (currentGameMode) {
        case "classic":
            shuffleNumpad = false;
            RestrictedDigits = 4;
            break;
        case "reverse":
            shuffleNumpad = false;
            RestrictedDigits = 4;
            difficultyScores += 2;
            currentNumbers = [];
            currentIndex = 0;
            baseInterval += 50;
            break;
        case "shuffle":
            shuffleNumpad = true;
            RestrictedDigits = 4;
            difficultyScores += 3;
            break;
        case "speed":
            shuffleNumpad = false;
            RestrictedDigits = 4;
            baseInterval -= 10;
            difficultyScores += 4;
            break;
    }

    currentDifficulty = difficultyScores / 2;
    levelBox.innerText = `${currentGameMode.charAt(0).toUpperCase() + currentGameMode.slice(1)} (${currentDifficulty})`;

    document.getElementById("myPopup").style.display = "none";
    scrbrd.innerText = `Puan: 0`;
    score = 0;

    generateNumber(RestrictedDigits);
    intervalId = setInterval(moveProgressBar, baseInterval);

    if (shuffleNumpad) {
        shuffleNumpadKeys();
    }
}

async function leaderboard() {
    let playerId = localStorage.getItem("uid");

    if (!playerId) {
        playerId = generateUID();
        localStorage.setItem("uid", playerId);
        console.log(`New player created with ID: ${playerId}`);
    }

    const playerRef = database.ref("leaderboard");
    const snapshot = await playerRef.once("value");
    const data = snapshot.val() || {};

    const player = data[playerId];

    if (player) {
        if (player.score < highScore) {
            playerRef.child(playerId).update({ score: highScore });
            console.log(`Player ${playerId} score updated to ${highScore}`);
        }

        const updatedSnapshot = await playerRef.once("value");
        const updatedData = updatedSnapshot.val() || {};

        const sortedPlayers = Object.keys(updatedData)
            .map((key) => ({
                uid: key,
                score: updatedData[key].score,
            }))
            .sort((a, b) => b.score - a.score);

        const playerRank = sortedPlayers.findIndex((player) => player.uid === playerId) + 1;

        if (playerRank > 0) {
            document.getElementById("leaderboard").innerText = playerRank + ". sıradasın";
        } else {
            document.getElementById("leaderboard").innerText = "Sıralama hatası";
        }
    } else {
        playerRef.child(playerId).set({
            score: Number(highScore),
        });

        console.log(`New player ${playerId} created with score ${highScore}`);
        document.getElementById("leaderboard").innerText = Object.keys(data).length + 1 + ". sıradasın";
    }
}

function endGame() {
    clearInterval(intervalId);
    document.getElementById("myPopup").style.display = "flex";
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
    currentNumbers = [];
    currentIndex = 0;
}

function pauseGame() {
    clearInterval(intervalId);
}

function moveProgressBar() {
    if (width >= 100) {
        width = 0;

        if (currentGameMode === "reverse") {
            // In reverse mode, if time runs out, game ends
            endGame();
            return;
        } else {
            // In other modes, lose point and continue
            score--;
            scrbrd.innerText = `Puan: ${score}`;
            generateNumber(RestrictedDigits);
            updateScoreDisplay("red");
            if (shuffleNumpad) {
                shuffleNumpadKeys();
            }
        }
    } else {
        width++;
        progressBar.style.width = width + "%";
    }
}

function checkNumber(number) {
    const numberToCheck = number.toString();
    const displayValue = document.getElementById("number-display").innerText;

    switch (currentGameMode) {
        case "classic":
            checkClassicMode(numberToCheck, displayValue);
            break;
        case "reverse":
            checkReverseMode(numberToCheck, displayValue);
            break;
        case "shuffle":
            checkShuffleMode(numberToCheck, displayValue);
            break;
        case "speed":
            checkSpeedMode(numberToCheck, displayValue);
            break;
    }
}

function checkClassicMode(numberToCheck, displayValue) {
    if (!displayValue.includes(numberToCheck)) {
        score = score + Math.round(currentDifficulty);
        scrbrd.innerText = `Puan: ${score}`;
        width = 0;
        generateNumber(RestrictedDigits);
        updateScoreDisplay("green");
    } else {
        endGame();
    }
}

function checkReverseMode(numberToCheck, displayValue) {
    if (currentIndex < displayValue.length && displayValue[currentIndex] === numberToCheck) {
        currentIndex++;
        updateScoreDisplay("green");

        if (currentIndex === displayValue.length) {
            score = score + Math.round(currentDifficulty);
            scrbrd.innerText = `Puan: ${score}`;
            width = 0;
            currentIndex = 0;
            generateNumber(RestrictedDigits);
        }
    } else {
        endGame();
    }
}

function checkShuffleMode(numberToCheck, displayValue) {
    if (!displayValue.includes(numberToCheck)) {
        score = score + Math.round(currentDifficulty);
        scrbrd.innerText = `Puan: ${score}`;
        width = 0;
        generateNumber(RestrictedDigits);
        updateScoreDisplay("green");
        shuffleNumpadKeys();
    } else {
        endGame();
    }
}

function checkSpeedMode(numberToCheck, displayValue) {
    if (!displayValue.includes(numberToCheck)) {
        score = score + Math.round(currentDifficulty);
        scrbrd.innerText = `Puan: ${score}`;
        width = 0;
        generateNumber(RestrictedDigits);
        updateScoreDisplay("green");
    } else {
        endGame();
    }
}

function generateNumber(count) {
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (count < 1 || count > 4) {
        throw new Error("Count must be between 1 and 4.");
    }

    if (currentGameMode === "reverse") {
        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }
        const result = digits.join("");
        document.getElementById("number-display").innerText = result;
        return result;
    } else {
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
}

function shuffleNumpadKeys() {
    const numpadButtons = Array.from(document.getElementsByClassName("number-button"));
    const shuffledNumbers = numpadButtons.map((button) => button.innerText).sort(() => Math.random() - 0.5);

    numpadButtons.forEach((button, index) => {
        button.innerText = shuffledNumbers[index];
    });
}

function updateScoreDisplay(color) {
    const scoreElement = document.getElementById(`${color}-increase`);
    scoreElement.style.opacity = "1";
    scoreElement.style.transform = "translateY(0)";
    setTimeout(() => {
        scoreElement.style.opacity = "0";
        scoreElement.style.transform = "translateY(-40px)";
    }, 1000);
}

document.addEventListener("keydown", (event) => {
    if (event.code.startsWith("Numpad")) {
        const button = document.getElementById(event.key);
        if (button) {
            button.click();
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

// Tab switching functionality
function switchTab(tabName) {
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.remove("active");
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
    });

    event.target.classList.add("active");
    document.getElementById(tabName).classList.add("active");
}

// Game mode selection handler
document.addEventListener("DOMContentLoaded", () => {
    updateStatistics();

    // Add event listeners for game mode selection
    document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            const selectedMode = this.value;
            const description = modeDescriptions[selectedMode];
            const descriptionElement = document.getElementById("modeDescription");

            if (descriptionElement && description) {
                descriptionElement.innerHTML = `
                    <h4>${description.title}</h4>
                    <p>${description.description}</p>
                `;
            }
        });
    });
});

if (playerName == null) {
    localStorage.setItem("uid", generateUID());
} else {
    leaderboard();
}
