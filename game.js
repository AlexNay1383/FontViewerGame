const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const fontFileInput = document.getElementById('file-upload');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');

const brickBreakerButton = document.getElementById("btnBrickBreaker");
const spaceInvadersButton = document.getElementById("btnSpaceInvader");
const tetrisButton = document.getElementById("btnTetris");
const startButton = document.getElementById('startButton');
const messageDiv = document.getElementById("msg");

let currentFontSize = 20;
let font;
let isPaused = true;
let selectedGame = null;

function msg(str)
{
    messageDiv.ATTRIBUTE_NODE.textContent = str;
}

fontSizeInput.addEventListener('input', function() {
    currentFontSize = this.value;
    fontSizeValue.textContent = `${currentFontSize}px`;
});

brickBreakerButton.addEventListener("click", () => {
    selectedGame = "Brick Breaker";
    isPaused = true;
    startButton.disabled = false;
});

tetrisButton.addEventListener("click", () => {
    selectedGame = "Tetris";
    isPaused = true;
    startButton.disabled = false;
});

spaceInvadersButton.addEventListener("click", () => {
    selectedGame = "Space Invader";
    isPaused = true;
    startButton.disabled = false;
});

startButton.addEventListener('click', function() {
    startButton.disabled = true;
    if (font) {
        isPaused = false;
        startGame(font, currentFontSize);
    }
});

fontFileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const fontData = await file.arrayBuffer();
        font = new FontFace('customFont', fontData);

        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            startButton.disabled = false;  // Enable the start button after loading the font
        }).catch(function(error) {
            console.error('Error loading font:', error);
        });
    }
});

function startGame(font, fontsize) {
    switch(selectedGame)
    {
        case "Brick Breaker":
            startBrickBreaker(font, fontsize);
            break;
        case "Tetris":
            startTetris(font, fontsize);
            break;
        case "Space Invader":
            startSpaceInvader(font, fontsize);
            break;
        case null:
            alert("Please select a game");
    }
}
