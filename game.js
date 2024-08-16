const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const fontFileInput = document.getElementById('file-upload');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');

const brickBreakerButton = document.getElementById("btnBrickBreaker");
const spaceInvadersButton = document.getElementById("btnSpaceInvader");
const tetrisButton = document.getElementById("btnTetris");
const startButton = document.getElementById('startButton');

let currentFontSize = 20;
let font;
let isPaused = true;
let selectedGame = null;

fontSizeInput.addEventListener('input', function() {
    currentFontSize = this.value;
    fontSizeValue.textContent = `${currentFontSize}px`;
    if (font) {
        preview();
    }
});

brickBreakerButton.addEventListener("click", () => {
    selectedGame = "Brick Breaker";
});

tetrisButton.addEventListener("click", () => {
    selectedGame = "Tetris";
});

spaceInvadersButton.addEventListener("click", () => {
    selectedGame = "Space Invader";
});

startButton.addEventListener('click', function() {
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
            startTetris();
            break;
        case "Space Invader":
            startSpaceInvader();
            break;
    }
}
