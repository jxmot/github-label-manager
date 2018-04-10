/* ************************************************************************ */
/*
    Application Dialogs

    NOTE: The functions in this file require - 

        http://craftpip.github.io/jquery-confirm/
*/

// if false, dialogs are disabled.
var dlgControl = true;

function errorDlg(title, msg) {
    if(dlgControl === true) {
        $.confirm({
            title: title,
            content: msg,
            type: 'red',
            typeAnimated: true,
            buttons: {
                close: {
                    btnClass: 'btn-red',
                    action: function () {
                    }
                }
            }
        });
    }
}

function infoDlg(title, msg) {
    if(dlgControl === true) {
        $.confirm({
            title: title,
            content: msg,
            type: 'blue',
            typeAnimated: true,
            buttons: {
                close: {
                    btnClass: 'btn-red',
                    action: function () {
                    }
                }
            }
        });
    }
}

var timedDlgState = false;
var timedDlgStack = [];
var timedDlgLast;

function timedDlg(title, msg, dur) {

    if(dlgControl === true) {
        if(timedDlgState === false) {
            timedDlgState = true;
            var timeout = 0;
            if(dur === undefined) {
                timeout = 5000;
            } else {
                timeout = dur;
            }
    
            $.confirm({
                title: title,
                theme: 'bootstrap',
                columnClass: 'medium',
                closeIcon: function() {
                    if(window.timedDlgStack.length === 0) {
                        window.timedDlgState = false;
                    }
                    clearTimeout(window.timedDlgLast);
                },
                autoClose: 'close|'+timeout.toString(),
                content: msg,
                type: 'dark',
                typeAnimated: true,
                buttons: {
                    close: {
                        btnClass: 'hide',
                        action: function () {
                            window.timedDlgState = false;
                            if(window.timedDlgStack.length > 0) {
                                var nextDlg = window.timedDlgStack.shift();
                                window.timedDlgLast = setTimeout(window.timedDlg, 500, nextDlg.t, nextDlg.m, nextDlg.d);
                            }
                        }
                    }
                }
            });
        } else {
            timedDlgStack.push({t: title, m: msg, d: dur});
        }
    }
    return timedDlgState;
}

// control whether or not the dialogs will display
$(document).on('dlgOFF', function(event) {
    dlgControl = false;
});

$(document).on('dlgON', function(event) {
    dlgControl = true;
});
