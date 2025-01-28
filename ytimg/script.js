const endpoint = 'https://i3.ytimg.com/vi/%id%/%res%%num%.jpg';
const reses    = ['maxres', 'sd', 'hq', 'mq', ''];

// This is simple enough, but is it *too* simple?
function looksLikeYouTubeThing(url) {
    const matches = url.match(/([A-Za-z0-9_-]{11})/);

    if (Array.isArray(matches) && matches.length > 1) {
        return matches[1];
    }

    return false;
}

function getAllThumbnails(videoid) {
    const urls = [];

    reses.forEach((res) => {
        let imgurl = endpoint;

        imgurl = imgurl.replace('%id%', videoid);
        imgurl = imgurl.replace('%res%', res);

        // "default" will match one of these if a custom thumbnail isn't used.
        ['default', '1', '2', '3'].forEach((i) => {
            let imgx = imgurl.replace('%num%', i);
            urls.push(imgx);
        });
    });

    return urls;
}

// @todo? More details like resolution and file size.
function outputAllThumbnails(urls, template) {
    urls.forEach((url) => {
        const clone = template.content.cloneNode(true);
        let   name  = url.split('/').pop();

        const $name = clone.querySelector('.name');
        const $link = clone.querySelector('.link');
        const $img  = clone.querySelector('.image');

        $name.textContent = name;
        $link.setAttribute('href', url);
        $link.setAttribute('download', name);
        $img.setAttribute('src', url);
        $img.setAttribute('alt', name);

        document.querySelector('#output').appendChild(clone);
    });
}

document.addEventListener('DOMContentLoaded', (e) => {
    const $form  = document.querySelector('#form');
    const $input = document.querySelector('#video');

    $form.addEventListener('submit', (e) => {
        e.preventDefault();

        const videoid  = looksLikeYouTubeThing($input.value);
        const template = document.querySelector('#template');
        let   urls;

        document.querySelector('#output').textContent = '';

        // @todo Check for a 404 on the YouTube URL before proceeding.
        if (videoid) {
            urls = getAllThumbnails(videoid);
        }

        if (urls) {
            outputAllThumbnails(urls, template);
        }
    });
});
