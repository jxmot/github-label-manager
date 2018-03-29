
function fillEdit(rowid) {

    var edit = JSON.parse(document.getElementById(rowid).dataset.label_rw);

    $('#labeledit').empty();
    var label = $('<span>').attr('id', 'templabel' ).addClass('label label-default');
    $(label).text(edit.label.name);
    $(label).attr('style', 'background-color:#'+edit.label.color+';color:#'+adaptColor(edit.label.color)+';');
    $('#labeledit').append($('<h4>').addClass('label-header').append(label));

    $('#labeldesc').val((edit.label.description === null ? '' : edit.label.description));

    $('#coloredit').data('color', edit.label.color);
    $('#coloredit').colorpicker({
        inline: true,
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
                namesAsValues: true
            }
        ]
    })
    .on('colorpickerChange colorpickerCreate', function (e) {
        consolelog('color = '+e.color.toString());
        $('#templabel').attr('style', 'background-color:'+e.color.toString()+';color:#'+adaptColor(e.color.toString())+';');
    });
};

