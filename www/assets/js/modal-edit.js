/* ************************************************************************ */
/*

    Label Edit Modal - Edit a single label at a time. 

    (c) 2018 Jim Motyl - https://github.com/jxmot/github-label-manager/LICENSE.md

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
        event.preventDefault();
        // let's shake the label edit modal so that it gets noticed
        // by the user.
        startShake('#labelEditModal');
    } else {
        if((labelSave === true) && (labelCanc === false)) {
            var rowid = $('#labeledit').data('rowid');
            // get the last version of the label, save it for later
            // comparison and start the new label off with the a copy
            // of its values
            var prelabel = JSON.parse(document.getElementById(rowid).dataset.label_rw);
            var newlabel = JSON.parse(JSON.stringify(prelabel));
            // retrieve the color value from the picker
            newlabel.label.color = $('#coloredit').colorpicker('getValue');
            // remove the '#' if it exists in the color string
            if(newlabel.label.color.charAt(0) === '#') {
                newlabel.label.color = newlabel.label.color.substring(1);
            }
            // get the name
            newlabel.label.name = $('#labelname').val();

// NOTE: An empty `description` will be written as `null`. I've tested label 
// creation on GitHub via the API and `null` is OK. In fact, if a label is 
// created without a `description` member it will return as `null` when read 
// afterwards.
            if($('#labeldesc').val() !== '')
                newlabel.label.description = $('#labeldesc').val();
            else newlabel.label.description = null;
            // calculate the checksum of the potentially modified label
            newlabel.chksum = checksum(JSON.stringify(newlabel.label));
            // compare new vs  previous...
            if(newlabel.chksum === prelabel.chksum) consolelog('label NOT changed');
            else {
                consolelog('label IS changed');
                document.getElementById(rowid).dataset.label_rw = JSON.stringify(newlabel);
                actionStateResult(rowid, ISMOD);
                $('#'+rowid+'-undo').removeClass('icon-disabled');
                renderLabel(rowid);
            }
        } else {
            if((labelSave === false) && (labelCanc === true)) {
                consolelog('label cancelled');
            }
        }
    }
});

/*
    On the "modal about show" event clear the "save" 
    and "cancel" flags. 
*/
$('#labelEditModal').on('show.bs.modal', function (event) {
    labelSave = false;
    labelCanc = false;
});

/*
    When the page is loaded go ahead and set up the color
    picker inside of the label edit modal.

    As of 2018-03-28 using the "master" branch - 

    https://github.com/farbelous/bootstrap-colorpicker/

    Documentation (not updated) - 

    https://farbelous.github.io/bootstrap-colorpicker/v2/
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
    Pre-fill the label fields (color, text, and description) before
    showing the modal.
*/
function fillEdit(rowid) {
    var edit = JSON.parse(document.getElementById(rowid).dataset.label_rw);
    // clear out the label edit elements
    $('#labeledit').empty();
    $('#labeledit').data('rowid', rowid);
    // create the label with its text
    var label = $('<span>').attr('id', 'templabel' ).addClass('label label-default');
    $(label).text(edit.label.name);
    // apply the backround color, pick a foreground color, and display it
    $(label).attr('style', 'background-color:#'+edit.label.color+';color:#'+adaptColor(edit.label.color)+';');
    $('#labeledit').append($('<h3>').addClass('label-header').append(label));
    // clear the label name and copy in the label name
    $('#labelname').empty();
    $('#labelname').val(edit.label.name);
    // label description
    $('#labeldesc').empty();
    $('#labeldesc').val((edit.label.description === null ? '' : edit.label.description));
    // set the color picker
    $('#coloredit').colorpicker('setValue', '#'+edit.label.color);
};


