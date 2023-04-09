const onDomEvent = document.addEventListener;
const onWinEvent = window.addEventListener;

const onDomReady = function (fn) {
    (document.readyState === 'loading') ? onDomEvent('DOMContentLoaded', fn) : fn();
}

// Check and see and change the body class if so.
const checkForFullscreen = function () {
    if (window.innerHeight === screen.height) return true;
};

let canvas = null;
let ctx    = null;
let img    = new Image;
let bGo    = true;

function init() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');

    canvas.width = page.offsetWidth;
    canvas.height = page.offsetHeight;

    img.src    = "flop.png";
    img.width  = 120;
    img.height = 120;
    img.X      = Math.floor(Math.random() * (canvas.width - img.width));
    img.Y      = Math.floor(Math.random() * (canvas.height - img.height));
    img.dX     = 2;
    img.dY     = 2;

    ctx.drawImage(img, img.X, img.Y, img.width, img.height);

    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(img.X, img.Y, img.width, img.height);

    if (img.X < 0) {
        img.dX *= -1;
    }

    if (img.Y < 0) {
        img.dY *= -1;
    }

    if (img.X > (canvas.width - img.width)) {
        img.dX *= -1;
    }

    if (img.Y > (canvas.height - img.height)) {
        img.dY *= -1;
    }

    img.X += img.dX;
    img.Y += img.dY;

    ctx.drawImage(img, img.X, img.Y, img.width, img.height);

    if (bGo) {
        window.requestAnimationFrame(draw);
    }
}

onWinEvent('resize', function (e) {
    canvas.width  = page.offsetWidth;
    canvas.height = page.offsetHeight;
});

onDomEvent('keyup', function (e) {
    if (e.key === 'Escape') {
        if (! bGo) {
            window.requestAnimationFrame(draw);
        }

        bGo = ! bGo;
    }
});

onDomReady(init);
