

$('#readlabels-btn').on('click', readlabels);

$('#uploadlabel-btn').on('click', _uploadlabel);

$('#clrlist-btn').on('click', cleartable);



function _uploadlabel() {
    if($('#full_name').data('reponame') != "none") {
        var data = '{"repo":"' + $('#full_name').data('reponame') + '","label":{"name": "test","description":"test label, ignore","color": "cfd2d4"}}';
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

function listLabels(labels) {
    $('#output').html(JSON.stringify(labels));
    if(labels.error === false) {
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
            //$(row).attr('onmouseover', 'labelRowOver(this.id)');

            var cell = $('<td>').addClass('table-cell-center');
            var label = $('<span>').attr('id', nameix+'-color').addClass('label label-default');
            $(label).text(lbldata.name);
            $(label).attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
            $(cell).append($('<h4>').addClass('label-header').append(label));
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
    $('#labelout').html(JSON.stringify(newlabel.msg));
};

function renderLabel(rowid) {
    //var lbldata = JSON.parse($('#'+rowid).data('label_rw')).label;
    var lbldata = JSON.parse(document.getElementById(rowid).dataset.label_rw).label;
    $('#'+rowid+'-color').text(lbldata.name);
    $('#'+rowid+'-color').attr('style', 'background-color:#'+lbldata.color+';color:#'+adaptColor(lbldata.color)+';');
    $('#'+rowid+'-desc').text((lbldata.description === null ? '' : lbldata.description));
};

