<?php
// contained in "ghlabelmgr.php" - $cfgfile, $accept
require_once "ghlabelmgr.php";
require_once "patch-post.php";

/*
    POST exportlabels.php - typically used for exporting label data
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
$outfile = $body['file'];
// label associative array -> JSON
$data = json_encode($body['data']);
$datalen = strlen($data)

if(($datalen > 0) && ($datalen < 20480)) {
    file_put_contents("../data/$outfile", $data);
    $resp = "{\"error\":false, \"ret\":0, \"msg\":$data}";
} else $resp = "{\"error\":true, \"ret\":-1, \"msg\":\"data length error, datalen = $datalen\"}";

header("HTTP/1.0 200 OK");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>