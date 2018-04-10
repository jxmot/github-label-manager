/*
    viewsize-auto.js - If the `onresize` attribute is set on the 
    page's `<body>` tag AND the target exists then automatically
    create the link to the viewer page.

    NOTE: This version uses Bootstrap, modify as necessary.
*/
if(($('body').attr('onresize') !== undefined) && ($('#viewsize-auto').length > 0)) {
    vspopup();
    // OR
    // vslink();
}

// right-click and open in new window
function vslink() {
    var target = $('#viewsize-auto').addClass('row');
    var wrap = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12 col-content-center');
    var link = $('<a>').attr('href', './assets/bsv/viewsize.html').attr('target','popup');
    $(target).append(wrap.append(link.text('right-click and open in new window')));
    $(target).append($('<br>')).append($('<br>'));
};

// click to open a pop-up
function vspopup() {
    var target = $('#viewsize-auto').addClass('row');
    var wrap = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12 col-content-center');
    var link = $('<a>').attr('href', '#').attr('target','popup');
    // change the path - ./assets/bsv/viewsize.html 
    // to the correct location for your use.
    // 
    // Here's the correct path for running in the same folder - 
    // $(link). attr('onclick',"window.open('./viewsize.html'./assets/bsv/viewsize.html','pagename','width=300,height=450')");
    $(link). attr('onclick',"window.open('./assets/bsv/viewsize.html'./assets/bsv/viewsize.html','pagename','width=300,height=450')");
    $(target).append(wrap.append(link.text('click to open a pop-up')));
    $(target).append($('<br>')).append($('<br>'));
};

