let $classes = null;

function showAllClasses() {
    $classes.forEach(c => c.style.display = 'block');
}

function hideAllClasses() {
    $classes.forEach(c => c.style.display = 'none');
}

function hideEmptyHeaders() {
    // @@ implement
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
            c.style.display = 'block';
            ++shown; // @@ implement
        }
    });

    hideEmptyHeaders();
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
