const $in   = document.querySelector('#input');
const $inc  = document.querySelector('#input + .count');
const $out  = document.querySelector('#output');
const $outc = document.querySelector('#output + .count');

const charz = {
    find: ['©', '®', '™', '‘', '’', '“', '”', '•', '–', '—', '…', '·', "\r\n", "\r", '′', '″'],
    replace: ['&copy;', '&reg;', '&trade;', '\'', '\'', '"', '"', '&bull;', '-', '--', '...', '&middot;', "\n", "\n", '\'', '"']
}

// These are impossible to truly align due to lacking font support. 🙃
const ligs = {
    find: ['Ꜳ', 'ꜳ', 'Æ', 'æ', 'Ꜵ', 'ꜵ', 'Ꜷ', 'ꜷ', 'Ꜹ', 'ꜹ', 'Ꜻ', 'ꜻ', 'Ꜽ', 'ꜽ', '🙰', 'ﬀ', 'ﬃ', 'ﬄ', 'ﬁ', 'ﬂ', 'Ƕ', 'ƕ', '℔', 'Ỻ', 'ỻ', 'Œ', 'œ', 'Ꝏ', 'ꝏ', 'ꭢ', 'ẞ', 'ß', 'ﬆ', 'ﬅ', 'Ꜩ', 'ꜩ', 'ᵫ', 'ꭣ', 'Ꝡ', 'ꝡ', 'Ꟗ ꟗ', 'ꟕ', 'ꟓ'],
    replace: ['AA', 'aa', 'AE', 'ae', 'AO', 'ao', 'AU', 'au', 'AV', 'av', 'AV', 'av', 'AY', 'ay', 'et', 'f‌f', 'f‌f‌i', 'f‌f‌l', 'f‌i', 'f‌l', 'Hv', 'hv', 'lb', 'lL', 'll', 'OE', 'oe', 'OO', 'oo', 'ɔe', 'ſs', 'ſz', 'st', 'ſt', 'TZ', 'tz', 'ue', 'uo', 'VY', 'vy', 'ſs', 'ƿƿ', 'þþ',]
};

const domReady = function (fn) {
    (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', fn) : fn();
}

// To the clipboard we go!
const copy = function (elem) {
    try {
        elem.select();
        navigator.clipboard.writeText(elem.value);
    } catch (e) {
        console.log(e);
    }
}

// Swiped: https://stackoverflow.com/a/37949642
const replaceArray = function (string, finds, replaces) {
    let i, regex = [], map = {};

    for (i = 0; i < finds.length; i++) {
        regex.push(finds[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'));
        map[finds[i]] = replaces[i];
    }

    regex = regex.join('|');
    string = string.replace(new RegExp(regex, 'g'), (matched) => map[matched]);

    return string;
}

// Let's get this dorodango rolling.
domReady(function () {
    $in.addEventListener('click', (e) => {
        e.target.select();
    });

    $in.addEventListener('input', (e) => {
        let fixme = e.target.value;

        fixme = fixme.replaceAll(/  +/g, ' ');
        fixme = replaceArray(fixme, charz.find, charz.replace);
        fixme = replaceArray(fixme, ligs.find, ligs.replace);

        if (fixme.indexOf('%') > -1) {
            try {
                fixme = decodeURIComponent(fixme);
            } catch (e) {
                console.log(e);
            }
        }

        $out.value = fixme;
    });

    $in.addEventListener('input', (e) => {
        $inc.textContent = e.target.value.length;
        $out.dispatchEvent(new Event('input', { bubbles: true }));
    });

    $out.addEventListener('click', (e) => {
        copy(e.target);
    });

    $out.addEventListener('input', (e)=> {
        $outc.textContent = e.target.value.length;
    });
});
