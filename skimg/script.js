const thing = document.querySelector('#thing span');

// Yes, these are all variables in `window` automatically, but this is more clear.
const text = document.querySelector('#text');
const font = document.querySelector('#font');
const size = document.querySelector('#size');
const spac = document.querySelector('#spac');
const line = document.querySelector('#line');
const back = document.querySelector('#back');

// Chrome isn't leaving the form values in place on refresh, so this bit ends up
// being superfluous when using it. Meanwhile, gradients look bad in Firefox. 🤷‍♀️
thing.innerHTML                      = text.value;
thing.style.fontFamily               = font.value;
thing.style.fontSize                 = `${size.value}px`;
thing.style.letterSpacing            = `${spac.value}em`;
thing.style.lineHeight               = line.value;
thing.parentElement.style.background = back.value;

text.addEventListener('input', (e) => {
    thing.innerHTML = e.target.value;
});

font.addEventListener('input', (e) => {
    thing.style.fontFamily = e.target.value;
});

size.addEventListener('input', (e) => {
    thing.style.fontSize = `${e.target.value}px`;
});

spac.addEventListener('input', (e) => {
    thing.style.letterSpacing = `${e.target.value}em`;
});

line.addEventListener('input', (e) => {
    thing.style.lineHeight = e.target.value;
});

back.addEventListener('input', (e) => {
    thing.parentElement.style.background = e.target.value;
});
