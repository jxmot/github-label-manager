/*
    A collection of miscellaneous utility functions.

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
/*
    Checksum - creates a checksum for a string and returns
    the checksum value in a string.

    Originally found at - https://stackoverflow.com/a/3276730/6768046
*/
function checksum(s)
{
    var chk = 0x5F378EA8;
    var len = s.length;
    for (var i = 0; i < len; i++) chk += (s.charCodeAt(i) * (i + 1));
    return (chk & 0xffffffff).toString(16);
}
/*
    Change the color of an element to either "dark" or "light" (black or
    white) depending on it's background color.

    Origin :
        https://codepen.io/DevillersJerome/pen/bpLPGe

    Comments & Modifications :
        Jim Motyl - https://github.com/jxmot/

*/
function adaptElementColor(selector, parent) {
    // make sure the element actually exists
    if($(selector).length > 0) {
        // get the background color (RGBA) of the chosen selector,
        // it must start with an HTML tag (div,p,h1-6, and such). 
        // Then follow it with any level of specifying the element.
        // For example - 
        //      'div.someclass' - will access all elements that match
        //      '#someid' - a specific element only
        var rgb;
        var r, g, b;
        // if a parent was specified then obtain its background color
        // instead of the element we're going to change...
        if(parent !== undefined) {
            rgb = $(parent).css("background-color");
        } else rgb = $(selector).css("background-color");
        // extract the individual r, g, and b values 
        if (rgb.match(/^rgb/)) {
            var a = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            r = a[1];
            g = a[2];
            b = a[3];
        }
        // convert color to greyscale, for info see 
        // http://alienryderflex.com/hsp.html
        var hsp = Math.sqrt(0.299 * (r * r) +
                            0.587 * (g * g) +
                            0.114 * (b * b));

        // see just how light or dark it is...
        if(hsp > 127.5) {
            // and choose the opposite
            $(selector).addClass('sensornet_label-dark-color');
        } else {
            // and choose the opposite
            $(selector).addClass('sensornet_label-light-color');
        }
    } else consolelog('adaptElementColor() - selector not found : ' + selector);
};

function adaptColor(bgcolor) {
    var r, g, b;
    var color = '000000';
    var offset = 0;

    if(bgcolor.charAt(0) === '#') offset = 1;

    r = parseInt(bgcolor.substring(0+offset,2+offset),16);
    g = parseInt(bgcolor.substring(2+offset,4+offset),16);
    b = parseInt(bgcolor.substring(4+offset,6+offset),16);

    // convert color to greyscale, for info see 
    // http://alienryderflex.com/hsp.html
    var hsp = Math.sqrt(0.299 * (r * r) +
                        0.587 * (g * g) +
                        0.114 * (b * b));
    
    // see just how light or dark it is...
    //if(hsp > 127.5) {
    // may require adjustment, store in a config

    consolelog('adaptColor() - color = '+bgcolor);
    consolelog(' hsp = '+hsp);

//    if(hsp > 129) {
    if(hsp > 131) {
        color = '000000';
    } else {
        color = 'ffffff';
    }
    consolelog(' color = '+color);
    return color;
};

/*
    Start a timed shaking of the specified target element
*/
function startShake(target, focusTarget) {
    if((target != undefined) && (target != '')) {
        if($(target).hasClass('shake-horizontal') == false) {
            $(target).addClass('shake-horizontal');
            if((focusTarget != undefined) && (focusTarget != '')) {
                setTimeout(stopShake, 1500, target, focusTarget);
            } else {
                setTimeout(stopShake, 1500, target);
            }
        }
    } else {
        consolelog('startShake() - ERROR - bad argument');
    }
}

/*
    Stop the shaking of the specified target element
*/
function stopShake(target, focusTarget) {
    if((target != undefined) && (target != '')) {
        $(target).removeClass('shake-horizontal');
        if((focusTarget != undefined) && (focusTarget != '')) {
            // move the focus to the input box
            $(focusTarget).focus();
        }
    } else {
        consolelog('stopShake() - ERROR - bad argument');
    }
}

/*
    Return the current date and time as a string - 

        20171103-210832
*/
function timestamp() {
    var today = new Date();
    var mon = leadzero(today.getMonth()+1);
    var day = leadzero(today.getDate());
    var hrs = leadzero(today.getHours());
    var min = leadzero(today.getMinutes());
    var sec = leadzero(today.getSeconds());

    return `${today.getFullYear()}${mon}${day}-${hrs}${min}${sec}`;
};

/*
    Checks a value and if it's less than 10 it will return
    a string containing a leading zero.

    5  -> "05"
    24 -> 24
*/
function leadzero(val) {
    if(val < 10) val = '0'+val;
    return val;
};


