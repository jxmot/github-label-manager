# github-label-manager Design Details

# Design Overview

# Back End

The back end of this application provides the endpoints for the application. They have been tailored to this application in regards to how the data is formatted and its contents in *both* directions.

In addition all JSON file creation and storage is also on the back end.

## PHP Endpoints

All of the endpoints have been implemented with PHP (*5.6*) and behave as *commands*. And all GitHub specific details are also kept there. Those details are - 

* repository owner's ID
* access token
* GitHub endpoint paths

### API Synopses

#### Repository Functions

#### Label Functions

## JSON Data Files

## Configuration

# Front End

## API Usage

Access to the API is provided in `glmapi.js` - 

**`createlabel(label, callback)`**<br>
Create a *new* label in the currently selected repository.

**`exportdata(data, callback)`**<br>
Export data (*typically a JSON formatted string*) to a client-side specified file name.

**`importlist(callback)`**<br>
Retrieve a list of previously exported label files. The path is configured in `ghlabelmgr.php`, see `$imexportpath`.

**`getimportlabels(file, callback)`**<br>
Retrieve the labels from a specified file.

**`getlabels(repo, callback)`**<br>

**`getrepos(callback)`**<br>

**`getrepoinfo(repo, callback)`**<br>

Depending upon the desired HTTP method the functions above will call - 

* `_get(func, args, callback)` - 
* `_post(func, body, callback)` - 

## DOM Usage

Within this application the DOM is quite dynamic. It is altered when ever a repository and/or its labels are rendered on the page. 

### Dynamic Element IDs

The following elements will have their `id` attributes created when the element themselves are added to the DOM -

* Table Rows - `<tr>` : when associated with a label
* List Items - `<li>` : when associated with label export/import files
* Some Spans - `<span>` : when associated with a label's *action icons*

### Dynamic Element Events

Although it would be possible to attach events to the *dynamic element IDs*, it would also be extremely difficult to maintain and/or debug. Instead, and where click events are needed those click-able elements use the tag's `onclick=func()` attribute.

### Dynamic Data Storage

#### Label Data

#### Label State

#### Label Type

#### Label Appearance

#### Notes

* When storing JSON formatted *strings* in `data-????` attributes you need to be conisistent in regards to the method used for saving **and** retrieving the JSON string. I have found that everything works best when using `document.getElementById('someID').dataset.item` *instead of* the JQuery form `$('#someID').data('item')`. That's because JQuery will parse the JSON string and `$('#someID').data('item')` will actually return an object. 

## Label Editing

### Modal

### Data Storage

### Detecting Change

## Styling


