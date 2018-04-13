/*
    GUI - Repository API 

    Manage all GUI elements related to labels.

    (c) 2017 Jim Motyl - https://github.com/jxmot/github-label-manager/LICENSE.md
*/

// read the labels for the selected repository and display them
$('#readlabels-btn').on('click', readlabels);
// clear the table of labels
$('#clrlist-btn').on('click', cleartable);
// export the currently displayed labels, except those marked for
// deletion to a JSON formatted file.
$('#export-labels-btn').on('click', exportlabels);
// import labels from a selected file and add them to the table
$('#label-import-btn').on('click', importfiles);
// TEST - uploads a canned label to the selected repository
$('#uploadlabel-btn').on('click', test_uploadlabel);

function test_uploadlabel() {
    if($('#full_name').data('reponame') != "none") {
        var data = '{"repo":"' + $('#full_name').data('reponame') + '","label":{"name": "test1234","description":"test label, ignore","color": "cfd2d4"}}';
        createlabel(data, uploadDone);
    } else consolelog('ERROR uploadlabel - no repo selected');
};

/*
    Get labels for a currently selected repository and 
    display them via a callback.
*/
function readlabels(clrtable = true) {
    consolelog('readlabels');
    if(clrtable) cleartable();
    getlabels($('#full_name').data('reponame'), listLabels);
};

/*
    Clear the label table
*/
function cleartable() {
    $('#repo-labels-list-body').empty();
    $('#table-label-col').text('Label');
};


/*
    List the labels in the table
*/
function listLabels(labels) {
    if(labels.error === false) {
        _listLabels(labels.msg);
    }
};


/*
    Append the labels to the table
*/
function _listLabels(labels, labelimport = false) {
    // Change the column heading depending on the quantity
    // of labels in the table
    if(labels.length > 1) $('#table-label-col').text(labels.length + ' Labels');
    else if(labels.length > 0) $('#table-label-col').text(labels.length + ' Label');
    else $('#table-label-col').text('Label');

// TODO: save a separate ix for only element IDs across reads, imports, 
// etc and manage largest allowed value

    for(var ix = 0;ix < labels.length;ix += 1) {
        // replace spaces in the name with an underscore
        var name = labels[ix].name.replace(/ /g, '_');
        // append the current index to the name
        var nameix = name+'-'+ix;
        // copy the label data, break any references
        const lbldata = JSON.parse(JSON.stringify(labels[ix]));
        // needed for correct determination if a label has been edited
        if(lbldata.description === '') lbldata.description = null;
        // build the table's row element from the label data
        var row = $('<tr>');
        $(row).attr('id', nameix);
        // save the import state -
        // true = label is imported, false = label is from a repo
        $(row).attr('data-import', labelimport);
        var label_now = {
            label:lbldata,
            chksum:checksum(JSON.stringify(lbldata))
        };
        // save a read-only and an editable copy of the label 
        // data within the row element
        $(row).attr('data-label_ro', JSON.stringify(label_now));
        $(row).attr('data-label_rw', JSON.stringify(label_now));
        // set the state of the action icons for this label
        $(row).attr('data-enact', '{"edit":true,"del":true,"undo":false}');
        // states: 1 = unmodified  2 = modified  4 = del
        // multi states: 
        //      1 + 4 = unmodified and marked for deletion
        //      2 + 4 = modified and marked for deletion
        // 
        // unmarking a deleted label will subtract 4 from the state
        $(row).attr('data-state', '{"state":1}');
        // build the label button cell
        var cell = $('<td>').addClass('table-cell-center');
        var label = $('<span>').attr('id', nameix+'-color').addClass('label label-default');
        $(label).text(lbldata.name);
        $(label).attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
        $(cell).append($('<h3>').addClass('label-header').append(label));
        $(row).append(cell);
        // build the label description cell
        cell = $('<td>').attr('id', nameix+'-desc').text((lbldata.description === null ? '' : lbldata.description));
        $(row).append(cell);
        // build the action icon cell
        cell = $('<td>').addClass('table-cell-center');
        var actions = $('<div>');
        var edit = $('<span>').addClass('fas fa-edit fa-lg label-edit-icon');
        var del = $('<span>').addClass('fas fa-trash fa-lg label-delete-icon');
        var undo = $('<span>').addClass('fas fa-undo fa-lg label-undo-icon icon-disabled');
        $(edit).attr('data-action','edit'); 
        $(del).attr('data-action','delete');
        $(undo).attr('data-action','undo');
        $(edit).attr('id', nameix+'-'+'edit');
        $(del).attr('id', nameix+'-'+'del');
        $(undo).attr('id', nameix+'-'+'undo');
        $(edit).attr('onclick','labelAction(this.id)'); 
        $(del).attr('onclick','labelAction(this.id)');
        $(undo).attr('onclick','labelAction(this.id)');
        $(actions).append(edit);
        $(actions).append(del);
        $(actions).append(undo);
        $(cell).append(actions);
        $(row).append(cell);
        // build the label state cell
        cell = $('<td>').addClass('table-cell-center');
        var states = $('<div>');
        var notmod = $('<span>');
        if(labelimport === true) {
            $(notmod).addClass('fas fa-info-circle fa-lg label-notmod-icon');
        } else {
            $(notmod).addClass('fas fa-check-circle fa-lg label-notmod-icon');
        }
        var tomod = $('<span>').addClass('fas fa-exclamation-triangle fa-lg label-ismod-icon hidden');
        var todel = $('<span>').addClass('hidden');
        if(labelimport === true) {
            $(todel).addClass('fa-stack');
            var i1 = $('<i>').addClass('fas fa-trash fa-lg fa-stack-1x label-to-delete-icon');
            var i2 = $('<i>').addClass('fas fa-info fa-xs fa-stack-1x');
            $(todel).append(i1);
            $(todel).append(i2);
        } else {
            $(todel).addClass('fas fa-trash-alt fa-lg label-to-delete-icon');
        }
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
        // all cells complete, append this row to the table
        $('#repo-labels-list-body').append(row);
    }
};

/*
    Export the table of labels to a JSON formatted file, except
    labels that are marked for deletion.
*/
function exportlabels() {
    var table = document.getElementById('repo-labels-list-body');
    if(table.rows.length > 0) {
        var labels = [];
        var ix = 0;
        for(var ix = 0;ix < table.rows.length;ix++) {
            if(isLabelDel(JSON.parse(table.rows[ix].dataset.state)) === false) {
                var data = JSON.parse(table.rows[ix].dataset.label_rw);
                // remove the parts that aren't necessary when the label 
                // will be uploaded to GitHub
                delete data.label.id;
                delete data.label.url;
                delete data.label.default;
                // break any possible references and push 
                // the label onto the export list
                labels.push(JSON.parse(JSON.stringify(data.label)));
            }
        }
        // are there labels to export?
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

/*
    Return the label's "marked for deletion" state,
    true = is marked, false = not marked
*/
function isLabelDel(label) {
    if((label.state - NOMOD) >= TODEL) return true;
    else return false;
};

/*
    Label export is complete, announce result
*/
function exportdone(resp) {
    consolelog('export done');
    if(resp.error === false) 
        timedDlg('Label Export', `Success, wrote <strong>${resp.msg.len}</strong> bytes to <strong>${resp.msg.file}</strong>`, 5000);
    else errorDlg('Label Export', `ERROR - ${resp.msg}`);
};

/*
    Get a list of label files and display them
*/
function importfiles() {
    getlabelfiles(filesdone);
}

/*
    Display a list of label files
*/
function filesdone(resp) {
    consolelog('label files done');
    if(resp.error === false) {
        fillImport(resp);
        $('#labelImportModal').modal('show');
    } else errorDlg('Label Files', `ERROR - ${resp.msg}`);
};

/*

*/
function uploadlabel(label, callback) {
    if($('#full_name').data('reponame') != "none") {
        if(typeof label === "string") {
            var data = '{"repo":"' + $('#full_name').data('reponame') + '","label":' + label + '}';
            createlabel(data, uploadDone);
        } else consolelog('ERROR uploadlabel - label is not a string');
    } else consolelog('ERROR uploadlabel - no repo selected');
};

/*

*/
function uploadDone(newlabel) {
    consolelog('uploadDone - ' + JSON.stringify(newlabel.msg));
};

/*

*/
function renderLabel(rowid) {
    var lbldata = JSON.parse(document.getElementById(rowid).dataset.label_rw).label;
    $('#'+rowid+'-color').text(lbldata.name);
    $('#'+rowid+'-color').attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
    $('#'+rowid+'-desc').text((lbldata.description === null ? '' : lbldata.description));
};

