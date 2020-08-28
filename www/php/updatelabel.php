<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "patch-post.php";

/*
    POST updatelabel.php
    body: {"repo":"repo name", "label":{"name":"labelName", "color":"7f7fff", "description":"test label, PATCHED"}}
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
// https://docs.github.com/en/rest/reference/issues#update-a-label
// TODO: per the docs, need to manage "name" vs "new_name". will be done
// upstream in the GUI.
        $url = "https://api.github.com/repos/$cfg->owner/$labelrepo/labels/".$body['label']['name'];
        $acc = $accept['symmetra'];
        $resp = patch($url, $acc, $cfg, $label);
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