const onDomEvent = document.addEventListener;
const onWinEvent = window.addEventListener;

function onDomReady(fn) {
    (document.readyState === 'loading') ? onDomEvent('DOMContentLoaded', fn) : fn();
}

function checkForFullscreen() {
    return (window.innerWidth === screen.width && window.innerHeight === screen.height);
};

function getQueryVars() {
    var split = window.location.search.substring(1).split('&'),
        vars  = {};

    split.forEach(function (i) {
        var parts = i.split('=');

        vars[parts[0]] = parts[1];
    });

    return vars;
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function saverFactory() {
    return {
        x:  0,
        y:  0,
        dx: randInt(4) + 2,
        dy: randInt(4) + 2,
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
        },
        checkBounds: function () {
            if (this.x < 0 || this.x > (canvas.width - this.img.width)) {
                this.dx *= -1;
            }
            
            if (this.y < 0 || this.y > (canvas.height - this.img.height)) {
                this.dy *= -1;
            }
        },
        update: function () {
            this.x += this.dx;
            this.y += this.dy;
        }
    };
}

let savers = [];
let canvas = null;
let ctx    = null;
let bGo    = false;
let raf    = null;

function init() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');

    canvas.width = page.offsetWidth;
    canvas.height = page.offsetHeight;

    let num = parseInt(getQueryVars().n) || 1;

    for (let i = 0; i < num; i++) {
        savers.push(saverFactory());
    }

    savers.forEach(function (saver) {
        saver.init();
        saver.draw();
    });

    raf = window.requestAnimationFrame(draw);
}

function draw() {
    savers.forEach(function (saver) {
        saver.clear();
        saver.checkBounds();
        saver.update();
        saver.draw();
    });

    raf = window.requestAnimationFrame(draw);
}

onWinEvent('resize', function (e) {
    canvas.width  = page.offsetWidth;
    canvas.height = page.offsetHeight;

    (checkForFullscreen())
        ? document.body.classList.remove('windowed')
        : document.body.classList.add('windowed');
});

onDomEvent('keyup', function (e) {
    if (e.key === 'Escape') {
        (bGo) ? raf = window.requestAnimationFrame(draw) : window.cancelAnimationFrame(raf);
        bGo = ! bGo;
    }
});

onDomReady(init);
