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

**`createlabel(label, callback)`**
Create a *new* label

**`getlabels(repo, callback)`**

**`getrepos(callback)`**

**`getrepoinfo(repo, callback)`** 

Depending upon the desired HTTP method the functions above will call - 

* `_get(func, args, callback)` - 
* `_post(func, body, callback)` - 

## DOM Usage

### Data Storage

#### Label Data

#### Label State

#### Label Appearance

#### Notes

* When storing JSON formatted *strings* in `data-????` attributes you need to be conisistent in regards to the method used for saving **and** retrieving the JSON string. I have found that everything works best when using `document.getElementById('someID').dataset.item` *instead of* the JQuery form `$('#someID').data('item')`. That's because JQuery will parse the JSON string and `$('#someID').data('item')` will actually return an object. 

### Dynamic Element IDs

### Dynamic Element Events

## Label Editing

### Modal

### Data Storage

### Detecting Change

## Styling


