# yBox
A lightweight vanilla JS lightbox alternative, created by [Yuval Ashkenazi](https://github.com/yuval123123) and [Yoav Leshem](https://github.com/Leshemiko) 
### License: 
No license required - Use anywhere and as you wish.
## Compatibility
Modern browsers such as Chrome, Firefox, and Safari on both desktop and smartphones have been tested.
## Usage
Include `yBox.min.js`, `directive.js` (For mobile zoom on images) and `yBox.min.css` into your document's `<head>`.
Simply add `'yBox'` class to your `<a>` element,
and call the function as follows:
```javascript
    <script>
    window.onload = function(){
        if(document.querySelector('.yBox')){
            let myYbox = new yBox();
            myYbox.init();
        };
     }
    </script>
```
### Examples
```html 
    <html>
    <head>
        <link rel="stylesheet" href="dist/css/yBox.min.css">
        <script src="dist/js/directive.js"></script>
        <script src="dist/js/yBox.min.js"></script>
    </head>
    <body>
        Link to another element on page (which contains an inner yBox link):
        <a href="#link1" class="yBox">Click me</a> 

        Link to an Iframe:
        <a class="yBox yBox_iframe" href="https://www.youtube.com/watch?v=eEMpCcLm6NI&list=RDeEMpCcLm6NI&start_radio=1"></a>
        
        Custom yBox class:
        <a href="#myLink" data-popup-class="popupWrapper" class="yBox" >Click me</a>
        
        AJAX call 
        <a href="https://www.google.com" class="yBox yBox_ajax">Click me</a>
        
        Gallery view by groups: 
        
        <a href="/path_to_image1" class="yBox" data-ybox-group="group1">
            <img src="/path_to_image1" alt="" width="200" />
        </a>
        <a href="/path_to_image2" class="yBox" data-ybox-group="group1">
            <img src="/path_to_image2" alt="" width="200" />
        </a>
        <a href="/path_to_image3" class="yBox" data-ybox-group="group1">
            <img src="/path_to_image3" alt="" width="200" />
        </a>
    <script>
        window.onload = function(){
            if(document.querySelector('.yBox')){
                var myYbox = new yBox();
                myYbox.init();
            };
        }
    </script>
    </body>
    </html>
```

### Events

 ```javascript
    myYbox.yBox('Just trigger me anywhere');
    myYbox.onYboxOpen = function(){// Fires when yBox is opened
        document.body.classList.add('custom');
    };
    myYbox.onYboxClose = function(){// Fires when yBox is closed
        document.body.classList.remove('custom');
    };
    myYbox.onNextItemClick = function(){// Fires when clicking next image button on a group gallery
        console.log('Next item clicked');
    };
    myYbox.onPrevItemClick = function(){// Fires when clicking prev image button on a group gallery
        console.log('Prev item clicked');
    };
 ```
