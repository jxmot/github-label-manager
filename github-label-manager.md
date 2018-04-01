# github-label-manager Design Details

# Design Overview

# Back End

## PHP Endpoints

### API Synopses

## JSON Data Files

## Configuration

# Front End

## API Usage

## DOM Usage

### Data Storage

#### Notes

* When storing JSON formatted *strings* in `data-????` attributes you need to be conisistent in regards to the method used for saving **and** retrieving the JSON string. I have found that everything works best when using `document.getElementById('someID').dataset.item` *instead of* the JQuery form `$('#someID').data('item')`. That's because JQuery will parse the JSON string and `$('#someID').data('item')` will actually return an object. 

#### Label Data

#### Label State

#### Label Appearance

### Dynamic Element IDs

### Dynamic Element Events

## Label Editing

### Modal

### Data Storage

### Detecting Change

## Styling


