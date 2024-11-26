const onDomEvent = document.addEventListener;
const onWinEvent = window.addEventListener;

function onDomReady(fn) {
	(document.readyState === 'loading') ? onDomEvent('DOMContentLoaded', fn) : fn();
}

// Yes, `URLSearchParams` exists but I forgot.
function getQueryVars() {
	var split = window.location.search.substring(1).split('&'),
		vars  = {};

	split.forEach(function (i) {
		var parts = i.split('=');

		vars[parts[0]] = parts[1];
	});

	return vars;
}

function randInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function isFullscreen() {
	return (window.innerWidth === screen.width && window.innerHeight === screen.height);
};

// @@ Going slower is kinda busted. May need to separate speed and velocity.
function adjustSpeed(amount) {
	savers.forEach(function (saver) {
		(saver.dx > 0) ? saver.dx += amount : saver.dx -= amount;
		(saver.dy > 0) ? saver.dy += amount : saver.dy -= amount;
	});
}

function solitaireMode() {
	savers.forEach(function (saver) {
		saver.trail = !saver.trail;
	});
}

function saverFactory() {
    return {
        x: 0,
        y: 0,
        dx: randInt(2, 6),
        dy: randInt(2, 6),
        img: new Image,
        trail: false,

        init: function () {
            this.img.src    = "flop.png";
            this.img.width  = randInt(80, 160);
            this.img.height = this.img.width;
            this.x          = randInt(0, canvas.width - this.img.width);
            this.y          = randInt(0, canvas.height - this.img.height);
        },

        draw: function () {
            ctx.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
        },

        clear: function () {
            if (! this.trail) {
                ctx.clearRect(this.x, this.y, this.img.width, this.img.height);
            }
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

// ---------------------------------------------------------------------------------------------- //

let savers = [];
let canvas = null;
let ctx    = null;
let bGo    = false;
let raf    = null;

function init() {
    canvas = document.getElementById('canvas')
    ctx    = canvas.getContext('2d');

    canvas.width  = page.offsetWidth;
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

	(isFullscreen())
		? document.body.classList.remove('windowed')
		: document.body.classList.add('windowed');
});

onDomEvent('keyup', function (e) {
	switch (e.key) {
		case 'Escape' :
			(bGo) ? raf = window.requestAnimationFrame(draw) : window.cancelAnimationFrame(raf);
			bGo = !bGo;
			break;
		case '+':
		case '=':
			adjustSpeed(1);
			break;
		case '-':
		case '_':
			adjustSpeed(-1);
			break;
		case 's':
			solitaireMode();
			break;
	}
});

onDomReady(init);
