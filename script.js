const DOMgame = document.querySelector(".game");
const DOMlimit = document.querySelector(".game_limit");
const zonePos = {
    top: document.querySelector(".game_limit").getBoundingClientRect().top,
    bot: document.querySelector(".game_limit").getBoundingClientRect().bottom
}

var gameConf = {
    delay: 3000,
    speed: 3
}
var restartText = [
    [
        "Ahahahaha noob!",
        "What's your nickname: \"Super Loser\"?"
    ],
    [
        "That's all you can do?...",
        "I'm sorry for your parents."
    ],
    [
        "Do you even try?",
        "I feel bad for you."
    ]
    [
        "Not that bad...",
        "But my grandma does better."
    ],
    [
        "Nice...",
        "For a start."
    ],
    [
        "Great...",
        "For a newbie."
    ],
    [
        "Excellent!",
        "What cheat did you use?"
    ]
];
var DOMrestart = document.querySelector(".game_restart");
var DOMrestartText = document.querySelector(".game_restart_text");
var DOMrestartSubText = document.querySelector(".game_restart_subText");
var DOMrestartBtn = document.querySelector(".game_restart_btn");
var DOMscore = document.querySelector(".game_score_value");
var DOMlives = document.querySelector(".game_lives_value");
var score = Number(DOMscore.textContent);
var lives = Number(DOMlives.textContent);
var Letter = function() {
    this.speed = gameConf.speed;
    this.isChecked = false;
    this.top = "-100px";
    this.createValue = function() {
        return (Math.floor(Math.random() * 26) + 10).toString(36);
    };
    this.value = this.createValue();
    this.DOM = createDOMLetter(this.value);
    this.letterFalling = setInterval(function() {
        this.top = (Number(this.top.replace("px", "")) + this.speed) + "px";
        this.DOM.style.top = this.top;
        if (Number(this.top.replace("px", "")) > document.documentElement.clientHeight) {
            this.destruct();
        }
    }.bind(this), 15);
    this.destruct = function() {
        if (this.isChecked === false) {
            lives--;
            DOMlives.textContent = lives;
        }
        clearInterval(this.letterFalling);
        this.DOM.remove();
        this.DOM = null;
        letterList = letterList.filter(function(item) {
            if (item.DOM) {
                return item.DOM;
            }
        });
    }
}
var letterList = [];
var letterListFalling = undefined;

function handleNewLetter() {
    letterList.push(new Letter);
    gameConf.speed += 0.1;
    gameConf.delay = 500 + (gameConf.delay - 500) * 0.95;
    clearInterval(letterListFalling);
    letterListFalling = setInterval(function() {
        handleNewLetter();
    }, gameConf.delay);
}

function createDOMLetter(letter) {
    var el = document.createElement("div");
    el.textContent = letter;
    el.classList.add("game_letter");
    el.style.left = (Math.random() * (document.documentElement.offsetWidth - 75)) + "px";
    DOMgame.appendChild(el);
    return el;
}

function handleValidLetter(letter, letterScore) {
    letter.isChecked = true;
    letter.DOM.style.backgroundColor = "#7B2";
    addedScore = Math.floor(letterScore / 7.5);
    score += addedScore;
    DOMscore.textContent = score;
}

function letterIsInZone(letter) {
    var letterTop       = Number(letter.top.replace("px", ""));
    var letterBot       = Number(letter.top.replace("px", "")) + 75;
    var topOverflow     = zonePos.top - letterTop;
    var botOverflow     = letterBot - zonePos.bot;
    var totalOverflow   = (topOverflow > 0 ? topOverflow : 0) + (botOverflow > 0 ? botOverflow : 0);
    var letterScore     = 75 - totalOverflow;
    if (letterScore > 0) {
        handleValidLetter(letter, letterScore);
    }
    return (letterScore > 0 ? letterScore : 0);
}

window.addEventListener("keydown", function(event) {
    var letter = event.key.toLowerCase();
    for (let i = 0; i < letterList.length; i++) {
        if (letterList[i].value === letter && !letterList[i].isChecked && letterIsInZone(letterList[i])) {
            break;
        }
    };
});

function startGame() {
    DOMlimit.style.display = "block";
    DOMlives.textContent = 5;
    lives = Number(DOMlives.textContent);
    DOMscore.textContent = 0;
    score = Number(DOMscore.textContent);
    DOMrestart.style.display = "none";
    letterList.push(new Letter);
    letterListFalling = setInterval(function() {
        handleNewLetter();
    }, gameConf.delay);
    gameOver = setInterval(() => {
        if (lives <= 0) {
            stopGame();
        }
    }, 15);
}

function stopGame() {
    clearInterval(letterListFalling);
    let textIndex = score < 700 ? Math.floor(score / 100) : 6;
    DOMrestartText.textContent = restartText[textIndex][0];
    DOMrestartSubText.textContent = restartText[textIndex][1];
    DOMlimit.style.display = "none";
    for (let i = letterList.length - 1; i >= 0; i--) {
        letterList[i].isChecked = true;
        letterList[i].destruct();
    }
    DOMrestart.style.display = "block";
    clearInterval(gameOver);
    gameConf.delay = 3000;
    gameConf.speed = 3;
}

var gameOver = undefined;

DOMrestartBtn.addEventListener("click", startGame);

startGame();
