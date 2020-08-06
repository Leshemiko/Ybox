function YBox() {
    
    let yb = this;

    this.init = function(){
        let popupElements = document.querySelectorAll('.openPopup');
        for(let i = 0; i < popupElements.length; i++ ){
            popupElements[i].addEventListener('click', function(e) {
                e.preventDefault();
                yb.openPopup('', this)
            })
        }
        document.body.addEventListener('keyup', function(e){ yb.onKeyup(e)} )

    };

    this.onKeyup = function(e){
        let popImageItem = document.querySelector('.myPopImg');
        if(!popImageItem) return;
        let popImageItemSrc = popImageItem.getAttribute('src')
        let nextPrevItem = document.querySelector(`.openPopup[href="${popImageItemSrc}"`)
        if(e.keyCode === 39){ //Prev
            yb.myPrevPopup(nextPrevItem);
        }
        if(e.keyCode === 37){ //Next
            yb.myNextPopup(nextPrevItem);
        }
        if(e.keyCode === 27){ //Esc
            yb.closePopup()
        }
    }

    this.onPopupOpen = function(cb){
        return cb && typeof cb === 'function' && cb()
    };

    this.onPopupClose = function(cb){
        return cb && typeof cb === 'function' && cb()
    };

    this.onNextItemClick = function(cb){
        return cb && typeof cb === 'function' && cb()
    };
    
    this.onPrevItemClick = function(cb){
        return cb && typeof cb === 'function' && cb()
    };

    this.openPopup = function(code, el){
        let popupClass = '', hasSelf = true, url ="", html = '';
        
        if(typeof el == 'undefined'){
            hasSelf = false;
        }
        if(hasSelf){
            popupClass = el.getAttribute('data-popup-class');
             url = el.getAttribute('href');
        }
        html = document.createRange().createContextualFragment(`<div class="blackOpacityPOP">
                    <div class="myPopup ${popupClass}">
                        <div class="insertPopAjaxHere"></div>
                        <button type="button" class="closePOP" title="Close"></button>
                    </div>
                </div>`);
        document.addEventListener('click', function(e){
            if(e.target.className == 'blackOpacityPOP active' || e.target.className == 'closePOP'){
                 yb.closePopup();
            }
        });
        let placeHolderEl = document.querySelector('.myPopupPlaceHolder'),
            insertPopAjaxHereEl = document.querySelector('.insertPopAjaxHere');
        if(!document.querySelector('.myPopup')){
            document.body.appendChild(html);
            yb.insertPopHtml(el,hasSelf,url,code, function(){
                document.querySelector('.blackOpacityPOP').classList.add('active');
                // yb.triggerEvent('popupopen');
                yb.onPopupOpen()
            }); // TODO: use callback
            
        }else{
            if(document.querySelector('.myPopup.myPopImgWrap')){
                if(placeHolderEl){
                    placeHolderEl.parentNode.insertBefore(insertPopAjaxHereEl.innerHTML, placeHolderEl);
                    // placeHolderEl.parentNode.removeChild(placeHolderEl);
                }else {
                    placeHolderEl = document.createElement('div') ;
                    placeHolderEl.classList.add('myPopupPlaceHolder') 
                    let currentImage = document.querySelector('.myPopImg');
                    placeHolderEl.style.width = currentImage ? currentImage.width : 0;
                    placeHolderEl.style.height = currentImage ? currentImage.height : 0;
                }
                insertPopAjaxHereEl.appendChild( placeHolderEl) ;
                yb.insertPopHtml(el,hasSelf,url,code, function(){
                    // yb.triggerEvent('popupopen');
                    yb.onPopupOpen()
                });
            }else{
                yb.helpers.animate(insertPopAjaxHereEl, 'opacity', 0, .2, function(){
                    if(placeHolderEl){
                        // placeHolderEl.parentNode.insertBefore(insertPopAjaxHereEl.innerHTML, placeHolderEl);
                        placeHolderEl.parentNode.removeChild(placeHolderEl);
                    }
                    insertPopAjaxHereEl.innerHTML = '';
                    yb.insertPopHtml(el,hasSelf,url,code,function(){
                        // yb.triggerEvent('popupopen');
                        yb.onPopupOpen()
                    });
                    yb.helpers.animate(insertPopAjaxHereEl, 'opacity', 1, .2)
                })
            }
        }
    };
    this.insertPopHtml = function(el,hasSelf,url,code, cb){
        let myPopup = document.querySelector('.myPopup'), 
        placeHolderEl = document.querySelector('.myPopupPlaceHolder'), 
        insertPopAjaxHereEl = document.querySelector('.insertPopAjaxHere');
        
        if(hasSelf){
            if(el.classList.contains('openPopup_iframe')){ //iframe

                myPopup.classList.add('myIframePopup');
                if(url.toLowerCase().indexOf('youtube') > -1 || url.toLowerCase().indexOf('youtu.be') > -1){// is youtube link
                    let youtube_id = url.replace(/^[^v]+v.(.{11}).*/,"$1").replace('https://youtu.be/','').replace(/.*youtube.com\/embed\//,'');
                    url = `https://www.youtube.com/embed/${youtube_id}?wmode=transparent&rel=0&autoplay=1`;
                }
                insertPopAjaxHereEl.innerHTML = `<iframe src="${url}"  frameborder="0" wmode="Opaque" allowfullscreen class="iframePOP"></iframe>`
            }else if(el.classList.contains('openPopup_ajax')){//ajax
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log('success!', xhr);
                        insertPopAjaxHereEl.innerHTML =  xhr.response;
                    } else {
                        insertPopAjaxHereEl.innerHTML = "Oops - something went wrong - it's probably your fault"
                        console.log('The request failed!');
                    }
                };
                xhr.onerror = function(error){
                    console.warn(error);
                    insertPopAjaxHereEl.innerHTML = "Oops - something went wrong :(  <br> it's probably your fault"
                }
                xhr.open('GET', url);
                xhr.send();
               
            }else if(url.indexOf('#') == -1){//image
                myPopup.classList.add('myPopImgWrap');
                if(placeHolderEl) {
                    placeHolderEl.parentNode.removeChild(placeHolderEl);
                }
                let myPopImg = document.querySelector('.myPopImg');
                if(myPopImg){
                    insertPopAjaxHereEl.appendChild(document.createRange().createContextualFragment('<div style="text-align:center;position:absolute;right:0;left:0;top:0;bottom:0;height:100%;width:100%;"><div class="loader07"></div></div>'))
                }else{
                    insertPopAjaxHereEl.appendChild(document.createRange().createContextualFragment('<div style="text-align:center;"><div class="loader07"></div></div>'));
                }
                let img = new Image();
                img.src = url;
                img.className = 'myPopImg';
                img.onload = function(){
                    let code = `<div class="myPopImgZoom"><img src="${url}" alt="" class="myPopImg" /></div>`;
                    let group = el.getAttribute('data-group');
                    if(group && document.querySelector(`.openPopup[data-group="${group}"]`) ){
                        code = `<button type="button" class="myPopNextImg" title="Next"></button>${code}<button type="button" class="myPopPrevImg" title="Prev"></button>`;
                    }
                    insertPopAjaxHereEl.innerHTML = code;

                    if(window.screen.width <= 767){
                        zoom({zoom:'myPopImgZoom'});
                    }

                    document.querySelector('.myPopNextImg').addEventListener('click', function(){
                        yb.myNextPopup(el);
                    });
                    document.querySelector('.myPopPrevImg').addEventListener('click', function(){
                        yb.myPrevPopup(el);
                    });
                };
            }else{
                let urlElement = document.querySelector(url);
                let placeHolderHtml = document.createRange().createContextualFragment(`<div class="myPopupPlaceHolder"></div>`)
                urlElement.appendChild(placeHolderHtml);
                let temp = document.createElement('div');
                temp.innerHTML =  urlElement.innerHTML;
                insertPopAjaxHereEl.appendChild(temp);
                yb.init();
            }
        }else{
            insertPopAjaxHereEl.innerHTML = code;
        }
        cb && cb()
    };
    this.myNextPopup = function(el){
        let group = el.getAttribute('data-group') 
        let next;
        let x = false;
        let groups = document.querySelectorAll(`.openPopup[data-group=${group}]`);
        for (let i=0; i < groups.length; i++){
            let current = groups[i];
            if(!x){
                if(current.getAttribute('href') == el.getAttribute('href')){
                    x = true;
                    if (i+1 < groups.length){
                        next = groups[i+1]
                    }else{
                        next = groups[0]
                    }
                }
            }
        }
       
        if(next){
            next.click();
            yb.onNextItemClick();
        } 
    };
    this.myPrevPopup = function(el){
        let group = el.getAttribute('data-group');
        let x = false;
        let prev;
        let groups = document.querySelectorAll(`.openPopup[data-group=${group}]`);
        for (let i=0; i < groups.length; i++){
            let current = groups[i];
            if(!x){
                if(current.getAttribute('href') == el.getAttribute('href')){
                    x = true;
                    if (i-1 >= 0){
                        prev = groups[0]
                    }else{
                        prev = groups[groups.length-1]
                    }
                }
            }
        }
        if(prev){
            prev.click();
            yb.onPrevItemClick()
        };
    };
    this.closePopup = function(){
        let blackOpacityPOP = document.querySelector('.blackOpacityPOP'),
         insertPopAjaxHereEl = document.querySelector('.insertPopAjaxHere'),
         myPopupPlaceHolder = document.querySelector('.myPopupPlaceHolder')
        blackOpacityPOP.classList.remove('active');
        setTimeout(function(){
			if(myPopupPlaceHolder && myPopupPlaceHolder.parentNode ){
                myPopupPlaceHolder.appendChild(document.createRange().createContextualFragment(insertPopAjaxHereEl.innerHTML));
                myPopupPlaceHolder.parentNode.removeChild(myPopupPlaceHolder);
            }
            blackOpacityPOP && blackOpacityPOP.parentNode && blackOpacityPOP.parentNode.removeChild(blackOpacityPOP);
            yb.onPopupClose();
            document.body.removeEventListener('keyup', function(e){ yb.onKeyup(e)} )
		},600);
    };

    this.helpers = {
        animate : function(el, property, value, transition, callBack){
            el.style.transition = `all ${transition}s`;
            el.style[property] = `${value}`;
            setTimeout(()=>{
                el.style.transition = 'initial';
                callBack &&  callBack();
            },transition * 1000)
        }
    }

};