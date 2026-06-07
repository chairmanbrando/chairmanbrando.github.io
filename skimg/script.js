const thing = document.querySelector('#thing span');
const form  = document.querySelector('#form')

const text = form.elements.text;
const font = form.elements.font;
const size = form.elements.size;
const colo = form.elements.colo;
const spac = form.elements.spac;
const line = form.elements.line;
const shad = form.elements.shad;
const back = form.elements.back;

// Chromium isn't leaving the form values in place on refresh, perhaps because
// the form element is missing some attribute it needs to save the data, so this
// bit ends up being superfluous when using it. Ohwellio.
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

colo.addEventListener('input', (e) => {
    thing.style.color = e.target.value;
});

spac.addEventListener('input', (e) => {
    thing.style.letterSpacing = `${e.target.value}em`;
});

line.addEventListener('input', (e) => {
    thing.style.lineHeight = e.target.value;
});

shad.addEventListener('input', (e) => {
    thing.style.textShadow = e.target.value;
});

back.addEventListener('input', (e) => {
    thing.parentElement.style.background = e.target.value;
});

form.addEventListener('change', (e) => {
    if (e.target.name === 'talign') {
        thing.style.textAlign = e.target.value;
    }
});
