<?php
require_once "parseHeaders.php";
$cfgfile = "../data/_gitlabels.json";
$resp = null;
if(file_exists($cfgfile)) {
    $cfg = json_decode(file_get_contents($cfgfile));

    // https://developer.github.com/v3/guides/traversing-with-pagination/
    $url = "https://api.github.com/users/$cfg->owner/repos?per_page=100";
    $accept = "application/vnd.github.mercy-preview+json";
    
    $opts = array(
        'http' => array(
            'method' => 'GET',
            'header' => "Accept: $accept\r\n" .
            "user-agent: custom\r\n" .
            "Content-Type: application/json; charset=utf-8\r\n" .
            "Content-Encoding: text\r\n"
        )
    );
    
    $context = stream_context_create($opts);
    $resp = file_get_contents($url, true, $context);
    $pheader = parseHeaders($http_response_header);

    if(strpos(strtolower($pheader[0]), "200 ok")) {
        $fname = "../data/_$cfg->owner-repos.json";
        file_put_contents($fname, $resp);

        $repodisp = array();
        $allrepos = json_decode($resp);
        for($ix = 0;$ix < count($allrepos);$ix += 1) {
            $tmp = "{\"name\":\"".$allrepos[$ix]->name."\",\"full_name\":\"".$allrepos[$ix]->full_name."\"}";
            $repodisp[$ix] = json_decode($tmp);
        }
        $resp = "{\"error\":false, \"ret\":0, \"msg\":". stripslashes(json_encode($repodisp)) ."}";
    } else {
        $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"response = $pheader[0]\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"$cfgfile does not exist\"}";
}
header("HTTP/1.0 200 OKie Dokie!");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>