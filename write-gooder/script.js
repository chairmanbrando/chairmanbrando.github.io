const input       = document.getElementById('input');
const output      = document.getElementById('output');
const issues      = document.getElementById('issues');
const gradeLevel  = document.getElementById('gradeLevel');
const readability = document.getElementById('readability');

input.addEventListener('scroll', () => syncScroll(input, output));
output.addEventListener('scroll', () => syncScroll(output, input));

input.addEventListener('input', analyze);

// The main jaunt.
function analyze() {
    const text        = input.value;
    const suggestions = writeGood(text);
    const customSuggs = checkCustomWords(text);
    const allSuggs    = [...suggestions, ...customSuggs];

    output.innerHTML      = createHighlights(text, allSuggs);
    readability.innerText = calculateARI(text);
    gradeLevel.innerText  = calculateFleschKincaid(text);
}

function createHighlights(text, suggestions) {
    if (! suggestions.length) return escapeHTML(text);

    suggestions.sort((a, b) => a.index - b.index);

    // First, drop the suggestions into a list below.
    suggestions.forEach((sugg) => {
        issues.insertAdjacentHTML('beforeend', `<li>${escapeHTML(sugg.reason)}</li>`);
    });

    // Second, literally mark the suggestions in the text.
    let html   = '';
    let cursor = 0;
    let flagged;

    suggestions.forEach((sugg) => {
        if (sugg.index < cursor) return;

        html   += escapeHTML(text.slice(cursor, sugg.index));
        flagged = text.slice(sugg.index, sugg.index + sugg.offset);
        html   += `<mark title='${escapeHTML(sugg.reason)}'>${escapeHTML(flagged)}</mark>`;
        cursor  = sugg.index + sugg.offset;
    });

    return html + escapeHTML(text.slice(cursor));
}

// Automated Readability Index
function calculateARI(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const sents = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const chars = text.replace(/[^a-zA-Z0-9]/g, '').length;

    if (words === 0 || sents === 0) return 0;

    const score = 4.71 * (chars / words) + 0.5 * (words / sents) - 21.43;
    return Math.max(1, Math.round(score));
}

// Flesch–Kincaid Grade Level
function calculateFleschKincaid(text) {
    const wordsList = text.trim().split(/\s+/).filter(Boolean);
    const words     = wordsList.length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    if (words === 0 || sentences === 0) return 0;

    const syllables = wordsList.reduce((acc, word) => acc + countSyllables(word), 0);
    const grade     = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;

    return Math.max(1, Math.round(grade));
}

// Add words you use too often here. @todo Create an input for them.
const weakSauce = ['basically', 'even', 'of course', 'though'];

function checkCustomWords(text) {
    if (! text.trim()) return suggestions;

    const suggestions = [];
    const pattern     = new RegExp(`\\b(${weakSauce.join('|')})\\b`, 'gi');
    let match;

    while ((match = pattern.exec(text)) !== null) {
        suggestions.push({
            index: match.index,
            offset: match[0].length,
            reason: `"${match[0]}" is a custom word flagged as weaksauce`
        });
    }

    return suggestions;
}

function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|e)$/, '');
    word = word.replace(/^y/, '');

    const matches = word.match(/[aeiouy]{1,2}/g);

    return (matches) ? matches.length : 1;
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let syncing = false;

function syncScroll(source, target) {
    if (syncing) return;
    syncing = true;
    target.scrollTop = source.scrollTop;
    syncing = false;
}

analyze();
