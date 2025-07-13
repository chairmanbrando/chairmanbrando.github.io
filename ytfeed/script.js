document.addEventListener('DOMContentLoaded', (e) => {
    const playlist  = 'https://www.youtube.com/playlist?list=';
    const channelid = new RegExp(/(https:\/\/www\.youtube\.com\/channel\/)?(UC[A-Za-z0-9_\-].+)/);

    const $form  = document.querySelector('#form');
    const $input = document.querySelector('#channel');
    const $feed  = document.querySelector('#output a');

    $form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cid = $input.value.match(channelid).pop();
        if (! cid) return;

        const link = playlist + cid.replace('UC', 'UULF');

        $feed.textContent = link;
        $feed.setAttribute('href', link);
    });
});
