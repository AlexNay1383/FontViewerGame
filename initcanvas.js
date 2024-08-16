function initializeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const aspectRatio = 16 / 9; // Common aspect ratio for games

    let canvasWidth = window.innerWidth * 0.8;
    let canvasHeight = canvasWidth / aspectRatio;

    if (canvasHeight > window.innerHeight * 0.7) {
        canvasHeight = window.innerHeight * 0.7;
        canvasWidth = canvasHeight * aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

window.onload = initializeCanvas;

window.onresize = initializeCanvas;