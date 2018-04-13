/*
    GUI - Repository API 

    Manage all GUI elements related to repository 
    information and selection.

    (c) 2017 Jim Motyl - https://github.com/jxmot/github-label-manager/LICENSE.md
*/

// Retrieve the list of repositories and populate the
// selection list.
$(function () {
    loadrepos();
});

// same as above
$('#loadrepo-btn').on('click', loadrepos);

/*
    Handle a repository choice in the selection list.
*/
function reposelect(idx, repo) {
    consolelog('reposelect');
    consolelog('idx  = ' + idx);
    consolelog('repo = ' + repo);
    if(idx != -1) getrepoinfo(repo, showRepoInfo);
    else clearRepoInfo();
};

/*
    Display a selected repository's information.
*/
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

/*
    Display the privacy state.
*/
function repoPrivacy(priv) {
    if(priv) {
        $('#repo-private').removeClass('hidden');
        $('#repo-public').addClass('hidden');
    } else {
        $('#repo-public').removeClass('hidden');
        $('#repo-private').addClass('hidden');
    }
};

/*
    Display the fork state.
*/
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

/*
    Clear the displayed repository info and retrieve
    a fresh list of repositories. Then populate the 
    selection list.
*/
function loadrepos() {
    consolelog('loadrepos');
    clearRepoInfo();
    getrepos(listRepos);
};

/*
    Populate the selection list with a list of 
    repository names.
*/
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

/*
    Clear all repository specific info from the GUI
*/
function clearRepoInfo() {
    $('#full_name').val('');
    $('#full_name').data('reponame', 'none');
    $('#description').val('');
    $('#topics').val('');
    $('#open-issues').html(0);
    $('#repo-forks').html(0);
    repoPrivacy(false);
    repoFork(false);
};

