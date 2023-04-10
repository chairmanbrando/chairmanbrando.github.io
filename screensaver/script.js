const onDomEvent = document.addEventListener;
const onWinEvent = window.addEventListener;

const onDomReady = function (fn) {
    (document.readyState === 'loading') ? onDomEvent('DOMContentLoaded', fn) : fn();
}

// Check and see and change the body class if so.
const checkForFullscreen = function () {
    if (window.innerHeight === screen.height) return true;
};

function randInt(max) {
    return Math.floor(Math.random() * max);
}

let canvas = null;
let ctx    = null;
let img    = new Image;
let bGo    = false;
let af     = null;

let saver = {
    x:  0,
    y:  0,
    dx: 2,
    dy: 2,
    img: new Image,
    init: function () {
        this.img.src    = "flop.png";
        this.img.width  = 120;
        this.img.height = 120;
        this.x          = randInt(canvas.width - this.img.width);
        this.y          = randInt(canvas.height - this.img.height);
    },
    draw: function () {
        ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
    },
    clear: function () {
        ctx.clearRect(this.x, this.y, this.img.width, this.img.height);
    }
};

let savers = [];

function init() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');

    canvas.width = page.offsetWidth;
    canvas.height = page.offsetHeight;

    saver.init();
    saver.draw();

    af = window.requestAnimationFrame(draw);
}

function draw() {
    saver.clear();

    if (saver.x < 0) {
        saver.dx *= -1;
    }

    if (saver.y < 0) {
        saver.dy *= -1;
    }

    if (saver.x > (canvas.width - saver.img.width)) {
        saver.dx *= -1;
    }

    if (saver.y > (canvas.height - saver.img.height)) {
        saver.dy *= -1;
    }

    saver.x += saver.dx;
    saver.y += saver.dy;

    saver.draw();

    af = window.requestAnimationFrame(draw);
}

onWinEvent('resize', function (e) {
    canvas.width  = page.offsetWidth;
    canvas.height = page.offsetHeight;
});

onDomEvent('keyup', function (e) {
    if (e.key === 'Escape') {
        (bGo) ? af = window.requestAnimationFrame(draw) : window.cancelAnimationFrame(af);
        bGo = ! bGo;
    }
});

onDomReady(init);
