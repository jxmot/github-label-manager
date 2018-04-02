<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept, $maxoutsize
require_once "ghlabelmgr.php";

/*
    POST exportdata.php - typically used for exporting label data
    but can be used for any string

    body: {"file":"filename.ext", "data":"[{...},{...},...]"}

    the "data" array contains 1 or more of - 
    {"name":"labelName", "color":"7f7fff", "description":"test label, CREATED"}

    OR some other string data.
*/
$resp = null;

// get the BODY from the POST
$postbody = file_get_contents('php://input');
// JSON -> associative array
$body = json_decode($postbody, true);
// get the file path+name+extension
$file = $body['file'];
// label associative array -> JSON
$data = json_encode($body['data']);
$datalen = strlen($data);

if(strpos($file, '/') === false) {
    $outfile = "../data/labels/$file";
    if(($datalen > 0) && ($datalen < $maxoutsize)) {
        file_put_contents($outfile, $data);
        $resp = "{\"error\":false, \"ret\":0, \"msg\":{\"file\":\"$outfile\",\"len\":$datalen}}";
    } else $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"data length error, datalen = $datalen\"}";
} else $resp = "{\"error\":true, \"ret\":-2, \"msg\":\"bad file name - $outfile\"}";

header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>