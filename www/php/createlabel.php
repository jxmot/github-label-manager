<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "patch-post.php";

/*
    POST createlabel.php
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
        $acc = $accept['symmetra'];
        $resp = post($url, $acc, $cfg, $label);
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