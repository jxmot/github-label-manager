


function createlabel(label, callback) {
    // create the new label in the repository
    _post('crelabel', label, callback);
};

// NOTE: extra label data such as ID, URL, and default are
// NOT passed along by this point.
function exportdata(data, callback) {
    // {"file":"/path/to/filename.ext", "data":"[{...},{...},...]"}
    _post('exportdata', data, callback);
};

function getlabels(repo, callback) {
    _get('getlabels', `?r=${repo}`, callback);
};

function getrepos(callback) {
    _get('getrepos', undefined, callback);
};

function getrepoinfo(repo, callback) {
    _get('getrepoinfo', `?r=${repo}`, callback);
};

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
