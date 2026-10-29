<?php

const ALLOWED_ORIGIN = 'https://chairmanbrando.github.io';

header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Content-Type: application/json');

function out($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function request($url, $body = null) {
    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_HTTPHEADER     => [
            'Accept-Language: en-US,en;q=0.9',
            'Cookie: CONSENT=YES+1',
            'Content-Type: application/json',
        ],
    ]);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $res = curl_exec($ch);
    curl_close($ch);

    return $res === false ? '' : $res;
}

$target = $_GET['url'] ?? '';

$u = parse_url($target);
if (! $u || empty($u['host'])) out(['error' => 'bad url'], 400);

$host = $u['host'];
if (! preg_match('/(^|\.)youtube\.com$|^youtu\.be$/', $host)) out(['error' => 'not youtube'], 400);

parse_str($u['query'] ?? '', $query);
$path    = $u['path'] ?? '/';
$videoId = $query['v'] ?? null;

if (! $videoId && $host === 'youtu.be') $videoId = substr($path, 1, 11);
if (! $videoId && preg_match('#^/(?:shorts|embed|live)/([\w-]{11})#', $path, $m)) $videoId = $m[1];
if ($videoId && ! preg_match('/^[\w-]{11}$/', $videoId)) $videoId = null;

// Let's use YouTube's "secret" API. If this starts failing for some reason, we'll have to use the
// real one that requires a key and has a quota. 🤷‍♀️
if ($videoId) {
    $data = json_decode(request('https://www.youtube.com/youtubei/v1/player', [
        'videoId' => $videoId,
        'context' => ['client' => ['clientName' => 'WEB', 'clientVersion' => '2.20250101.00.00']],
    ]), true);

    $id = $data['videoDetails']['channelId'] ?? '';
    if (preg_match('/^UC[\w-]{22}$/', $id)) out(['channelId' => $id]);
}

// If S hits the F, scrape the page!
$page = $videoId ? "https://www.youtube.com/watch?v=$videoId" : 'https://www.youtube.com' . $path;
$html = request($page);
$res  = [
    '#<link rel="canonical" href="https://www\.youtube\.com/channel/(UC[\w-]{22})"#',
    '/"externalId":"(UC[\w-]{22})"/',
    '/"channelId":"(UC[\w-]{22})"/',
];

foreach ($res as $re) {
    if (preg_match($re, $html, $m)) out(['channelId' => $m[1]]);
}

out(['error' => 'not found'], 404);
