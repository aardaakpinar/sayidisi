const progressBar = document.getElementById("progress");
const scrbrd = document.getElementById("score");
const levelBox = document.getElementById("level");
const token = 'vgkhtnkmtgyye';
const playerName = localStorage.getItem("uid");

let width = 0;
let RestrictedDigits = 4;
let score = 0;
let intervalId;
let shuffleNumpad = false;
let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

function updateStatistics() {
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('currentScore').textContent = score;
}


function startGame() {
    let baseInterval = 25;
    let difficultyScores = 1;

    shuffleNumpad = document.getElementById("shuffleNumpad").checked;
    if (shuffleNumpad) {
        shuffleNumpadKeys();
        difficultyScores += 5;
    }
    if (document.getElementById("reduceTime10").checked) {
        baseInterval -= 10;
        difficultyScores += 1;
    }
    if (document.getElementById("reduceTime13").checked) {
        baseInterval -= 13;
        difficultyScores += 4;
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

    levelBox.innerText = difficultyScores / 2;

    document.getElementById("myPopup").style.display = "none";
    scrbrd.innerText = `Puan: 0`;

    generateNumber(RestrictedDigits);
    intervalId = setInterval(moveProgressBar, baseInterval);
}


function inputDisabled(id, relatedIds = []) {
    const element = document.getElementById(id);

    relatedIds.forEach(relatedId => {
        const relatedElement = document.getElementById(relatedId);
        if (relatedElement) {
            relatedElement.disabled = element.checked;
        }
    });
}

async function leaderboard() {
    const response = await fetch(`https://keepthescore.com/api/${token}/board/`);
    const data = await response.json();
    
    let player = data.players.find(player => player.name === playerName);

    if (player) {
        let boardScore = player.score;
        if (boardScore < highScore) {
            newScore = highScore - boardScore;
            await fetch(`https://keepthescore.com/api/${token}/score/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    player_id: player.id,
                    score: newScore
                })
            });
        
            console.log(`Player ${player.name} score updated to ${newScore}`);
        } 
        
        document.getElementById("leaderboard").innerText = data.players.length + ". sıradasın";
        
    } else {
        const createResponse = await fetch(`https://keepthescore.com/api/${token}/player/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playerName
            })
        });
        const newPlayer = await createResponse.json();

        await fetch(`https://keepthescore.com/api/${token}/score/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_id: newPlayer.id,
                score: highScore
            })
        });

        console.log(`New player ${playerName} created with score ${highScore}`);
        document.getElementById("leaderboard").innerText = data.players.length + 1 + ". sıradasın";
    }
}

function endGame() {
    clearInterval(intervalId);
    document.getElementById("myPopup").style.display = "block";
    gamesPlayed++;
    if (score > highScore) {
        highScore = score;
    }
    localStorage.setItem('gamesPlayed', gamesPlayed);
    localStorage.setItem('highScore', highScore);
    updateStatistics();
    leaderboard();
    width = 0;
    score = 0;
    scrbrd.innerText = `Puan: ${score}`;
}

function pauseGame() {
    clearInterval(intervalId);
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
    const numberToCheck = number.toString();
    const displayValue = document.getElementById("number-display").innerText;
    if (!displayValue.includes(numberToCheck)) {
        let difficulty = Number(levelBox.innerText);
        score = score + difficulty;
        scrbrd.innerText = `Puan: ${score}`;
        width = 0;
        generateNumber(RestrictedDigits);
        updateScoreDisplay("green");
        if (shuffleNumpad) {
            shuffleNumpadKeys();
        }
    } else {
        endGame();
    }
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

    let result = digits.join('');
    document.getElementById("number-display").innerText = result;
    return result;
}


function shuffleNumpadKeys() {
    const numpadButtons = Array.from(document.getElementsByClassName("number-button"));
    const shuffledNumbers = numpadButtons.map(button => button.innerText).sort(() => Math.random() - 0.5);

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

document.addEventListener('keydown', function(event) {
    if (event.code.startsWith('Numpad')) {
        let button = document.getElementById(event.key);
        button.click(); 
    }
});

function generateUID() {
    return 'SAxxxxxxxyxxxxIxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.addEventListener('DOMContentLoaded', updateStatistics);
if (playerName == null) {
    localStorage.setItem("uid",generateUID());
} else {
    leaderboard()
}