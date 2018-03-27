

$('#loadrepo-btn').on('click', loadrepos);

function reposelect(idx, repo) {
    consolelog('reposelect');
    consolelog('idx  = ' + idx);
    consolelog('repo = ' + repo);
    if(idx != -1) getrepoinfo(repo, showRepoInfo);
};

function showRepoInfo(repoinfo) {
//    $('#output').html(JSON.stringify(repoinfo));
    $('#full_name').val(repoinfo.msg.full_name);
    $('#full_name').data('reponame', repoinfo.msg.name);

    // {"error":false,"ret":0,"msg":
    //      {"name":"Basic-Portfolio","full_name":"jxmot/Basic-Portfolio","fork":false,"forks":0,"private":false,"open_issues":0}}
    $('#description').val(repoinfo.msg.description);
};

function loadrepos() {
    consolelog('loadrepos');
    getrepos(listRepos);
};

function listRepos(repolist) {
    var idx = 0;
    if(repolist !== undefined) {
        //$('#output').html(JSON.stringify(repolist));
        $('#repo-select').html('<option value="-1" selected>Please Select a Repository...</option>');
        // create & append the options
        var slist = document.getElementById('repo-select');
        for(var ix = 0; ix < repolist.msg.length; ix++) {
            var option = document.createElement('option');
            option.value = ix;
            option.text  = repolist.msg[ix].name;
            slist.appendChild(option);
        }
    }
};

function getRepoName() {
    return $('#full_name').data('reponame');
};

