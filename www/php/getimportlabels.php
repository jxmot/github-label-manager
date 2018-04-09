<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept, $imexportpath
require_once "ghlabelmgr.php";

/*
    GET getimportlabels.php?f=labelfilename

    for command line testing :

        php-cgi getimportlabels.php f=label_file_name
*/
$labelfile = $_REQUEST["f"];

if(isset($labelfile)) {
    if(strpos($labelfile, '/') === false) {
        $infile = "$imexportpath/$labelfile";
        if(file_exists($infile)) {
            $labels = file_get_contents($infile);
            $resp = "{\"error\":false, \"ret\":0, \"msg\":$labels}";
        } else $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"$infile does not exist\"}";
    } else $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"bad file name - $labelfile\"}";
} else $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"argument missing, expecting - '?f=label_file_name'\"}";

header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
//echo stripslashes($resp);
echo $resp;
exit;


?>