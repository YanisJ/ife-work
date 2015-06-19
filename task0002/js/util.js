function getType ( param ) {
    return Object.prototype.toString.call(param).match(/\s(.+)\]/)[1].toLowerCase();
}

function isArray ( arr ) {
    return getType(arr) === "array";
}

function isFunction ( fn ) {
    return getType(fn) === "function";
}

function cloneObject ( src ) {
    // 处理5中基本类型
    if ( src === undefined ) return src;

    var result,
        srcType = getType(src);
    
    var i,
        typeList = ['string', 'boolean', 'number'],
        l = typeList.length;

    for (i=0; i<l; i++) {
        if (srcType === typeList[i]) return src;
    }

    // 处理对象
    // 包括：
    //     日期
    //     数组
    //     普通对象
    //     正则对象
    
    switch ( srcType ) {
        case "array":
            result = [];
            src.forEach(function(el){
                result.push(cloneObject(el));
            });
            break;

        case "date":
            result = new Date(src);
            break;

        // case "regexp":
        //     result = new RegExp(src);
        //     break;

        case "object":
            result = {};
            for (var name in src) {
                result[name] = cloneObject(src[name]);
            }
            break;
    }

    
    if (result===undefined) {
        console.log("This method can not clone 'Function' or 'RegExp'.")
    }


    return result;
}

// 这个去重有去掉 undefined，去掉空字符串的作用
function uniqArray ( arr ) {
    var result = [];

    each(arr,function(el){
        if (el !== undefined && el !== "" && result.indexOf(el) === -1){
            result.push(el);
        }
    });

    return result;
}

function trim ( str ) {
    result = str.match(/^\s*(.*\S)\s*$/)[1];
    return result;
}

function each ( arr, fn ) {
    if ( Array.prototype.forEach ) {
        // arr.forEach( fn );
        // 注册掉上面的语句是因为它只能在  arr 是 Array 的情况下使用
        // 而js中有很多时候会存在 类似Array 的对象
        Array.prototype.forEach.call(arr, fn);

    } else {

        var i,
            l = arr.length;

        for (i=0; i<l; i++) {
            fn(arr[i], i, arr);
        }
        
    }
}

function getObjectLength ( obj ) {
    var i,
        result = 0;
    for (i in obj) {
        result++;
    }

    return result;
}

function isEmail ( emailStr ) {
    if(getType(emailStr) !== "string") return false;
    var reg = /^\S+@\S+\.\S+$/;
    return reg.test(emailStr);
}

function isMobilePhone ( phone ) {
    var type = getType(phone);
    if (type !== "string") {
        if (type === "number") {
            phone = phone.toString();
        } else {
            return false;
        }
    }
    var reg = /^1\d{10}$/;
    return reg.test(phone);
}


//以下几个操作Class的方法，也许可以考虑使用 classList 
function addClass ( element, newClassName ) {
    if ( !element.nodeType||getType(newClassName) !== "string" ) return false;
    if (haveClass(element, newClassName)) return false;
    if (element.className) {
        element.className += " "+ newClassName;
    } else {
        element.className = newClassName;
    }
}

function removeClass ( element, oldClassName ) {
    if ( !element.nodeType||getType(oldClassName) !== "string" ) return false;

    if (!haveClass(element, oldClassName)) return false;

    var cn = element.className.split(/\s+/);

    var index = cn.indexOf(oldClassName);
    cn.splice(index, 1);

    element.className = cn.join(" ");
}

function haveClass ( element, className ) {
    if ( !element.nodeType||getType(className) !== "string" ) return false;

    var cn = element.className.split(/\s+/);

    var result = false;

    if ( cn.indexOf(className) !== -1 ) {
        result = true;
    }

    return result;
}

function isSiblingNode ( element, siblingNode ) {
    // 可能需要用 parentElement 对IE作兼容
    return element.parentNode === siblingNode.parentNode;
}

// get position
// 这里需要获取CSS样式，所以先写一个CSS方法

function css ( element, cssName ) {
    if ( !element.nodeType||getType(cssName) !== "string" ) return null;

    if ( getComputedStyle ) {
        return getComputedStyle(element)[cssName];
    }
    // for ie   暂时不写，这里的问题是两者的CSS属性名称可能会有不同
    // else {
    //     return element.currentStyle[cssName];
    // }
}

// 在整个网页中的绝对位置
function getElementPosition ( element ) {
    if (!element.nodeType) return false;
    var left = element.offsetLeft,
        top = element.offsetTop,
        container = element.offsetParent;

    // 直接用offset不一定能获取准确位置，收到元素 position 值的影响，也会收到 <table> 元素影响
    while ( container ) {
        //两者的offsetLeft均不包含border的宽度，只能另行添加
        left += container.offsetLeft + parseFloat(css(container, 'borderLeftWidth'));
        top += container.offsetTop + parseFloat(css(container, 'borderTopWidth'));
        container = container.offsetParent;

    }
    
    return {
        x: left,
        y: top
    };
}

// 相对于viewport的位置
function getPosition ( element ) {
    if (!element.nodeType) return false;
    
    if (document.compatMode === "BackCompat"){
        var elementScrollLeft = document.body.scrollLeft,
            elementScrollTop  = document.body.scrollTop;
    } else {
        // 下面的document.body是为了兼容chrome
        var elementScrollLeft = document.body.scrollLeft||document.documentElement.scrollLeft,
            elementScrollTop  = document.body.scrollTop||document.documentElement.scrollTop; 
    }

    var result = getElementPosition(element);
    result.x -= elementScrollLeft;
    result.y -= elementScrollTop;

    return result;
}


// 选择器

// 这个代码写得有些奇怪，暂时可用
// 我觉得正则的判断有些多余，可以直接通过selector[0]进行判断

// 这里用到了reduce，可能需要自己实现一次
function $ ( selector, base ) {
    var seleStr,
        elList,
        i,
        l,
        attr,
        val;

    base = base || document;
        

    var seleList = selector.split(/\s+/);

    if (seleList.length>1) {
        return seleList.reduce(function (base, el) {
            if ( base === undefined ) return undefined;
            return $(el,base);
        }, document);
    } else {
        selector = seleList[0];
    }
    
    if ( selector.match(/#(\S+)/) ) {
        seleStr = selector.match(/#(\S+)/)[1];
        return base.getElementById(seleStr);
    }

    else if ( selector.match(/\.(\S+)/) ) {
        seleStr = selector.match(/.(\S+)/)[1];
        elList = base.getElementsByTagName('*');
        l = elList.length;
        for (i=0; i<l; i++) {
            if( haveClass(elList[i], seleStr) ) {
                return elList[i];
            }
        }
    }

    else if ( selector.match(/\[(\S+)\]/) ) {
        seleStr = selector.match(/\[(\S+)\]/)[1];

        if ( seleStr.indexOf('=') === -1 ) {

            elList = base.getElementsByTagName('*');
            l = elList.length;
            for (i=0; i<l; i++) {
                if( elList[i].getAttribute(seleStr) ) {
                    return elList[i];
                }
            }
        } else {
            attr = seleStr.match(/(\S+)\s*=\s*(\S+)/)[1];
            val = seleStr.match(/(\S+)\s*=\s*(\S+)/)[2];
            elList = base.getElementsByTagName('*');
            l = elList.length;
            for ( i=0; i<l; i++ ) {
                if ( elList[i].getAttribute(attr) === val ) {
                    return elList[i];
                }
            } 
        }
    }
    else {
        seleStr = selector.match(/(\S+)/)[1];
        return base.getElementsByTagName(seleStr)[0];
    }



}


// 事件
// 主要是兼容问题
function addEvent ( element, event, listener ) {
    if (!element || !element.nodeType) return false;

    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else {
        element.attachEvent('on'+event, listener);
    }
}

function removeEvent ( element, event, listener ) {
    if ( !element || !element.nodeType ) return false;

    if ( element.removeEventListener ) {
        element.removeEventListener(event, listener, false);
    } else {
        element.detachEvent ('on'+event, listener);
    }
}

function addClickEvent ( element, listener ) {
    return addEvent(element, 'click', listener);
}

function addEnterEvent ( element, listener ) {
    addEvent(element, 'keypress', function (e) {
        if ( e.keyCode === 13) {
            listener(e);
        }
    });
}

function delegateEvent ( element, tag, eventName, listener ) {

    addEvent(element, eventName, function(e){

        if ( e.target && e.target.nodeName.toLowerCase() === tag ) {
            listener(e);
        }
    });
}

// 兼容两种方式，第一个参数是node或string都可以

function generate ( fn ) {
    return function () {
        if (arguments[0].nodeType) {
            fn.apply(null, arguments);
        } else {
            arguments[0] = $(arguments[0]);
            fn.apply(null, arguments);
        }
    }
}

// 这样写存在一点问题，就是这几个函数的参数都不明确，length为0
// 这么做的另一个问题是有闭包存在
// 关于这里的做法，可以参看underscore
$.on = generate(addEvent);
$.un = generate(removeEvent);
$.click = generate(addClickEvent);
$.enter = generate(addEnterEvent);
$.delegate = generate(delegateEvent);


function isIE () {


    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  {    // If Internet Explorer, return version number
        return true;
        // window.alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
    } else {                 // If another browser, return 0
        alert('otherbrowser');
    }
    return false;

}

function setCookie( c_name, value, expiredays, path, domain, secure ) {
    var oCookie = c_name + "=" +escape(value);
    
    if ( expiredays ) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);

        oCookie += "; expires=" + exdate.toGMTString();
    }

    if ( path ) {
        oCookie += "; path=" + path;
    }

    if ( domain ) {
        oCookie += "; domain=" + domain;
    }

    if ( secure ) {
        oCookie += "; domain=" + secure;
    }
    
    document.cookie = oCookie;
}

function getCookie ( c_name ) {
    if ( document.cookie.length>0 ) { 
        c_start=document.cookie.indexOf(c_name + "=");
        if ( c_start!=-1 ) { 
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if ( c_end==-1 ) {
                c_end=document.cookie.length;
            }
        return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
}

function unsetCookie ( c_name, value, path, domain, secure ) {
    setCookie(c_name, '', new Date(0), path, domain, secure);
}

function animate ( element, attr, oldValue, newValue, dTime, callBack ) {
    if ( !element || !element.nodeType ) return false;

    //var oldValue = oldValue || parseInt(element.style[attr]);

    var distance = newValue - oldValue;
    var direction = distance > 0 ? 1 : -1;
    var speed = distance/(dTime*1000/30);

    var timer = setInterval(function(){
        oldValue += speed;
        element.style[attr] = oldValue + 'px';
        distance -= speed;


        if ( distance*direction <= 0 ) {
            clearInterval(timer);
            element.style[attr] = newValue + 'px';
            if (callBack) {
                callBack(element);
            }
        } 
    }, 30);
}