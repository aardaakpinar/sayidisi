# Missing Digit Game

**Find the missing digit from a 9-digit number!**

## About

**Missing Digit** is a fun web game that tests speed and concentration. You must find the only digit missing from a random 9-digit number and give the correct answer within the specified time.

### Features

- ✅ **Console Support**: Playable with numpad and physical keyboard
- ✅ **Difficulty Levels**: Score multiplier increases with difficulty
- ✅ **Progress Indicator**: Visually track remaining time
- ✅ **Scoring System**: Consecutive successful answers increase bonus points
- ✅ **Responsive Design**: Works perfectly on desktop, tablet and mobile devices
- ✅ **PWA Support**: Can be installed as a Progressive Web App and works offline

## How to Play?

1. **When the game starts**, a 9-digit random number will be displayed on the screen.
2. **Objective**: Find the digit that is **missing** in this number and provide feedback.
3. **Input**:
   - From the keyboard (0-9 keys)
   - From the Numpad
   - From the virtual keypad on a mobile device

4. **Time**: You have a certain amount of time to answer each question.
5. **Score**:
   - Correct answer = You earn points.
   - Consecutive correct answers = Bonus multiplier increases.
   - As the difficulty level increases = More points.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Framework**: PWA (Progressive Web App)
- **Runtime**: Browser-based

## Installation and Operation

### Online Play
Directly in the browser Playable:
```
https://aardaakpinar.github.io/sayidisi/
```

### Running on Local Machine
```bash
# Clone the repository
git clone https://github.com/aardaakpinar/sayidisi.git

# Change directory
cd sayidisi

# Start a simple web server (Python)
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

## Score System

| Activity | Points |
|----------|------|
| Correct Answer | 10 × Difficulty × Multiplier |
| Consecutive Correct Answers | Multiplier +1 |
| Error | Multiplier Reset |

## License

This project is licensed under the **GNU General Public License v3.0**.

See [LICENSE](LICENSE) file for details.

**Have fun playing!**
