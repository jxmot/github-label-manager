<?php
require_once "parseHeaders.php";
$cfgfile = "../data/_gitlabels.json";

/*
    DEL dellabel.php?r=repo_name&l=labelName

    for command line testing :

        php-cgi dellabel.php r=repo_name l=labelName
*/
$resp = null;
$repofile = null;

$repo = $_REQUEST["r"];
$label = $_REQUEST["l"];

if(isset($repo) && isset($label)) {
    if(file_exists($cfgfile)) {
        $cfg = json_decode(file_get_contents($cfgfile));
        $repofile = "../data/_$cfg->owner-repos.json";

        if(file_exists($repofile)) {
            $repojson = file_get_contents($repofile);
            if(isset($repojson) && (gettype($repojson) === "string")) {
                if(strpos(strtolower($repojson), strtolower($reporeq))) {




                } else {
                    $resp = "{\"error\":true, \"ret\":-5, \"msg\":\"$reporeq not found in $repofile\"}";
                }
            } else {
                $resp = "{\"error\":true, \"ret\":-4, \"msg\":\"missing ../data/_$cfg->owner-repos.json\"}";
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