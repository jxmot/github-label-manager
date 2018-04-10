
function labelRowOver(id) {
    consolelog('id = '+id);
    consolelog('label_rw = '+document.getElementById(id).dataset.label_rw);
};

function labelAction(id) {
    var rowid;
    var elem = document.getElementById(id);
    if(!elem.classList.contains('icon-disabled'))
    {
        consolelog('id = '+id);
        consolelog('action = '+elem.dataset.action);
        rowid = id.replace(/\-edit|\-del|\-undo/g, '');
        consolelog('rowid = '+rowid+'  label_rw = '+document.getElementById(rowid).dataset.label_rw);
        actOnLabel(id, rowid, elem.dataset.action);
    }
};

function actOnLabel(id, rowid, action) {
    if(action === 'delete') {
        actionStateResult(rowid, TODEL);

        var editid = id.replace(/\-del/g, '-edit');
        var undoid = id.replace(/\-del/g, '-undo');
        $('#'+editid).addClass('icon-disabled');
        $('#'+id).addClass('icon-disabled');
        $('#'+undoid).removeClass('icon-disabled');

    } else if(action === 'edit') {
        // load up the modal with the current label
        fillEdit(rowid);
        // show the modal
        $('#labelEditModal').modal('show');
    } else if(action === 'undo') {
        var state = actionStateResult(rowid, UNDO);

        var deleid = id.replace(/\-undo/g, '-del');
        var editid = id.replace(/\-undo/g, '-edit');
        $('#'+deleid).removeClass('icon-disabled');
        $('#'+editid).removeClass('icon-disabled');

        if(state === NOMOD) {
            document.getElementById(rowid).dataset.label_rw = document.getElementById(rowid).dataset.label_ro;
            $('#'+id).addClass('icon-disabled');
            renderLabel(rowid);
        } else $('#'+id).removeClass('icon-disabled');
    }
};

/*
    label states :
        unchanged = 1
        modified  = +2
        delete    = +4

    state value will be 3 if the label has been modified
    state value will be 5 if the unchanged label is deleted
    state value will be 7 if the label has been modified and then deleted

    undo a state change :

        amount to undo = current state - unchanged
        if amount to undo >= delete then current state -= delete
        else current state -= modified

*/
function actionStateResult(rowid, statechg) {
    var curr = JSON.parse(document.getElementById(rowid).dataset.state);
    consolelog('curr state = '+curr.state);

    if(statechg === UNDO) {
        if((curr.state - NOMOD) >= TODEL) curr.state -= TODEL;
        else curr.state -= ISMOD;
    } else {
        curr.state |= statechg;
    }

    consolelog('new state  = '+curr.state);
    document.getElementById(rowid).dataset.state = JSON.stringify(curr);

    $('#'+rowid+'-todel').addClass('hidden');
    $('#'+rowid+'-tomod').addClass('hidden');
    $('#'+rowid+'-notmod').addClass('hidden');
    if(curr.state & TODEL) $('#'+rowid+'-todel').removeClass('hidden');
    else if(curr.state & ISMOD) $('#'+rowid+'-tomod').removeClass('hidden');
    else $('#'+rowid+'-notmod').removeClass('hidden');

    return curr.state;
};
