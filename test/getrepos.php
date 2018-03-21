<?php

function parseHeaders($headers)
{
    $head = array();
    foreach($headers as $k => $v)
    {
        $t = explode(':', $v, 2);
        if(isset($t[1])) {
            $head[trim($t[0])] = trim($t[1]);
        }
        else
        {
            $head[] = $v;
            if( preg_match("#HTTP/[0-9\.]+\s+([0-9]+)#",$v,$out)) {
                $head['reponse_code'] = intval($out[1]);
            }
        }
    }
    return $head;
}

if(file_exists("_gitlabels.json")) {
    $cfg = json_decode(file_get_contents("_gitlabels.json"));

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
    echo "code = $pheader[0] \n";
    if(isset($pheader['Link'])) {
        echo "Link = " . $pheader['Link'] . "\n";
    }
    
    $fname = "./_$cfg->owner-repos.json";
    file_put_contents($fname, $resp);
    
    echo "\n---\n";
    $repos = json_decode($resp);
    $cnt = 0;
    foreach($repos as $repo) {
        $cnt += 1;
        if($repo->open_issues > 0) {
            echo $repo->full_name . "\n";
            echo $repo->open_issues . "\n";
            echo "...................\n";
        }
    }
    echo "cnt = $cnt\n---\n";
} else {
    $pheader = parseHeaders($http_response_header);
    echo "status - $pheader[0]\n";
    echo "owner  - $cfg->owner\n";
}

?>