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
                btnClass: 'btn-red',
                close: function () {
                }
            }
        });
    }
}

var infoDlgState = false;
var infoDlgStack = [];

// convert to object

function infoDlg(title, msg) {
    if(dlgControl === true) {
        $.confirm({
            title: title,
            content: msg,
            type: 'blue',
            typeAnimated: true,
            buttons: {
                btnClass: 'btn-blue',
                close: function () {
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
        // mute console.log('timedDlg() - title = '+title);
        
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
        // mute console.log('timedDlg() - stack length  = '+timedDlgStack.length);
        // mute console.log('timedDlg() - timedDlgState = '+timedDlgState);
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
