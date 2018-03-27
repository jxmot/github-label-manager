<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "delete-get.php";

/*
    GET getrepos.php

    for command line testing :

        php-cgi getrepos.php
*/
$resp = null;
if(file_exists($cfgfile)) {
    $cfg = json_decode(file_get_contents($cfgfile));
    // https://developer.github.com/v3/guides/traversing-with-pagination/
    $url = "https://api.github.com/users/$cfg->owner/repos?per_page=100";
    $acc = $accept['mercy'];
    $resp = get($url, $acc, $cfg);
    $tmp = json_decode($resp);
    if($tmp->error === false) {
        $fname = "../data/_$cfg->owner-repos.json";
        file_put_contents($fname, json_encode($tmp->msg));
        $repodisp = array();
        $allrepos = $tmp->msg;
        for($ix = 0;$ix < count($allrepos);$ix += 1) {
            $tmp = "{\"name\":\"".$allrepos[$ix]->name."\",\"full_name\":\"".$allrepos[$ix]->full_name."\"}";
            $repodisp[$ix] = json_decode($tmp);
        }
        $resp = "{\"error\":false, \"ret\":0, \"msg\":".json_encode($repodisp)."}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"$cfgfile does not exist\"}";
}
header("HTTP/1.0 200 OKie Dokie!");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>