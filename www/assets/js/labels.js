

$('#readlabels-btn').on('click', readlabels);

$('#clrlist-btn').on('click', cleartable);

$('#export-labels-btn').on('click', exportlabels);



$('#uploadlabel-btn').on('click', test_uploadlabel);

function test_uploadlabel() {
    if($('#full_name').data('reponame') != "none") {
        var data = '{"repo":"' + $('#full_name').data('reponame') + '","label":{"name": "test1234","description":"test label, ignore","color": "cfd2d4"}}';
        createlabel(data, uploadDone);
    } else consolelog('ERROR uploadlabel - no repo selected');
};

function readlabels(clrtable = true) {
    consolelog('readlabels');
    if(clrtable) cleartable()
    getlabels($('#full_name').data('reponame'), listLabels);
};

function cleartable() {
    $('#repo-labels-list-body').empty();
};


function exportlabels() {
    var table = document.getElementById('repo-labels-list-body');
    if(table.rows.length > 0) {
        var labels = [];
        var ix = 0;
        for(var ix = 0;ix < table.rows.length;ix++) {
            if(isLabelDel(JSON.parse(table.rows[ix].dataset.state)) === false) {
                var data = JSON.parse(table.rows[ix].dataset.label_rw);
                delete data.label.id;
                delete data.label.url;
                delete data.label.default;
                labels.push(data.label);
            }
        }

        if(labels.length > 0) {
            var data = {
                data: labels,
                file: `_export-labels-${timestamp()}.json`
            }
            var labelsout = JSON.stringify(data);
            exportdata(labelsout, exportdone);
        } else {
            errorDlg('Label Export', 'No labels to export!');
        }
    }
};

function isLabelDel(label) {
    if((label.state - NOMOD) >= TODEL) return true;
    else return false;
};

function timestamp() {
    var today = new Date();

    var mon = today.getMonth()+1;
    if(mon < 10) mon = '0'+mon;

    var day = today.getDate();
    if(day < 10) day = '0'+day;

    var hrs = today.getHours();
    if(hrs < 10) hrs = '0'+hrs;

    var min = today.getMinutes();
    if(min < 10) min = '0'+min;

    var sec = today.getSeconds();
    if(sec < 10) sec = '0'+sec;

    return `${today.getFullYear()}${mon}${day}-${hrs}${min}${sec}`;
};

function exportdone(resp) {
    consolelog('export done');
    if(resp.error === false) 
        timedDlg('Label Export', `Success, wrote <strong>${resp.msg.len}</strong> bytes to <strong>${resp.msg.file}</strong>`, 5000);
    else errorDlg('Label Export', `ERROR - ${resp.msg}`);
};


function listLabels(labels) {
    if(labels.error === false) {
        
        if(labels.msg.length > 1) $('#table-label-col').text(labels.msg.length + ' Labels');
        else if(labels.msg.length > 0) $('#table-label-col').text(labels.msg.length + ' Label');
        else $('#table-label-col').text('Label');

// TODO: save a separate ix for only element IDs across reads, imports, 
// etc and manage largest allowed value
        for(var ix = 0;ix < labels.msg.length;ix += 1) {
            var name = labels.msg[ix].name.replace(/ /g, '_');

            var nameix = name+'-'+ix;
            const lbldata = JSON.parse(JSON.stringify(labels.msg[ix]));

            var row = $('<tr>');
            $(row).attr('id', nameix);
            var label_now = {
                label:lbldata,
                chksum:checksum(JSON.stringify(lbldata))
            };
            $(row).attr('data-label_ro', JSON.stringify(label_now));
            $(row).attr('data-label_rw', JSON.stringify(label_now));
            $(row).attr('data-enact', '{"edit":true,"del":true,"undo":false}');
            // states: 1 = unchgd  2 = chgd  4 = del
            // multi states: 
            //      1 + 4 = unchgd and del
            //      2 + 4 = chgd and del
            // unmarking del subs 4
            $(row).attr('data-state', '{"state":1}');

            var cell = $('<td>').addClass('table-cell-center');
            var label = $('<span>').attr('id', nameix+'-color').addClass('label label-default');
            $(label).text(lbldata.name);
            $(label).attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
            $(cell).append($('<h3>').addClass('label-header').append(label));
            $(row).append(cell);

            cell = $('<td>').attr('id', nameix+'-desc').text((lbldata.description === null ? '' : lbldata.description));
            $(row).append(cell);

            cell = $('<td>').addClass('table-cell-center');
            var actions = $('<div>');
            var edit = $('<span>').addClass('fas fa-edit fa-lg label-edit-icon');
            var del = $('<span>').addClass('fas fa-trash fa-lg label-delete-icon');
            var undo = $('<span>').addClass('fas fa-undo fa-lg label-undo-icon icon-disabled');
            $(edit).attr('data-action','edit'); 
            $(del). attr('data-action','delete');
            $(undo).attr('data-action','undo');
            $(edit).attr('id', nameix+'-'+'edit');
            $(del).attr('id', nameix+'-'+'del');
            $(undo).attr('id', nameix+'-'+'undo');
            $(edit).attr('onclick','labelAction(this.id)'); 
            $(del). attr('onclick','labelAction(this.id)');
            $(undo).attr('onclick','labelAction(this.id)');
            $(actions).append(edit);
            $(actions).append(del);
            $(actions).append(undo);
            $(cell).append(actions);
            $(row).append(cell);

            cell = $('<td>').addClass('table-cell-center');
            var states = $('<div>');
            var notmod = $('<span>').addClass('fas fa-check-circle fa-lg label-notmod-icon');
            var tomod  = $('<span>').addClass('fas fa-exclamation-triangle fa-lg label-ismod-icon hidden');
            var todel  = $('<span>').addClass('fas fa-trash-alt fa-lg label-to-delete-icon hidden');
            $(notmod).attr('data-state','notmod'); 
            $(tomod).attr('data-state','tomod');
            $(todel).attr('data-state','todel');
            $(notmod).attr('id', nameix+'-'+'notmod');
            $(tomod).attr('id', nameix+'-'+'tomod');
            $(todel).attr('id', nameix+'-'+'todel');
            $(states).append(notmod);
            $(states).append(tomod);
            $(states).append(todel);
            $(cell).append(states);
            $(row).append(cell);

            $('#repo-labels-list-body').append(row);
        }
    }
};

function uploadlabel(label, callback) {
    if($('#full_name').data('reponame') != "none") {
        if(typeof label === "string") {
            var data = '{"repo":"' + $('#full_name').data('reponame') + '","label":' + label + '}';
            createlabel(data, uploadDone);
        } else consolelog('ERROR uploadlabel - label is not a string');
    } else consolelog('ERROR uploadlabel - no repo selected');
};

function uploadDone(newlabel) {
    consolelog('uploadDone - ' + JSON.stringify(newlabel.msg));
};

function renderLabel(rowid) {
    var lbldata = JSON.parse(document.getElementById(rowid).dataset.label_rw).label;
    $('#'+rowid+'-color').text(lbldata.name);
    $('#'+rowid+'-color').attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
    $('#'+rowid+'-desc').text((lbldata.description === null ? '' : lbldata.description));
};

