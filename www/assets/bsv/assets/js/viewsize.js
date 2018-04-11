/*
    Browser Size and Mouse Position Viewer

    A utility that remotely displays the viewport size of a browser 
    window and the mouse position within the viewport.

    (c) 2017 J.Motyl    https://github.com/jxmot/browser-size-view/LICENSE.md

    This code is capable becoming either a sender or receiver of 
    window and mouse data. When loaded it will automatically select 
    which role it plays based on whether or not the `onresize` 
    attribute is present in this page's <body> tag. For example it
    should look something like this - 

        <body onresize="showsize()">

*/
if($('body').attr('onresize') === undefined) {
    // the receiver of the data is typically ran first,
    // so it will clear local storage.
    localStorage.clear();

    // get the various page elements that we'll use for
    // displaying the data
    var page = document.getElementById('page');

    var load     = document.getElementById('load');
    var l_width  = document.getElementById('l_width');
    var l_height = document.getElementById('l_height');

    var resize   = document.getElementById('resize');
    var r_width  = document.getElementById('r_width');
    var r_height = document.getElementById('r_height');

    var mouse = document.getElementById('mouse');
    var m_x = document.getElementById('m_x');
    var m_y = document.getElementById('m_y');

    // wait for local storage to be updated.
    // NOTE: if unchanged data is saved then there will
    // NOT be any events triggered. 
    window.addEventListener('storage', function (event) {
        // get the new data...
        var data = JSON.parse(event.newValue);
        // display the page/file name that was resized or loaded
        page.innerHTML = data.page;
        // display the dimensions...
        if(event.key === 'load') {
            // To display the raw storage data, 
            // uncomment the line below - 
            //load.innerHTML = event.newValue;
            l_width.innerText  = 'W ' + data.w;
            l_height.innerText = 'H ' + data.h;
        }

        if(event.key === 'resize') {
            // To display the raw storage data, 
            // uncomment the line below - 
            //resize.innerHTML = event.newValue;
            r_width.innerText  = 'W ' + data.w;
            r_height.innerText = 'H ' + data.h;
        }

        if(event.key === 'mouse') {
            // To display the raw storage data, 
            // uncomment the line below - 
            //mouse.innerHTML = event.newValue;
            m_x.innerText  = 'X ' + data.x;
            m_y.innerText = 'Y ' + data.y;
        }
    });
} else {
    // Extract the name of the file, it will be displayed
    // on the viewer
    var file = ''+location.pathname.split('/').slice(-1);
    var page = file.substring(0, file.lastIndexOf('.'));

    // capture mouse movements...
    $("body").mousemove(function(e) {
        storeView({
            page:   page,
            event : 'mouse',
            x: e.pageX,
            y: e.pageY
        });
    });

    // on document ready...
    $(function() {
        // Create the link to the viewer...
        if($('#viewsize-link').length > 0) popupLinkBootstrap();

        // send the current dimensions and describe 
        // them as 'load'
        storeView({
            page:   page,
            event : 'load',
            w: window.innerWidth,
            h: window.innerHeight
        });
    });

    // this is called from <body>
    function showsize() {
        storeView({
            page:   page,
            event : 'resize',
            w: window.innerWidth,
            h: window.innerHeight
        });
    };

    // store the data...
    function storeView(view) {
        localStorage.setItem(view.event, JSON.stringify(view));
    };

    // create a link to the viewer
    function popupLink() {
        var target = $('#viewsize-link');
        var para = $('<p>');
        var link = $('<a>').attr('href', '#');
        $(link).attr('onclick',"window.open('./assets/bsv/viewsize.html','pagename','width=300,height=500')");
        $(para).append($(link).text('click to open a pop-up'));
        $(target).append($(para)).append($('<br>')).append($('<br>'));
    };

    // click to open a pop-up 
    function popupLinkBootstrap() { 
        var target = $('#viewsize-link').addClass('row'); 
        var wrap = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12 col-content-center'); 
        var link = $('<a>').attr('href', '#').attr('target','popup'); 
        // change the path - ./assets/bsv/viewsize.html  
        // to the correct location for your use. 
        //  
        // Here's the correct path for running in the same folder -  
        // $(link). attr('onclick',"window.open('./viewsize.html','pagename','width=300,height=450')"); 
        $(link). attr('onclick',"window.open('./assets/bsv/viewsize.html','pagename','width=300,height=450')"); 
        $(target).append(wrap.append(link.text('click to open a pop-up'))); 
        $(target).append($('<br>')).append($('<br>')); 
    }; 
}
