/*
    GitHub Label Manager API 

    Wrapper for PHP endpoints.

    (c) 2017 Jim Motyl - https://github.com/jxmot/github-label-manager
*/

/*
    
*/
function createlabel(label, callback) {
    // create the new label in the repository
    _post('crelabel', label, callback);
};

/*
    Export data (typically a JSON formatted string) to a 
    client-side specified file name.

    NOTE: Do not specify a path, it is managed server-side.
*/
function exportdata(data, callback) {
    // NOTE: extra label data such as ID, URL, and default are
    // NOT passed along by this point.
    // {"file":"/path/to/filename.ext", "data":"[{...},{...},...]"}
    _post('exportdata', data, callback);
};

/*
    Retrieve a list of previously exported label files. 
*/
function importlist(callback) {
    _get('getlabelfiles', undefined, callback);
};

/*
    Retrieve the labels from a specified file.
*/
function getimportlabels(file, callback) {
    _get('getimportlabels', `?f=${file}`, callback);
};

/*
    Retrieve the labels from a specified repository.
*/
function getlabels(repo, callback) {
    _get('getlabels', `?r=${repo}`, callback);
};

/*
    Retrieve a list of repositories for a specified GitHub user.
*/
function getrepos(callback) {
    _get('getrepos', undefined, callback);
};

/*
    Retrieve information for a specific repository. 
*/
function getrepoinfo(repo, callback) {
    _get('getrepoinfo', `?r=${repo}`, callback);
};

/*
    Send a GET request with arguments(optional) and
    invoke a callback function when completed.
*/
function _get(func, args, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var _resp = {};
            var resp = this.responseText;
            resp = resp.replace(/[\n\r]/g, '');
            consolelog('_get - ' + resp);
            if(resp.match(/^\{/g)) 
                _resp = JSON.parse(resp);
            else {
                _resp.error = true;
                // https://httpstatuses.com/
                _resp.ret   = 500;
                _resp.msg   = resp;
            }
            callback(_resp);
        }
    };

    if((args === undefined) || (args === '')) {
        xmlhttp.open('GET', `./php/${func}.php`, true);
    } else {
        xmlhttp.open('GET', `./php/${func}.php${args}`, true);
    }
    xmlhttp.send();
};

/*
    Send a POST request with a body(optional) and
    invoke a callback function when completed.
*/
function _post(func, body, callback) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var _resp = {};
            var resp = this.responseText;
            resp = resp.replace(/[\n\r]/g, '');
            consolelog('_post - ' + resp);
            if(resp.match(/^\{/g)) 
                _resp = JSON.parse(resp);
            else {
                _resp.error = true;
                // https://httpstatuses.com/
                _resp.ret   = 500;
                _resp.msg   = resp;
            }
            callback(_resp);
        }
    };

    xmlhttp.open('POST', `./php/${func}.php`, true);

    if((body === undefined) || (body === '')) {
        xmlhttp.send();
    } else {
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(body);
    }
};
