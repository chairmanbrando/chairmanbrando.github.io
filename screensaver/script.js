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

function addSaver(amount) {
	if (amount > 0) {
		savers.push(saverFactory());
		savers[savers.length - 1].init();
	} else {
		if (savers.length) {
			const saver = savers.pop();
			saver.clear();
		}
	}
}

// (1) This is not, like, correct. Simple delta values aren't great to work with
// vs. using vectors with a direction and magnitude. This whole bit needs to be
// rewritten into a class. Without vectors I can't make slowing them down make
// sense, so the only option is to speed them up!
//
// (2) Fractional delta values are possible and would alleviate the need to redo
// things with vectors, but once you're off int pixels, the part that clears
// behind the savers "misses" slightly due to issues with subpixel rendering.
// The whole background would have to be cleaned instead, and I'm not sure if
// that would make performance better or worse...
function adjustSpeed(amount) {
	savers.forEach(function (saver) {
		if (amount === 0) return;

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
        x:     0,
        y:     0,
        dx:    randInt(2, 6),
        dy:    randInt(2, 6),
        img:   new Image,
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
                ctx.fillRect(this.x, this.y, this.img.width, this.img.height);
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
	ctx.fillStyle = '#222'; // Filling is allegedly faster than clearing.

	let num = parseInt(getQueryVars().n) || randInt(2, 6);

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
			addSaver(1);
			break;
		case '-':
		case '_':
			addSaver(-1);
			break;
		case 'ArrowUp':
			adjustSpeed(1);
			break;
		// case 'ArrowDown':
		// 	adjustSpeed(-1);
		// 	break;
		case 's':
			solitaireMode();
			break;
	}
});

onDomReady(init);
