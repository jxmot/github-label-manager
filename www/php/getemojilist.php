<?php
require_once "delete-get.php";

/*
    GET getemojilist.php

    for command line testing :

        php-cgi getemojilist.php
*/
$resp = null;

$url = "https://api.github.com/emojis";
$acc = "application/json";

$resp = get($url, $acc, null);

$tmp = json_decode($resp);
if($tmp->error === false) {
    $fname = "../data/emoji-list.json";
    file_put_contents($fname, stripslashes(json_encode($tmp->msg)));
}

header("HTTP/1.0 200 OKie Dokie!");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: text");
echo $resp;
exit;
?>