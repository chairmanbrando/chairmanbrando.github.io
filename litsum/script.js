const endpoint = 'https://chairmanbrando.wpenginepowered.com/apis/index.php';

document.addEventListener('DOMContentLoaded', (e) => {
    const text = document.querySelector('#text');

    const prom = fetch(
        endpoint + '/litsum/pride/paragraphs/5?' + Date.now(), {
        cache: 'no-store'
    });

    prom.then((resp) => resp.json()).then((data) => {
        data = Array.from(data); // Sometimes it ain't one; might be a cache thing.
        data.forEach((p) => text.insertAdjacentHTML('beforeend', `<p>${p}</p>`));
    })
});
