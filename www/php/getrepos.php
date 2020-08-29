<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "delete-get.php";

/*
    GET getrepos.php

    for command line testing :

        php-cgi ./getrepos.php
*/
$resp = null;
//if(true === false) {
if(file_exists($cfgfile)) {
    $cfg = json_decode(file_get_contents($cfgfile));
    // https://docs.github.com/en/rest/reference/search
    // https://docs.github.com/en/github/searching-for-information-on-github/searching-for-repositories
    $url = "https://api.github.com/search/repositories?q=user:$cfg->owner&per_page=100";
// NOTE: subtle difference Accept 'mercy' Vs. 'v3', with 'v3' all of the
// repo's topics are missing.
//    $acc = $accept['v3'];
    $acc = $accept['mercy'];
    $resp = get($url, $acc, $cfg);
    $tmp = json_decode($resp);
    if($tmp->error === false) {
        $fname = "../data/_$cfg->owner-repos.json";
        file_put_contents($fname, json_encode($tmp->msg));
        $repodisp = array();
        $allrepos = $tmp->msg->items;
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