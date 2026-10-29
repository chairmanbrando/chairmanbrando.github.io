const LOOKUP_URL = 'https://chairmanbrando.org/apis/yt/channel.php';
const UC_RE = /^UC[\w-]{22}$/;

function parseInput(raw) {
    const s = raw.trim();

    if (UC_RE.test(s)) return {
        channelId: s
    };

    if (/^@[\w.-]+$/.test(s)) return {
        handle: s
    };

    let url;

    try {
        url = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
    } catch {
        return null;
    }

    const host = url.hostname.replace(/^(www|m|music)\./, '');

    if (host === 'youtu.be') {
        const id = url.pathname.slice(1, 12);

        return /^[\w-]{11}$/.test(id) ? {
            videoId: id
        } : null;
    }

    if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null;

    const v = url.searchParams.get('v');

    if (v && /^[\w-]{11}$/.test(v)) return {
        videoId: v
    };

    const p = url.pathname;
    let m;

    if ((m = p.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/))) return {
        videoId: m[1]
    };

    if ((m = p.match(/^\/channel\/(UC[\w-]{22})/))) return {
        channelId: m[1]
    };

    if ((m = p.match(/^\/(@[\w.-]+)/))) return {
        handle: m[1]
    };

    if ((m = p.match(/^\/(?:c|user)\/[^/]+/))) return {
        pageUrl: 'https://www.youtube.com' + m[0]
    };

    const list = url.searchParams.get('list');

    if (list && /^UU(LF|SH|LV)[\w-]{22}$/.test(list)) return {
        channelId: 'UC' + list.slice(4)
    };

    if (list && /^UU[\w-]{22}$/.test(list)) return {
        channelId: 'UC' + list.slice(2)
    };

    return null;
}

async function resolve(parsed) {
    if (parsed.channelId) return parsed.channelId;

    const pageUrl = parsed.videoId ? 'https://www.youtube.com/watch?v=' + parsed.videoId :
                    parsed.handle ? 'https://www.youtube.com/' + parsed.handle :
                    parsed.pageUrl;

    let data;

    try {
        const r = await fetch(LOOKUP_URL + '?url=' + encodeURIComponent(pageUrl), {
            signal: AbortSignal.timeout(5000)
        });

        data = await r.json();
    } catch {
        throw new Error("Couldn't reach the lookup service. Try again in a bit.");
    }

    if (! data.channelId || ! UC_RE.test(data.channelId)) {
        throw new Error("Couldn't find a channel for that link" + (data.error ? ' (' + data.error + ').' : '.'));
    }

    return data.channelId;
}

document.addEventListener('DOMContentLoaded', (e) => {
    const playlist = 'https://www.youtube.com/playlist?list=';
    const pl = (prefix, uc) => playlist + prefix + uc.slice(2);

    const $form = document.querySelector('#form');
    const $input = document.querySelector('#channel');
    const $go = document.querySelector('#go');
    const $status = document.querySelector('#status');
    const $output = document.querySelector('#output');
    const $feed = document.querySelector('#output a');
    const $copy = document.querySelector('#copy');

    const setStatus = (msg, err = false) => {
        $status.textContent = msg;
        $status.classList.toggle('err', err);
    };

    $form.addEventListener('submit', async (e) => {
        e.preventDefault();
        $output.hidden = true;

        const parsed = parseInput($input.value);

        if (! parsed) return setStatus("That doesn't look like a YouTube video or channel link.", true);

        $go.disabled = true;
        setStatus(parsed.channelId ? '' : 'Looking up channel...');

        try {
            const uc = await resolve(parsed);
            const link = pl('UULF', uc);

            $feed.textContent = link;
            $feed.setAttribute('href', link);
            document.querySelector('#all').href = pl('UU', uc);
            document.querySelector('#shorts').href = pl('UUSH', uc);
            document.querySelector('#live').href = pl('UULV', uc);

            setStatus('Channel ID: ' + uc);
            $output.hidden = false;
        } catch (err) {
            setStatus(err.message, true);
        } finally {
            $go.disabled = false;
        }
    });

    $copy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText($feed.href);
            $copy.textContent = 'Copied';
        } catch {
            $copy.textContent = 'Copy failed';
        }

        setTimeout(() => ($copy.textContent = 'Copy'), 1500);
    });

    const pre = new URLSearchParams(location.search).get('url');

    if (pre) {
        $input.value = pre;
        $form.requestSubmit();
    }
});
