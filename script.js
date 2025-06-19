const firebaseConfig = {
  apiKey:atob("QUl6YVN5Q2pGSjFyQVFmVE40Rkp2YWpYLXN6NFQ4QzA5U2tKRjdB"),databaseURL:atob("aHR0cHM6Ly9uYXItc2F5aWRpc2ktZGVmYXVsdC1ydGRiLmV1cm9wZS13ZXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcA"),projectId:atob("bmFyLXNheWlkaXNp")
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

// Game State
let width = 0;
let RestrictedDigits = 4;
let score = 0;
let intervalId;
let shuffleNumpad = false;
let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) || 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let currentGameMode = "classic";
let gameStarted = false;

// Sound System
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.volume = 0.5;
    this.sounds = {};
    this.initAudio();
  }

  async initAudio() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      await this.createSounds();
    } catch (error) {
      console.log("Audio not supported:", error);
    }
  }

  async createSounds() {
    // Correct answer sound
    this.sounds.correct = await this.createTone(800, 0.1, "sine");
    // Wrong answer sound
    this.sounds.wrong = await this.createTone(200, 0.3, "sawtooth");
    // Button click sound
    this.sounds.click = await this.createTone(400, 0.05, "square");
    // Game start sound
    this.sounds.start = await this.createTone(600, 0.2, "sine");
  }

  async createTone(frequency, duration, type = "sine") {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume * 0.1,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    return { oscillator, gainNode, duration };
  }

  play(soundName) {
    if (!this.audioContext || !this.sounds[soundName]) return;

    this.createTone(
      soundName === "correct"
        ? 800
        : soundName === "wrong"
        ? 200
        : soundName === "click"
        ? 400
        : 600,
      soundName === "correct"
        ? 0.1
        : soundName === "wrong"
        ? 0.3
        : soundName === "click"
        ? 0.05
        : 0.2,
      soundName === "correct"
        ? "sine"
        : soundName === "wrong"
        ? "sawtooth"
        : soundName === "click"
        ? "square"
        : "sine"
    ).then((sound) => {
      if (sound) {
        sound.oscillator.start();
        sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
      }
    });
  }

  setVolume(volume) {
    this.volume = volume / 100;
  }
}

const soundManager = new SoundManager();

// Sidebar Management
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggle = document.getElementById("sidebarToggle");

  if (window.innerWidth <= 1024) {
    sidebar.classList.toggle("show");
  } else {
    sidebar.classList.toggle("hidden");
    mainContent.classList.toggle("sidebar-hidden");
  }

  toggle.classList.toggle("active");
  soundManager.play("click");
}

function selectGameMode(mode) {
  currentGameMode = mode;

  // Update UI
  document.querySelectorAll(".game-mode-option").forEach((option) => {
    option.classList.remove("active");
  });

  event.currentTarget.classList.add("active");

  // Update radio button
  document.querySelector(`input[value="${mode}"]`).checked = true;

  // Update game mode indicator
  const indicator = document.getElementById("gameModeIndicator");
  indicator.textContent = mode === "classic" ? "Klasik" : "Zıt";

  soundManager.play("click");
}

function showMenu() {
  document.getElementById("myPopup").style.display = "none";
  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth <= 1024) {
    sidebar.classList.add("show");
  }
  soundManager.play("click");
}

// Volume Control
document.getElementById("volumeSlider").addEventListener("input", function () {
  const volume = this.value;
  document.getElementById("volumeValue").textContent = volume + "%";
  soundManager.setVolume(volume);
});

// Game Functions
function updateStatistics() {
  document.getElementById("gamesPlayed").textContent = gamesPlayed;
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("currentScore").textContent = score;
}

function startGame() {
  gameStarted = true;
  let baseInterval = 25;
  let difficultyScores = 2;

  shuffleNumpad = document.getElementById("shuffleNumpad").checked;
  if (shuffleNumpad) {
    shuffleNumpadKeys();
    difficultyScores += 5;
  }
  if (document.getElementById("increaseTime10").checked) {
    baseInterval += 10;
    difficultyScores -= 1;
  }
  if (document.getElementById("reduceTime10").checked) {
    baseInterval -= 10;
    difficultyScores += 1;
  }
  if (document.getElementById("reduceTime15").checked) {
    baseInterval -= 15;
    difficultyScores += 5;
  }
  if (document.getElementById("3Digits").checked) {
    RestrictedDigits = 3;
    difficultyScores += 2;
  }
  if (document.getElementById("2Digits").checked) {
    RestrictedDigits = 2;
    difficultyScores += 3;
  }
  if (document.getElementById("1Digits").checked) {
    RestrictedDigits = 1;
    difficultyScores += 4;
  }

  levelBox.innerText = `Zorluk: ${difficultyScores / 2}`;

  // Hide sidebar on mobile and popup
  if (window.innerWidth <= 1024) {
    document.getElementById("sidebar").classList.remove("show");
    document.getElementById("sidebarToggle").classList.remove("active");
  }
  document.getElementById("myPopup").style.display = "none";

  scrbrd.innerText = `Puan: 0`;
  score = 0;
  width = 0;

  generateNumber(RestrictedDigits);
  intervalId = setInterval(moveProgressBar, baseInterval);

  soundManager.play("start");
}

function inputDisabled(id, relatedIds = []) {
  const element = document.getElementById(id);
  relatedIds.forEach((relatedId) => {
    const relatedElement = document.getElementById(relatedId);
    if (relatedElement) {
      relatedElement.disabled = element.checked;
    }
  });
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

  let player = data[playerId];

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
        score: updatedData[key].score
      }))
      .sort((a, b) => b.score - a.score);

    const playerRank =
      sortedPlayers.findIndex((player) => player.uid === playerId) + 1;

    if (playerRank > 0) {
      document.getElementById(
        "leaderboard"
      ).innerText = `${playerRank}. sıradasın`;
    } else {
      document.getElementById("leaderboard").innerText = "Sıralama hatası";
    }
  } else {
    playerRef.child(playerId).set({
      score: Number(highScore)
    });

    console.log(`New player ${playerId} created with score ${highScore}`);
    document.getElementById("leaderboard").innerText = `${
      Object.keys(data).length + 1
    }. sıradasın`;
  }
}

function endGame() {
  gameStarted = false;
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

  soundManager.play("wrong");
}

function moveProgressBar() {
  if (width >= 100) {
    width = 0;
    score--;
    scrbrd.innerText = `Puan: ${score}`;
    generateNumber(RestrictedDigits);
    updateScoreDisplay("red");
    if (shuffleNumpad) {
      shuffleNumpadKeys();
    }
  } else {
    width++;
    progressBar.style.width = width + "%";
  }
}

function checkNumber(number) {
  if (!gameStarted) return;

  const numberToCheck = number.toString();
  const displayValue = document.getElementById("number-display").innerText;

  // Add click animation
  const button = event.target;
  button.classList.add("clicked");
  setTimeout(() => button.classList.remove("clicked"), 300);

  let isCorrect = false;

  if (currentGameMode === "classic") {
    // Classic mode: find number NOT in display
    isCorrect = !displayValue.includes(numberToCheck);
  } else {
    // Opposite mode: find number IN display
    isCorrect = displayValue.includes(numberToCheck);
  }

  if (isCorrect) {
    let difficulty = Number(levelBox.innerText.split(": ")[1]);
    score = score + difficulty;
    scrbrd.innerText = `Puan: ${score}`;
    width = 0;
    generateNumber(RestrictedDigits);
    updateScoreDisplay("green");
    if (shuffleNumpad) {
      shuffleNumpadKeys();
    }
    soundManager.play("correct");
  } else {
    endGame();
  }

  soundManager.play("click");
}

function generateNumber(count) {
  let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (count < 1 || count > 4) {
    throw new Error("Count must be between 1 and 4.");
  }

  let removedDigits = [];
  for (let i = 0; i < count; i++) {
    let randomIndex = Math.floor(Math.random() * digits.length);
    removedDigits.push(digits.splice(randomIndex, 1)[0]);
  }

  let addedDigits = [];
  for (let i = 0; i < count; i++) {
    let randomIndex = Math.floor(Math.random() * digits.length);
    addedDigits.push(digits[randomIndex]);
  }
  digits = digits.concat(addedDigits);

  for (let i = digits.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  let result = digits.join("");
  document.getElementById("number-display").innerText = result;
  return result;
}

function shuffleNumpadKeys() {
  const numpadButtons = Array.from(
    document.getElementsByClassName("number-button")
  );
  const shuffledNumbers = numpadButtons
    .map((button) => button.innerText)
    .sort(() => Math.random() - 0.5);

  numpadButtons.forEach((button, index) => {
    button.innerText = shuffledNumbers[index];
  });
}

function updateScoreDisplay(color) {
  const scoreElement = document.getElementById(`${color}-increase`);
  scoreElement.style.opacity = "1";
  scoreElement.style.transform = "translate(-50%, -70px)";
  setTimeout(() => {
    scoreElement.style.opacity = "0";
    scoreElement.style.transform = "translate(-50%, -50px)";
  }, 1000);
}

function generateUID() {
  return "SAxxxxxxxyxxxxIxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Event Listeners
document
  .getElementById("sidebarToggle")
  .addEventListener("click", toggleSidebar);

document.addEventListener("keydown", function (event) {
  if (event.code.startsWith("Numpad")) {
    let button = document.getElementById(event.key);
    if (button) button.click();
  }
});

// Responsive sidebar handling
window.addEventListener("resize", function () {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggle = document.getElementById("sidebarToggle");

  if (window.innerWidth > 1024) {
    sidebar.classList.remove("show");
    if (!sidebar.classList.contains("hidden")) {
      mainContent.classList.remove("sidebar-hidden");
    }
  } else {
    mainContent.classList.remove("sidebar-hidden");
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  updateStatistics();
  if (playerName == null) {
    localStorage.setItem("uid", generateUID());
  } else {
    leaderboard();
  }
});


let menutoggle = document.querySelector('.toggle');
    menutoggle.onclick = function(){
    menutoggle.classList.toggle('active')
}