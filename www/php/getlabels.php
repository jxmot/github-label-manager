<?php
require_once "parseHeaders.php";
$cfgfile = "../data/_gitlabels.json";

/*
    getlabels.php?r=repo_name
*/
$repo = $_REQUEST["r"];

if(isset($repo)) {
    if(file_exists($cfgfile)) {
        $cfg = json_decode(file_get_contents($cfgfile));
    
        $accept = "application/vnd.github.symmetra-preview+json";
        $url = "https://api.github.com/repos/$cfg->owner/$repo/labels";
    
        $opts = array(
            'http' => array(
                'method' => 'GET',
                'header' => "Accept: $accept\r\n" .
                "Authorization: $cfg->token\r\n" .
                "user-agent: custom\r\n" .
                "Content-Type: application/json; charset=utf-8\r\n" .
                "Content-Encoding: text\r\n"
            )
        );
    
        $context = stream_context_create($opts);
        $resp = file_get_contents($url, true, $context);
        $pheader = parseHeaders($http_response_header);
    
        if(strpos(strtolower($pheader[0]), "200 ok")) {
            $fname = "../data/_$cfg->owner-$repo-labels.json";
            file_put_contents($fname, $resp);
            echo "{\"error\":false, \"ret\":0, \"msg\":\"$fname\"}";
        } else {
            echo "{\"error\":true, \"ret\":-2, \"msg\":\"response = $pheader[0]\"}";
        }
    } else {
        echo "{\"error\":true, \"ret\":-1, \"msg\":\"$cfgfile does not exist\"}";
    }
} else {
    echo "{\"error\":true, \"ret\":-3, \"msg\":\"argument missing, expecting - '?r=repo_name'\"}";
}
?>