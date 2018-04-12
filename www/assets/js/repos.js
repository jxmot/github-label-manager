
$(function () {
    loadrepos();
});

$('#loadrepo-btn').on('click', loadrepos);

function reposelect(idx, repo) {
    consolelog('reposelect');
    consolelog('idx  = ' + idx);
    consolelog('repo = ' + repo);
    if(idx != -1) getrepoinfo(repo, showRepoInfo);
    else clearRepoInfo();
};

function showRepoInfo(repoinfo) {
    $('#full_name').val(repoinfo.msg.full_name);
    $('#full_name').data('reponame', repoinfo.msg.name);
    $('#description').val(repoinfo.msg.description);
    $('#topics').val(repoinfo.msg.topics);
    $('#open-issues').html(repoinfo.msg.open_issues);
    $('#repo-forks').html(repoinfo.msg.forks);
    repoPrivacy(repoinfo.msg.private);
    repoFork(repoinfo.msg.fork);
};

function repoPrivacy(priv) {
    if(priv) {
        $('#repo-private').removeClass('hidden');
        $('#repo-public').addClass('hidden');
    } else {
        $('#repo-public').removeClass('hidden');
        $('#repo-private').addClass('hidden');
    }
};

function repoFork(fork) {
    if(fork) {
        $('#be-a-fork').addClass('repo-forks');
        $('#is-a-fork').removeClass('hidden');
        $('#not-a-fork').addClass('hidden');
    } else {
        $('#be-a-fork').removeClass('repo-forks');
        $('#not-a-fork').removeClass('hidden');
        $('#is-a-fork').addClass('hidden');
    }
};

function loadrepos() {
    consolelog('loadrepos');
    clearRepoInfo();
    getrepos(listRepos);
};

function listRepos(repolist) {
    var idx = 0;
    if(repolist !== undefined) {
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

function clearRepoInfo() {
    $('#full_name').val('');
    $('#description').val('');
    $('#topics').val('');
    $('#open-issues').html(0);
    $('#repo-forks').html(0);
    repoPrivacy(false);
    repoFork(false);
};


//function getRepoName() {
//    return $('#full_name').data('reponame');
//};

