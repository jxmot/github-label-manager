/*
    GUI - Emoji API 

    Manages the retreival of the GitHub emoji list and
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
    array of emoji names without the ':'.
*/
function emojitag(emojitext) {
    var imgs = undefined;

    if(emojitext.includes(':')) {
        var emojiname = emojitext.substring(emojitext.indexOf(':'), emojitext.lastIndexOf(':')).split(':')

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

