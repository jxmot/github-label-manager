<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "delete-get.php";

/*
    GET getlabels.php?r=repo_name

    for command line testing :

        php-cgi ./getlabels.php r=repo_name
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
                $acc = $accept['symmetra'];
                $resp = get($url, $acc, $cfg);
                $tmp = json_decode($resp);
                if($tmp->error === false) {
                    $fname = "../data/repolabels/_$cfg->owner-$reporeq-labels.json";
                    file_put_contents($fname, json_encode($tmp->msg));
                } else {
                    $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"error returned by git for $reporeq\"}";
                }
            } else {
                $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"$reporeq not found in ../data/_$cfg->owner-repos.json\"}";
            }
        } else {
            $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"missing ../data/_$cfg->owner-repos.json\"}";
        }
    } else {
        $resp = "{\"error\":true, \"ret\":-4, \"msg\":\"$cfgfile does not exist\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-5, \"msg\":\"argument missing, expecting - '?r=repo_name'\"}";
}
header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>