/* ************************************************************************ */
/*

    Label Import Modal - Select a label file and import them into the 
    primary list.

    2018 (c) Jim Motyl

    modal-import.js

*/
// flags checked when the modal form is hidden
var     importLabels = false;
var     importCancel = false;

// modal button events
$('#import-labels-btn').on('click', confirmImport);
$('#import-cancel-btn').on('click', cancelImport);

// file list events
function fileListClick(fileid) {
    var file = document.getElementById(fileid).dataset.file;
    $('#import-file-name').val(file);
    getimportlabels(file, showImportLabels);
};

/*
    The button assigned to the "confirm" functionality is handled here.
*/
function confirmImport() {
    importLabels = true;
    importCancel = false;
    $('#labelImportModal').modal('hide');
};

/*
    The button assigned to the "cancel" functionality is handled here.
*/
function cancelImport() {
    importLabels = false;
    importCancel = true;
    $('#labelImportModal').modal('hide');
};

/*
    On the "modal about hide" event determine if the action was either
    "save" or "cancel". 
*/
$('#labelImportModal').on('hide.bs.modal', function (event) {
    // Typical modal behavior is to dismiss the modal if a click occurs
    // outside of it. This check of the validation flags and the call to 
    // event.preventDefault() will keep it from closing.
    if((importLabels === false) && (importCancel === false)) {
        event.preventDefault();
        // let's shake the label edit modal so that it gets noticed
        // by the user.
        startShake('#labelImportModal');
    } else {
        if((importLabels === true) && (importCancel === false)) {
        } else {
            if((importLabels === false) && (importCancel === true)) {
                consolelog('import cancelled');
            }
        }
    }
});

/*
    On the "modal about show" event clear the "save" 
    and "cancel" flags. 
*/
$('#labelImportModal').on('show.bs.modal', function (event) {
    importLabels = false;
    importCancel = false;
});

/*
    Pre-fill the label-file list before showing the modal.
*/
function fillImport(files) {
    $('#filelist').empty();
    $('#import-labels-list-body').empty();
    $('#import-file-name').val('None Selected');

    if((files.error === false) && (files.ret > 0)) {
        for(var ix = 0;ix < files.msg.length;ix += 1) {
            var file = $('<li>');
            $(file).attr('id', 'file-'+ix);
            $(file).addClass('import-file-item');
            $(file).attr('onclick','fileListClick(this.id)'); 
            $(file).attr('data-file', files.msg[ix]);

            var text = $('<strong>').text(files.msg[ix]);
            $(file).append(text);

            $('#filelist').append(file);
        }
    }
};

function showImportLabels(labels) {
    $('#import-labels-list-body').empty();

    if((labels.error === false) && (labels.ret >= 0)) {
        if(labels.msg.length > 1) $('#import-label-col').text(labels.msg.length + ' Labels');
        else if(labels.msg.length > 0) $('#import-label-col').text(labels.msg.length + ' Label');
        else $('#import-label-col').text('Label');

        for(var ix = 0;ix < labels.msg.length;ix += 1) {
            var row = $('<tr>');
            const lbldata = JSON.parse(JSON.stringify(labels.msg[ix]));
            var cell = $('<td>').addClass('table-cell-center');
            var label = $('<span>').addClass('label label-default');
            $(label).text(lbldata.name);
            $(label).attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
            $(cell).append($('<h3>').addClass('label-header').append(label));
            $(row).append(cell);
            cell = $('<td>').text((lbldata.description === null ? '' : lbldata.description));
            $(row).append(cell);
            $('#import-labels-list-body').append(row);
        }
    }
};



