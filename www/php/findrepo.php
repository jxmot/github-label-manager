<?php
/*
    getrepoinfo.php?r=repo_name&f=../data/_owner-repos.json

    for command line testing :

        php-cgi findrepo.php r=repo_name f=../data/_owner-repos.json
*/
$reporeq  = $_REQUEST["r"];
$repofile = $_REQUEST["f"];
$allrepos = null;
$resp = null;
$repojson = null;

if(isset($reporeq) && isset($repofile)) {
    if(file_exists($repofile)) {
        $allrepos = json_decode(file_get_contents($repofile));
        $repolen = count($allrepos);
        for($ix = 0; $ix < $repolen; $ix += 1) {
            if(strtolower($allrepos[$ix]->name) === strtolower($reporeq)) {
                $repojson = json_encode($allrepos[$ix]);
                $resp = "{\"error\":false, \"ret\":0, \"msg\":$repojson}";
                break;
            }
        }
    } else {
        $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"$repofile does not exist\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"missing one or more argument(s)\"}";
}
header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>