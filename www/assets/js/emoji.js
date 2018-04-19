/*
    GUI - Emoji API 

    Manages the retrieval of the GitHub emoji list and
    can return an emoji-ed tag with the image and CSS

    (c) 2017 Jim Motyl - https://github.com/jxmot/github-label-manager/LICENSE.md
*/

// Retrieve the list of repositories and populate the
// selection list.
$(function () {
    getemojilist(emojilistdone);
});

var gh_emojis = {};

/*
    emoji list has been retrieved
*/
function emojilistdone(emlist) {
    var idx = 0;
    gh_emojis = {};

    if(emlist !== undefined) {
        if(emlist.error === false) {
            // save the emoji list in an object for later
            // search and retrieval.
            gh_emojis = JSON.parse(JSON.stringify(emlist.msg));
        } else {
            errorDlg('ERROR - emojilistdone()', JSON.stringify(emlist.msg));
        }
    } else {
        errorDlg('ERROR - emojilistdone()', 'emlist is undefined');
    }
};

/*
    Take a string with ':emoji:' substrings and return an
    array of emojis in <img> tags. If none are found then
    `undefined` is returned.
*/
function emojitag(emojitext) {
    var imgs = undefined;

    if(emojitext.includes(':')) {
        var emojiname = emojitext.substring(emojitext.indexOf(':'), emojitext.lastIndexOf(':')).split(':')
        // NOTE: emojiname[] will contain empty strings because of multiple 
        // emojis in the string. For example - ":bug::bike:" will cause 3
        // members to be created - 'bug','','bike', the empty string is 
        // from where the two emojis meet ("::")
        if(emojiname.length > 1) {
            var tmp = [];
            for(var ix = 1; ix < emojiname.length; ix++) {
                if(emojiname[ix] !== '') {
                    var imgsrc = gh_emojis[emojiname[ix]];
                    var img = $('<img>');
                    $(img).addClass('emoji-img');
                    $(img).attr('src', imgsrc);
                    tmp.push(img);
                }
            }
            imgs = tmp;
        }
    }
    return imgs;
};

