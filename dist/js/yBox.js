/*! yBox - v1.0 - 2020-08-07
* By Yuval Ashkenazi and Yoav Leshem
* https://github.com/Leshemiko/Ybox */

function yBox() {
    
    let yb = this;

    this.init = function(){
        let yBoxElements = document.querySelectorAll('.yBox');
        for(let i = 0; i < yBoxElements.length; i++ ){
            yBoxElements[i].addEventListener('click', function(e) {
                e.preventDefault();
                yb.yBox('', this)
            })
        }
        document.body.addEventListener('keyup', function(e){ yb.onKeyup(e)} )

    };

    this.onKeyup = function(e){
        let yBoxImg = document.querySelector('.yBoxImg');
        if(!yBoxImg) return;
        let yBoxImgSrc = yBoxImg.getAttribute('src');
        let nextPrevItem = document.querySelector(`.yBox[href="${yBoxImgSrc}"`);
        if(e.keyCode === 39){ //Prev
            yb.yBoxPrevItem(nextPrevItem);
        }
        if(e.keyCode === 37){ //Next
            yb.yBoxNextItem(nextPrevItem);
        }
        if(e.keyCode === 27){ //Esc
            yb.closeYbox();
        }
    }

    this.onYboxOpen = function(cb){
        return cb && typeof cb === 'function' && cb()
    };

    this.onYboxClose = function(cb){
        return cb && typeof cb === 'function' && cb()
    };

    this.onNextItemClick = function(cb){
        return cb && typeof cb === 'function' && cb()
    };
    
    this.onPrevItemClick = function(cb){
        return cb && typeof cb === 'function' && cb()
    };

    this.yBox = function(code, el){
        let yBoxClass = '', hasSelf = true, url ="", html = '';
        
        if(typeof el == 'undefined'){
            hasSelf = false;
        }
        if(hasSelf){
            yBoxClass = el.getAttribute('data-ybox-class') ? el.getAttribute('data-ybox-class') : '';
             url = el.getAttribute('href');
        }
        html = document.createRange().createContextualFragment(`<div class="yBoxOverlay">
                    <div class="yBoxFrame ${yBoxClass}">
                        <div class="insertYboxAjaxHere"></div>
                        <button type="button" class="closeYbox" title="Close"></button>
                    </div>
                </div>`);
        document.addEventListener('click', function(e){
            if(e.target.className == 'yBoxOverlay active' || e.target.className == 'closeYbox'){
                 yb.closeYbox();
            }
        });
        let placeHolderEl = document.querySelector('.yBoxPlaceHolder'),
            insertYboxAjaxHereEl = document.querySelector('.insertYboxAjaxHere');
        if(!document.querySelector('.yBoxFrame')){
            document.body.appendChild(html);
            yb.insertYboxHtml(el,hasSelf,url,code, function(){
				setTimeout(function(){
					document.querySelector('.yBoxOverlay').classList.add('active');
				},200);
                // yb.triggerEvent('yBoxOpen');
                yb.onYboxOpen()
            }); // TODO: use callback
            
        }else{
            if(document.querySelector('.yBoxFrame.yBoxImgWrap')){
                if(placeHolderEl){
                    placeHolderEl.parentNode.insertBefore(insertYboxAjaxHereEl, placeHolderEl);
                    placeHolderEl.parentNode.removeChild(placeHolderEl);
                    // placeHolderEl.remove();
                }else {
                    placeHolderEl = document.createElement('div') ;
                    placeHolderEl.classList.add('yBoxPlaceHolder') 
                    let currentImage = document.querySelector('.yBoxImg');
                    placeHolderEl.style.width = currentImage ? currentImage.width : 0;
                    placeHolderEl.style.height = currentImage ? currentImage.height : 0;
                }
                insertYboxAjaxHereEl.appendChild(placeHolderEl) ;
                yb.insertYboxHtml(el,hasSelf,url,code, function(){
                    // yb.triggerEvent('yBoxOpen');
                    yb.onYboxOpen()
                });
            }else{
                yb.helpers.animate(insertYboxAjaxHereEl, 'opacity', 0, .2, function(){
                    if(placeHolderEl  && placeHolderEl.parentNode){
                        // placeHolderEl.parentNode.insertBefore(insertYboxAjaxHereEl.innerHTML, placeHolderEl);
                        placeHolderEl.parentNode.removeChild(placeHolderEl);
                        placeHolderEl.remove();
                    }
                    insertYboxAjaxHereEl.innerHTML = '';
                    yb.insertYboxHtml(el,hasSelf,url,code,function(){
                        // yb.triggerEvent('yBoxOpen');
                        yb.onYboxOpen()
                    });
                    yb.helpers.animate(insertYboxAjaxHereEl, 'opacity', 1, .2)
                })
            }
        }
    };
    this.insertYboxHtml = function(el,hasSelf,url,code, cb){
        let yBoxFrame = document.querySelector('.yBoxFrame'), 
        placeHolderEl = document.querySelector('.yBoxPlaceHolder'), 
        insertYboxAjaxHereEl = document.querySelector('.insertYboxAjaxHere');
        
        if(hasSelf){
            if(el.classList.contains('yBox_iframe')){ //iframe

                yBoxFrame.classList.add('yBoxIframeWrap');
                if(url.toLowerCase().indexOf('youtube') > -1 || url.toLowerCase().indexOf('youtu.be') > -1){// is youtube link
                    let youtube_id = url.replace(/^[^v]+v.(.{11}).*/,"$1").replace('https://youtu.be/','').replace(/.*youtube.com\/embed\//,'');
                    url = `https://www.youtube.com/embed/${youtube_id}?wmode=transparent&rel=0&autoplay=1`;
                }
                insertYboxAjaxHereEl.innerHTML = `<iframe src="${url}"  frameborder="0" wmode="Opaque" allowfullscreen class="yBoxIframe"></iframe>`
            }else if(el.classList.contains('yBox_ajax')){//ajax
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log('success!', xhr);
                        insertYboxAjaxHereEl.innerHTML =  xhr.response;
                    } else {
                        insertYboxAjaxHereEl.innerHTML = "Oops - something went wrong :("
                        console.log('The request failed!');
                    }
                };
                xhr.onerror = function(error){
                    console.warn(error);
                    insertYboxAjaxHereEl.innerHTML = "Oops - something went wrong :("
                }
                xhr.open('GET', url);
                xhr.send();
               
            }else if(url.indexOf('#') == -1){//image
                yBoxFrame.classList.add('yBoxImgWrap');
                if(placeHolderEl) {
                    placeHolderEl.parentNode.removeChild(placeHolderEl);
                }
                let yBoxImg = document.querySelector('.yBoxImg');
                if(yBoxImg){
                    insertYboxAjaxHereEl.appendChild(document.createRange().createContextualFragment('<div class="yBoxLoaderWrap"><div class="yBoxLoader"></div></div>'))
                }else{
                    insertYboxAjaxHereEl.appendChild(document.createRange().createContextualFragment('<div style="text-align:center;"><div class="yBoxLoader"></div></div>'));
                }
                let img = new Image();
                img.src = url;
                img.className = 'yBoxImg';
                img.onload = function(){
                    let code = `<div class="yBoxImgZoom"><img src="${url}" alt="" class="yBoxImg" /></div>`;
                    let group = el.getAttribute('data-ybox-group');
                    if(group && document.querySelector(`.yBox[data-ybox-group="${group}"]`) ){
                        code = `<button type="button" class="yBoxNextImg" title="Next"></button>${code}<button type="button" class="yBoxPrevImg" title="Prev"></button>`;
                    }
                    insertYboxAjaxHereEl.innerHTML = code;

                    if(window.screen.width <= 767){
                        zoom({zoom:'yBoxImgZoom'});
                    }

                    document.querySelector('.yBoxNextImg').addEventListener('click', function(){
                        yb.yBoxNextItem(el);
                    });
                    document.querySelector('.yBoxPrevImg').addEventListener('click', function(){
                        yb.yBoxPrevItem(el);
                    });
                };
            }else{
                let urlElement = document.querySelector(url);
                let placeHolderHtml = placeHolderEl ? placeHolderEl : document.createRange().createContextualFragment(`<div class="yBoxPlaceHolder"></div>`)
                // urlElement.appendChild(placeHolderHtml);
                urlElement.parentNode.insertBefore(placeHolderHtml, urlElement.nextSibling);
                let temp = document.createElement('div');
				temp.className = 'yBoxInnerHtmlDiv';
                temp.innerHTML =  urlElement.innerHTML;
                insertYboxAjaxHereEl.appendChild(temp);
                yb.init();
            }
        }else{
            insertYboxAjaxHereEl.innerHTML = code;
        }
        cb && cb()
    };
    this.yBoxNextItem = function(el){
        let group = el.getAttribute('data-ybox-group') 
        let next;
        let x = false;
        let groups = document.querySelectorAll(`.yBox[data-ybox-group=${group}]`);
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
    this.yBoxPrevItem = function(el){
        let group = el.getAttribute('data-ybox-group');
        let x = false;
        let prev;
        let groups = document.querySelectorAll(`.yBox[data-ybox-group=${group}]`);
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
    this.closeYbox = function(){
        let yBoxOverlay = document.querySelector('.yBoxOverlay'),
        insertYboxAjaxHereEl = document.querySelector('.insertYboxAjaxHere'),
        yBoxPlaceHolder = document.querySelector('.yBoxPlaceHolder')
        yBoxOverlay.classList.remove('active');
        setTimeout(function(){
			if(yBoxPlaceHolder && yBoxPlaceHolder.parentNode ){
                yBoxPlaceHolder.appendChild(document.createRange().createContextualFragment(insertYboxAjaxHereEl.innerHTML));
                yBoxPlaceHolder.parentNode.removeChild(yBoxPlaceHolder);
            }
            yBoxOverlay && yBoxOverlay.parentNode && yBoxOverlay.parentNode.removeChild(yBoxOverlay);
            yb.onYboxClose();
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
