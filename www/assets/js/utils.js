/*
    A collection of miscellaneous utility functions.

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
/*
    Change the color of an element to either "dark" or "light" (black or
    white) depending on it's background color.

    Origin :
        https://codepen.io/DevillersJerome/pen/bpLPGe

    Comments & Modifications :
        Jim Motyl - https://github.com/jxmot/

*/
function adaptColor(selector, parent) {
    // make sure the element actually exists
    if($(selector).length > 0) {
        // get the background color (RGBA) of the chosen selector,
        // it must start with an HTML tag (div,p,h1-6, and such). 
        // Then follow it with any level of specifyiing the element.
        // For example - 
        //      'div.somelcass' - will access all elements that match
        //      '#someid' - a specific element only
        var rgb;
        var r, g, b;
        // if a parent was specifed then obtain its background color
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
    } else consolelog('adaptColor() - selector not found : ' + selector);
};

function _adaptColor(bgcolor) {
    var r, g, b;
    var color = '000000';

    r = parseInt(bgcolor.substring(0,2),16);
    g = parseInt(bgcolor.substring(2,4),16);
    b = parseInt(bgcolor.substring(4,6),16);

    // convert color to greyscale, for info see 
    // http://alienryderflex.com/hsp.html
    var hsp = Math.sqrt(0.299 * (r * r) +
                        0.587 * (g * g) +
                        0.114 * (b * b));
    
    // see just how light or dark it is...
    //if(hsp > 127.5) {
    if(hsp > 129) {
        color = '000000';
    } else {
        color = 'ffffff';
    }
    return color;
};

