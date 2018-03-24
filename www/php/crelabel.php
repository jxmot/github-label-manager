<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "parseHeaders.php";

/*
    POST crelabel.php
    body: {"repo":"repo name", "label":{"name":"labelName", "color":"7f7fff", "description":"test label, CREATED"}}
*/
$resp = null;
// get the BODY from the POST
$postbody = file_get_contents('php://input');
// JSON -> associative array
$body = json_decode($postbody, true);
// get the repo name
$labelrepo = $body['repo'];
// label associative array -> JSON
$label = json_encode($body['label']);

if((isset($labelrepo)) && (isset($label))) {
    if(file_exists($cfgfile)) {
        $cfg = json_decode(file_get_contents($cfgfile));
        $url = "https://api.github.com/repos/$cfg->owner/$labelrepo/labels";
        $opts = array(
            'http' => array(
                'method' => 'POST',
                'header' => "Accept: ".$accept['symmetra']."\r\n" .
                "Authorization: $cfg->token\r\n" .
                "user-agent: custom\r\n" .
                "Content-Type: application/json; charset=utf-8\r\n" .
                "Content-Encoding: text\r\n",
                'content' => $label
            )
        );
        $context = stream_context_create($opts);
        $newlabel = file_get_contents($url, true, $context);
        $pheader = parseHeaders($http_response_header);
        if(strpos(strtolower($pheader[0]), "201 created")) {
            $resp = "{\"error\":false, \"ret\":0, \"msg\":$newlabel}";
        } else {
            $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"response = $pheader[0]\"}";
        }
    } else {
        $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"$cfgfile does not exist\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"missing repo or label\"}";
}
header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>