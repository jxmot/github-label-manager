<?php
require_once "parseHeaders.php";
/*
    delete-get.php - functions to accomplish HTTP DELETE and
    GET requests.

    Designed specifically for the github-label-manager
*/
function del($url, $acc, $cfg)
{
    $resp = request_dg($url, 'DELETE', $acc, $cfg);
    return $resp;
}

function get($url, $acc, $cfg)
{
    $resp = request_dg($url, 'GET', $acc, $cfg);
    return $resp;
}

/*
    Code common to the HTTP DELETE and GET requests
*/
function request_dg($url, $method, $acc, $cfg)
{
    $opts = array(
        'http' => array(
            'method' => $method,
            'header' => "Accept: $acc\r\n" .
            "Authorization: $cfg->token\r\n" .
            "user-agent: custom\r\n" .
            "Content-Type: application/json; charset=utf-8\r\n" .
            "Content-Encoding: text\r\n"
        )
    );
    $context = stream_context_create($opts);
    $srvresp = file_get_contents($url, true, $context);
    $pheader = parseHeaders($http_response_header);
    $status  = ($method === 'GET' ? "200 ok" : ($method === 'DELETE' ? "204 no content" : "UNKNOWN"));
    if(strpos(strtolower($pheader[0]), $status)) {
        $resp = "{\"error\":false, \"ret\":0, \"msg\":$srvresp}";
    } else {
        $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"response = $pheader[0]\"}";
    }
    return $resp;
}
?>