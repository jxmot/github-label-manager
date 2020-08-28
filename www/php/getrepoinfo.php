<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "parseHeaders.php";

/*
    GET getrepoinfo.php?r=repo_name

    for command line testing :

        php-cgi ./getrepoinfo.php r=repo_name
*/
$reporeq = $_REQUEST["r"];
$repofile = null;
$resp = null;
$repojson = null;
$foundrepo = null;

if(isset($reporeq)) {
    if(file_exists($cfgfile)) {
        $cfg = json_decode(file_get_contents($cfgfile));
        $repofile = "../data/_$cfg->owner-repos.json";

        if(file_exists($repofile)) {
            $repojson = file_get_contents($repofile);
            if(isset($repojson) && (gettype($repojson) === "string")) {
                if(strpos(strtolower($repojson), strtolower($reporeq))) {
                    // found the repo name in the JSON string, now find
                    // the repo object by converting the string to an array
                    // and then walk through the array looking for a match.
                    $foundrepo = shell_exec("php-cgi ./findrepo.php r=".$reporeq." f=".$repofile);
                    $realrepo = substr($foundrepo, strpos($foundrepo, "{"));
                    $thisrepo = json_decode($realrepo);

                    if(($thisrepo->error === false) && ($thisrepo->ret >= 0)) {
                        $justrepo = $thisrepo->msg;
                        $fork = ($justrepo->fork ? 'true' : 'false');
                        $private = ($justrepo->private ? 'true' : 'false');
                        $topics = "";
                        if(isset($justrepo->topics)) {
                            $topics .= implode(", ", $justrepo->topics);
                        }
                        $tmp = "{\"name\":\"$justrepo->name\",\"full_name\":\"$justrepo->full_name\",\"description\":\"$justrepo->description\",\"topics\":\"$topics\",\"fork\":$fork,\"forks\":$justrepo->forks,\"private\":$private,\"open_issues\":$justrepo->open_issues}";
                        $resp = "{\"error\":false, \"ret\":0, \"msg\":$tmp}";
                    } else {
                        $resp = "{\"error\":true, \"ret\":$thisrepo->ret, \"msg\":\"findrepo $reporeq - $thisrepo->msg\"}";
                    }
                } else {
                    $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"$reporeq not found in $repofile\"}";
                }
            } else {
                $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"missing ../data/_$cfg->owner-repos.json\"}";
            }
        } else {
            $resp = "{\"error\":true, \"ret\":-4, \"msg\":\"missing ../data/_$cfg->owner-repos.json\"}";
        }
    } else {
        $resp = "{\"error\":true, \"ret\":-5, \"msg\":\"$cfgfile does not exist\"}";
    }
} else {
    $resp = "{\"error\":true, \"ret\":-6, \"msg\":\"argument missing, expecting - '?r=repo_name'\"}";
}
header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;

?>