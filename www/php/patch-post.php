<?php
require_once "parseHeaders.php";
/*
    patch-post.php - functions to accomplish HTTP PATCH and
    POST requests.

    Designed specifically for the github-label-manager
*/
function patch($url, $acc, $cfg, $payload)
{
    $resp = request_pp($url, 'PATCH', $acc, $cfg, $payload);
    return $resp;
}

function post($url, $acc, $cfg, $payload)
{
    $resp = request_pp($url, 'POST', $acc, $cfg, $payload);
    return $resp;
}

/*
    Code common to the HTTP PATCH and POST requests
*/
function request_pp($url, $method, $acc, $cfg, $payload)
{
    $opts = array(
        'http' => array(
            'method' => $method,
            'header' => "Accept: $acc\r\n" .
            ($cfg === null ? "" : "Authorization: $cfg->token\r\n") .
            "user-agent: custom\r\n" .
            "Content-Type: application/json; charset=utf-8\r\n" .
            "Content-Encoding: text\r\n",
            'content' => $payload
        )
    );
    $context = stream_context_create($opts);
    $srvresp = file_get_contents($url, false, $context);
    $pheader = parseHeaders($http_response_header);
    $status  = ($method === 'PATCH' ? "200 ok" : ($method === 'POST' ? "201 created" : "UNKNOWN"));
    if(strpos(strtolower($pheader[0]), $status)) {
        $resp = "{\"error\":false, \"ret\":0, \"msg\":$srvresp}";
    } else {
        $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"response = $pheader[0]\"}";
    }
    return $resp;
}
?>