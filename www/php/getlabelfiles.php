<?php
// contained in "ghlabelmgr.php" - $cfgfile, $imexportpath
require_once "ghlabelmgr.php";
require_once "delete-get.php";

/*
    GET getlabelfiles.php

    for command line testing :

        php-cgi getlabelfiles.php
*/
$resp = null;
$filelist = array();

// Open a directory, and read its contents
if(is_dir($imexportpath)){
    if($dh = opendir($imexportpath)){
        $idx = 0;
        while(($file = readdir($dh)) !== false){
            //echo "filename:" . $file . "<br>";
            if(strpos(strtolower($file), "json") !== false) {
                $filelist[$idx] = $file;
                $idx += 1;
            }
        }
        closedir($dh);

        if($idx > 0) {
            $list = json_encode($filelist);
            $resp = "{\"error\":false, \"ret\":$idx, \"msg\":$list}";
        } else $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"no json files found in $imexportpath\"}";
    } else $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"could not open $imexportpath\"}";
} else $resp = "{\"error\":true, \"ret\":-3, \"msg\":\"$imexportpath is not a directory\"}";

header("HTTP/1.0 200 OKie Dokie!");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>