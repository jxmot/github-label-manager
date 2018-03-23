# github-label-manager

A web based utility to manage GitHub labels.

# History

GitHub is a great tool, and I appreciate all the work that has gone into it. But lately I've been using *issues* on my repositories to note bugs, enhancements, etc. And I like the fact that I can use *labels*. However, it would have been *really nice* to make the labels global in respect to the repositories. For example there is a group of 4 or 5 labels that I like to use *everywhere*. And getting them to each of the desired repositories is no effortless task! So, this is what I came up with....

# Overview

This utility will provide - 

* A means to :
    * Edit labels in a fashion similar to how it's done on GitHub
    * Save a repository's labels to a JSON file
    * Load labels from JSON files and upload the labels to a repository
    * Import additional labels to a repository's label list
    * *TBD*
    
## Initial GUI Design

*A wireframe is your friend....* and time is well spent making one. And *Mock ups* are a good alternative.

This was my initial pass at putting together a GUI for this application - 

<p align="center">
  <img src="./mdimg/wireframe-1-697x551.jpg" alt="Sort-of Wireframe" txt="Sort-of Wireframe" width="50%">
</p>

Then after some thought and making adjustments I ended up with this -

<p align="center">
  <img src="./mdimg/wireframe-2-660x489.jpg" alt="Sort-of Wireframe" txt="Sort-of Wireframe" width="50%">
</p>

Changes included - 

* Made the repository selection box *resizeable*
* Moved a button, added more at the bottom of the page
* Worked out how I want the repository information to be presented.
* Reworked the label area, decided to use icons for action selection and label state indication

## Defining the Operation

Now that I had my mock-up I could begin finalizing how the application was going to operate. It was also an opportunity at this point to make additional adjustments to the GUI.

But before I started on *operations* I had to come up with some *rules*. These rules help define some of the operations and their associated indicators. Here are some examples - 

* Repository lists will be saved automatically and reused during run-time rather than reacquire the list from GitHub.
* When a repository's label list is read it is saved(*backed up*) automatically *with a time stamped file name*.
* Labels can have the following operations done to them - 
    * Edit - change the label's characteristics
    * Delete - marks the label for deletion, changes to the repository or exporting require confirmation. If the label is new(ID is null) then it is removed from the list immediately
    * Undo - to last state or undelete to last state 
* Labels can be in one of four states - 
    * Unchanged - 
        * label is new and empty
        * has just been retrieved
        * has just been saved or uploaded
    * Edited
    * Marked for deletion
    * New - ID is null, OR'd with "Unchanged" and "Edited" only, "Delete" removes the label from the list immediately and **cannot be undone**.
* Label Actions - 
    * Entire list -  
        * "Upload Changes" or "Export Labels" -  
            * What ever is displayed in the list will be either(depending on user choice) uploaded to the selected repository (if one was selected) or saved to a JSON formatted file.
        * "Clear List" - list is emptied and all label references are reset
        * "~~Cancel /~~ Reload" - list is emptied and all label references are reset, labels are reloaded from the most recent *source*.
        * "~~Read /~~ Import" - import from file only, 
* List of Labels - sorted by alphabetically label text




### Application States

* Initial - 
    * Successful start up -  
        * Repository selection list is populated, nothing is selected
            * Retrieve repository list using the configured GitHub repository owner and access token
            * Save all data to a JSON formatted file (overwrite)
            * Fill selection list with each repository's "`name`"
        * Repository information fields are empty or hidden
        * Label list is empty
        * Enable buttons - 
            * "Reload Repos", "Read / Import", "Create Label"
        * Disable buttons - 
            * "Read Labels", "Upload Changes", "Clear List", "Cancel / Reload", "Export Labels"
    * Start up failure at any point - 
        * Display error message, no controls visible
        

* A repository was picked - 
    * Show repository information -
        * Retrieve specific items for the chosen repository from [the saved file|internal storage]
    * Enable buttons - 
        * "Read Labels", "Reload Repos", "Read / Import", "Create Label"
    * Disable buttons - 
        * "Upload Changes", "Clear List", "Cancel / Reload", "Export Labels"
        

    * Check label list - 
        * Empty - do nothing
        * 1 or more labels - 
       

* "Read Labels" was clcked - 
    * Check label list - 
        * Empty - do nothing, continue
        * 1 or more labels - 
            * Prompt for "Keep / Merge" or "Clear" - save choice
    * Display labels for the selected repository
        * Retrieve label list
        * Display labels - 
            * Act on previous choice (if made) - 
                * Clear - remove previous labels from the list
                * Keep / Merge - 
                    * Matching Criteria - 
                        * IDs match - overwrite previous
    * Enable buttons - 
        * "Read Labels", "Reload Repos", "Read / Import", "Create Label"
    * Disable buttons - 
        * "Upload Changes", "Clear List", "Cancel / Reload", "Export Labels"

# Development Status

- [x] Begin development of core functions - get all repos, get labels for a repo, get info for a specific repo
- [ ] Develop additional core functions - create label, delete label, update label
- [ ] Additional functions - upload labels to repo, export labels to file, import labels from file
- [x] Create page for testing functionality of core functions - *ongoing development*
- [ ] Update README along the way - *in progress*


