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
function fillImport(resp) {

};

