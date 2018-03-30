/* ************************************************************************ */
/*

    Label Edit Modal - Edit a single label at a time.

    2018 (c) Jim Motyl

    modal-edit.js

*/
// flags checked when the modal form is hidden
var     labelSave = false;
var     labelCanc = false;

// modal button events
$('#save-edit-btn').on('click', saveLabel);
$('#cancel-edit-btn').on('click', cancLabel);

/*
    The button assigned to the "save" functionality is handled here.
*/
function saveLabel() {
    labelSave = true;
    labelCanc = false;
    $('#labelEditModal').modal('hide');
};

/*
    The button assigned to the "cancel" functionality is handled here.
*/
function cancLabel() {
    labelSave = false;
    labelCanc = true;
    $('#labelEditModal').modal('hide');
};

/*
    On the "modal about hide" event determine if the action was either
    "save" or "cancel". 
*/
$('#labelEditModal').on('hide.bs.modal', function (event) {
    // Typical modal behavior is to dismiss the modal if a click occurs
    // outside of it. This check of the validation flags and the call to 
    // event.preventDefault() will keep it from closing.
    if((labelSave === false) && (labelCanc === false)) {
        // mute console.log('#labelEditModal .on(hide.bs.modal) - missing validation, preventing close');
        event.preventDefault();
        // let's shake the label edit modal so that it gets noticed
        // by the user.
        startShake('#labelEditModal');
    } else {
        if((labelSave === true) && (labelCanc === false)) {
        } else {
            if((labelSave === false) && (labelCanc === true)) {
            }
        }
    }
});

/*
    On the "modal about show" event clear the "save" 
    and "cancel" flags. 
*/
$('#labelEditModal').on('show.bs.modal', function (event) {
    // mute console.log('#labelEditModal .on(show.bs.modal) - The modal is about to be shown.');
    labelSave = false;
    labelCanc = false;
});

/*
    When the page is loaded go ahead and set up the color
    picker.
*/
$(function () {
    $('#coloredit').colorpicker({
        color: false,
        inline: false,
        container: true,
        useAlpha: false,
        extensions: [
            {
                name: 'swatches',
                colors: {
                    '#b60205': '#b60205',
                    '#d93f0b': '#d93f0b',
                    '#fbca04': '#fbca04',
                    '#0e8a16': '#0e8a16',
                    '#006b75': '#006b75',
                    '#1d76db': '#1d76db',
                    '#0052cc': '#0052cc',
                    '#5319e7': '#5319e7',
                    '#e99695': '#e99695',
                    '#f9d0c4': '#f9d0c4',
                    '#fef2c0': '#fef2c0',
                    '#c2e0c6': '#c2e0c6',
                    '#bfdadc': '#bfdadc',
                    '#c5def5': '#c5def5',
                    '#bfd4f2': '#bfd4f2',
                    '#d4c5f9': '#d4c5f9'
                },
                namesAsValues: false
            }
        ]
    })
    .on('colorpickerChange colorpickerCreate', function (e) {
        $('#templabel').attr('style', 'background-color:'+e.color.toString()+';color:#'+adaptColor(e.color.toString())+';');
    });
});

/*
    Pre-fill the label fields (color, and description) before
    showing the modal.
*/
function fillEdit(rowid) {
    var edit = JSON.parse(document.getElementById(rowid).dataset.label_rw);

    $('#labeledit').empty();
    var label = $('<span>').attr('id', 'templabel' ).addClass('label label-default');
    $(label).text(edit.label.name);
    $(label).attr('style', 'background-color:#'+edit.label.color+';color:#'+adaptColor(edit.label.color)+';');
    $('#labeledit').append($('<h4>').addClass('label-header').append(label));
    $('#labeldesc').val((edit.label.description === null ? '' : edit.label.description));

    $('#coloredit').colorpicker('setValue', '#'+edit.label.color);
};


