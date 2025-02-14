let $classes = null;

function showAllClasses() {
    $classes.forEach(c => c.removeAttribute('hidden'));
}

// This *can* be done with CSS only by stacking up three sibling selectors in
// `h2:has()`, but the Scion presents an issue with its one Ascendancy. If some-
// thing like `h2:all()` existed then this would be more straightforward. Might
// as well do it via JS, then, I suppose.
function hideAllClasses() {
    $classes.forEach(c => c.setAttribute('hidden', true));
}

function searchText(text, search) {
    text   = text.toLowerCase();
    search = search.toLowerCase();

    return text.indexOf(search);
}

function showRelevantClasses(search) {
    hideAllClasses();

    let shown = 0;

    $classes.forEach((c) => {
        const $text = c.querySelector('div[hidden]');
        if (! $text) return;

        if (searchText($text.textContent, search) > -1) {
            c.removeAttribute('hidden');
            ++shown; // @@ implement
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const $filter = document.querySelector('#filter');

    $filter.parentElement.addEventListener('submit', e => e.preventDefault());

    $filter.addEventListener('input', (e) => {
        if (e.target.value === '') {
            showAllClasses();
        } else {
            showRelevantClasses(e.target.value);
        }
    });

    $classes = document.querySelectorAll('.ascendancy');

    document.querySelectorAll('a').forEach((a) => {
        if (a.hostname !== window.location.hostname) {
            a.target = '_blank';
        }
    });
});
