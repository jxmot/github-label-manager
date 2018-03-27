<?php

function parseHeaders($headers)
{
    $head = array();
    foreach($headers as $k => $v)
    {
        $t = explode(':', $v, 2);
        if(isset($t[1]))
            $head[trim($t[0])] = trim($t[1]);
        else
        {
            $head[] = $v;
            if( preg_match("#HTTP/[0-9\.]+\s+([0-9]+)#",$v,$out))
                $head['reponse_code'] = intval($out[1]);
        }
    }
    return $head;
}

$accept = "application/vnd.github.symmetra-preview+json";

if(file_exists("_gitlabels.json")) {
    $cfg = json_decode(file_get_contents("_gitlabels.json"));

    $opts = array(
        'http' => array(
            'method' => 'GET',
            'header' => "Accept: $accept\r\n" .
            "Authorization: $cfg->token\r\n" .
            "user-agent: custom\r\n" .
            "Content-Type: application/json; charset=utf-8\r\n" .
            "Content-Encoding: text\r\n"
        )
    );

    $url = "https://api.github.com/repos/$cfg->owner/$cfg->repo/labels";

    $context = stream_context_create($opts);
    $resp = file_get_contents($url, true, $context);
    //var_dump(parseHeaders($http_response_header));
    
    $fname = "./_$cfg->owner-$cfg->repo-labels.json";
    file_put_contents($fname, $resp);
    
    echo "\n---\n";
    $labels = json_decode($resp);
    foreach($labels as $label) {
        echo "$label->name\n";
        echo "$label->color\n";
        echo "...................\n";
    }
} else {
    $pheader = parseHeaders($http_response_header);
    echo "status - $pheader[0]\n";
    echo "owner  - $cfg->owner\n";
    echo "repo   - $cfg->repo\n";
    echo "token  - $cfg->token\n";
}
echo "\n---\n";

?>