<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "delete-get.php";

/*
    DEL dellabel.php?r=repo_name&l=labelName

    for command line testing :

        php-cgi dellabel.php r=repo_name l=labelName
*/
$resp = null;
$repofile = null;

$repo = $_REQUEST["r"];
$label = $_REQUEST["l"];

// check for query (if used)
if(isset($repo) && isset($label)) {
    // always verify the passed repo name against the JSON list
    if(file_exists($cfgfile)) {
        $cfg = json_decode(file_get_contents($cfgfile));
        // each configured owner (see the file referenced in 
        // ghlabelmgr.php for owner)
        $repofile = "../data/_$cfg->owner-repos.json";
        // a previous download of the owner's repositories is 
        // required
        if(file_exists($repofile)) {
            $repojson = file_get_contents($repofile);
            // check the passed repo name against the owner's 
            // repo list
            if(strpos(strtolower($repojson), strtolower($repo))) {
                $url = "https://api.github.com/repos/$cfg->owner/$repo/labels/$label";
                $acc = $accept['symmetra'];
                $resp = del($url, $acc, $cfg);
            } else {
                $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"$repo not found in $repofile\"}";
            }
        } else {
            $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"missing ../data/_$cfg->owner-repos.json\"}";
        }
    } else {
        $resp = "{\"error\":true, \"ret\":-4, \"msg\":\"$cfgfile does not exist\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-5, \"msg\":\"argument missing, expecting - '?r=repo_name&l=labelName'\"}";
}
// done!
// To Do : make status code relevant to return state
header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>