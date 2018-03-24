<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "parseHeaders.php";

/*
    GET getlabels.php?r=repo_name

    for command line testing :

        php-cgi getlabels.php r=repo_name
*/
$reporeq = $_REQUEST["r"];
$resp = null;
$repojson = null;

if(isset($reporeq)) {
    if(file_exists($cfgfile)) {
        $cfg = json_decode(file_get_contents($cfgfile));
        $repojson = file_get_contents("../data/_$cfg->owner-repos.json");
        if(isset($repojson)) {
            if(strpos(strtolower($repojson), strtolower($reporeq))) {
                $url = "https://api.github.com/repos/$cfg->owner/$reporeq/labels";
                $opts = array(
                    'http' => array(
                        'method' => 'GET',
                        'header' => "Accept: ".$accept['symmetra']."\r\n" .
                        "Authorization: $cfg->token\r\n" .
                        "user-agent: custom\r\n" .
                        "Content-Type: application/json; charset=utf-8\r\n" .
                        "Content-Encoding: text\r\n"
                    )
                );
                $context = stream_context_create($opts);
                $labels = file_get_contents($url, true, $context);
                $pheader = parseHeaders($http_response_header);
                if(strpos(strtolower($pheader[0]), "200 ok")) {
                    $fname = "../data/_$cfg->owner-$reporeq-labels.json";
                    file_put_contents($fname, $labels);
                    $resp = "{\"error\":false, \"ret\":0, \"msg\":$labels}";
                } else {
                    $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"response = $pheader[0]\"}";
                }
            } else {
                $resp = "{\"error\":true, \"ret\":-5, \"msg\":\"$reporeq not found in ../data/_$cfg->owner-repos.json\"}";
            }
        } else {
            $resp = "{\"error\":true, \"ret\":-4, \"msg\":\"missing ../data/_$cfg->owner-repos.json\"}";
        }
    } else {
        $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"$cfgfile does not exist\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"argument missing, expecting - '?r=repo_name'\"}";
}
header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>