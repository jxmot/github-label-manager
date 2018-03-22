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