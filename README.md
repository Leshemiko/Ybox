# Ybox
A lightweight vanilla JS lightbox alternative, created by Yuval Ashkenazi and [Yoav Leshem](https://github.com/Leshemiko) 
License: no license required - use anywhere and as you wish.
## Compatibility
Modern browsers such as Chrome, Firefox, and Safari on both desktop and smartphones have been tested.
## Usage
include `Ybox.minified.js`, `directive.js` (for mobile zoom on images) and `Ybox.minified.css` into your document's `<head>`.
Simply add `'openPopup'`  class to your `<a>` element,
and call the function as follows:
```javascript
    <script>
            window.onload = function(){
                let myYBox = new YBox();
                myYBox.init();
            }
    </script>
```
### Examples
```html 
    <html>
    <head>
        <link rel="stylesheet" href="dist/css/Ybox.minified.css">
        <script src="dist/js/directive.js"></script>
        <script src="dist/js/Ybox.minified.js"></script>
    </head>
    <body>
        Link to another element on page (which contains an inner Ybox link):
        <a href="#link1" class="openPopup">Click me</a> 

        Link to an Iframe:
        <a class="openPopup openPopup_iframe" href="https://www.youtube.com/watch?v=eEMpCcLm6NI&list=RDeEMpCcLm6NI&start_radio=1"></a>
        
        Custom popup wrapper class:
        <a href="#myLink" data-popup-class="popupWrapper" class="openPopup" >Click me</a>
        
        AJAX call 
        <a href="https://www.google.com"  class="openPopup openPopup_ajax">Click me</a>
        
        Gallery view by group : 
        
        <a href="/path_to_image1" class="openPopup" data-group="group1">
            <img src="/path_to_image1" alt="" width="200" />
        </a>
        <a href="/path_to_image2" class="openPopup" data-group="group1">
            <img src="/path_to_image2" alt="" width="200" />
        </a>
        <a href="/path_to_image3" class="openPopup" data-group="group1">
            <img src="/path_to_image3" alt="" width="200" />
        </a>
    <script>
        window.onload = function(){
            var myYBox = new YBox();
            myYBox.init();
            
        }
    </script>
    </body>
    </html>
```

### Events

 ```javascript
    myYBox.openPopup('Just trigger me anywhere');
    myYBox.onPopupOpen = function(){// fires when popup is opened
        document.body.classList.add('custom')
    }
    myYBox.onPopupClose = function(){// fires when popup is closed
        document.body.classList.remove('custom')
    }
    myYBox.onNextItemClick = function(){// fires when clicking next image button on a group gallery
        console.log('next item clicked')
    };
    myYBox.onPrevItemClick = function(){// fires when clicking prev image button on a group gallery
        console.log('prev item clicked')
    }
 ```