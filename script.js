const DOMgame = document.querySelector(".game");
const gameConf = {
    delay: 2000,
    speed: 3
}
const zonePos = {
    top: document.querySelector(".game_limit").getBoundingClientRect().top,
    bot: document.querySelector(".game_limit").getBoundingClientRect().bottom
}

var score = 0;
var DOMscore = document.querySelector(".game_score_value");
var Letter = function() {
    this.checked = false;
    this.top = "-100px";
    this.createValue = function() {
        return (Math.floor(Math.random() * 26) + 10).toString(36);
    };
    this.value = this.createValue();
    this.DOM = createDOMLetter(this.value);
    this.letterFalling = setInterval(function() {
        this.top = (Number(this.top.replace("px", "")) + gameConf.speed) + "px";
        this.DOM.style.top = this.top;
        if (Number(this.top.replace("px", "")) > document.documentElement.clientHeight) {
            this.destruct();
        }
    }.bind(this), 15);
    this.destruct = function() {
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
var letterListFalling = setInterval(function() {
    letterList.push(new Letter);
}, gameConf.delay);

function createDOMLetter(letter) {
    var el = document.createElement("div");
    el.textContent = letter;
    el.classList.add("game_letter");
    el.style.left = (Math.random() * (document.documentElement.offsetWidth - 75)) + "px";
    DOMgame.appendChild(el);
    return el;
}

function handleValidLetter(letter, letterScore) {
    letter.checked = true;
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
    var letter = event.key;
    for (let i = 0; i < letterList.length; i++) {
        if (letterList[i].value === letter && !letterList[i].checked && letterIsInZone(letterList[i])) {
            console.log("same letter:", i);
            break;
        }
    };
});
