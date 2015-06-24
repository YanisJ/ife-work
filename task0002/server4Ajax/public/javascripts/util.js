/**
 *
 * @file util.js
 *
 */



/**
 * 判断对象的数据类型
 *
 * @param {*} variable 任意类型的variable
 * @return {string} 数据类型
 */
function getType ( variable ) {
    return Object.prototype.toString.call(variable).match(/\s(.+)\]/)[1].toLowerCase();
}


/**
 * 判断变量是否是数组
 *
 * @param {*} arr
 * @return {boolean}
 */
function isArray ( arr ) {
    return getType(arr) === "array";
}


/**
 * 判断变量是否是函数
 *
 * @param {*} fn
 * @return {boolean}
 */
function isFunction ( fn ) {
    return getType(fn) === "function";
}


/**
 * 深度clone
 * 不能复制函数、正则等，这些类型会直接返回引用
 *
 * @param {*} src 任意类型待复制对象
 * @return {obj} clone处的新对象
 */
function cloneObject ( src ) {
    // 处理5中基本类型
    if ( src === undefined ) return src;

    var result;
    var srcType = getType(src);
    var typeList = ['string', 'boolean', 'number'];

    for (var i=0, l=typeList.length; i<l; i++) {
        if (srcType === typeList[i]) return src;
    }

    // 处理对象
    // 包括：
    //     日期
    //     数组
    //     普通对象
    
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

        default:
            result = src;
    }

    return result;
}


/**
 * 数组去重
 * 目前有去掉 undefined，去掉空字符串的作用
 * 可能会将这两个功能单独写一个方法
 *
 * @param {array} arr
 * @retrun {array} 
 */ 
function uniqArray ( arr ) {
    var result = [];

    each(arr,function(el){
        if (el !== undefined && el !== "" && result.indexOf(el) === -1){
            result.push(el);
        }
    });

    return result;
}


/**
 * 去除string前后的空白字符
 *
 * @param {string} str
 * @retrun {string}
 */
function trim ( str ) {
    result = str.match(/^\s*(.*\S)\s*$/)[1];
    return result;
}


/**
 * 遍历数组的each函数
 * 为了应付不支持数组forEach的浏览器
 * 这个方法可以用于类数组的对象
 *
 * @param {array} arr 被遍历的数组
 * @param {function} fn 对数组每个元素执行的函数
 */
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

/**
 * 获取对象第一层元素的数量
 *
 * @param {object} obj 对象
 * @return {number} 元素数量
*/
function getObjectLength ( obj ) {
    var i,
        result = 0;
    for (i in obj) {
        result++;
    }

    return result;
}


/**
 * 判断字符串是否为邮箱地址
 *
 * @param {string} emailStr 待判断字符串
 * @return {boolean}
*/
function isEmail ( emailStr ) {
    if(!emailStr || getType(emailStr) !== "string") return false;
    var reg = /^\S+@\S+\.\S+$/;
    return reg.test(emailStr);
}


/**
 * 判断字符串是否为手机号
 *
 * @param {string} phone 待判断字符串
 * @return {boolean}
*/
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

/**
 * 添加class
 *
 * @param {HTMLelement} element 元素
 * @param {string} newClassName 添加的class name
 */
function addClass ( element, newClassName ) {
    if ( !element.nodeType||getType(newClassName) !== "string" ) return;
    if (!haveClass(element, newClassName)) {
        if (element.className) {
            [element.className, newClassName].join(" ");
        } else {
            element.className = newClassName;
        }
    }
}


/**
 * 删除class
 *
 * @param {HTMLelement} element 元素
 * @param {string} oldClassName 删除的class name
 */
function removeClass ( element, oldClassName ) {
    if ( !element.nodeType||getType(oldClassName) !== "string" ) return;

    if (haveClass(element, oldClassName)) {
        var cn = element.className.split(/\s+/);

        var index = cn.indexOf(oldClassName);
        cn.splice(index, 1);

        element.className = cn.join(" ");
    }

}


/**
 * 判断元素是否有某个类
 *
 * @param {HTMLelement} element 元素
 * @param {string} className 待判断类名
 * @return {boolean}
 */
function haveClass ( element, className ) {
    //if ( !element.nodeType||getType(className) !== "string" ) return false;
    if (!element.className) return false;
    
    var cn = element.className.split(/\s+/);
    var result = false;

    if ( cn.indexOf(className) !== -1 ) {
        result = true;
    }

    return result;
}


/**
 * 判断两个元素是否是兄弟元素
 *
 * @param {HTMLelement} element 元素
 * @param {HTMLelement} siblingNode 待判定兄弟元素
 * @return {boolean}
 */
function isSiblingNode ( element, siblingNode ) {
    // 可能需要用 parentElement 对IE作兼容
    return element.parentNode === siblingNode.parentNode;
}


// get position需要获取CSS样式，所以先写一个CSS方法

/**
 * 获取css属性值
 *
 * @param {HTMLelement} element 元素
 * @param {string} cssName 属性名
 * @param {string|function} value 属性值
 * @return {string} 属性值
 */
function css ( element, cssName, value ) {
    if ( !element.nodeType||getType(cssName) !== "string" ) return null;

    var isFn;

    if (value) {
        if (getType(value) === "function") {
            isFn = true;
        }

        element.style[cssName] = isFn ? value(element, css(element, cssName)) : value;
    } else {
        if ( element.currentStyle ) {
            return element.currentStyle[cssName];
        }
        
        else {
            return getComputedStyle(element)[cssName];
        }
    }
}


/**
 * 在整个网页中的绝对位置
 * 
 * @param {HTMLelement} element 元素
 * @return {object} 坐标，包含x,y
 */
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


/**
 * 相对于viewport的位置
 * 
 * @param {HTMLelement} element 元素
 * @return {object} 坐标，包含x,y
 */
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

// 这里用到了reduce，可能为了兼容需要自己实现一次
/**
 * $ mini 选择器
 * 
 * @param {string} selector tag|id|class|attribute
 * @param {HTMLelement} base 父元素 默认为document
 * @return {HTMLelement}
 */
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

        return null;
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

/**
 * 添加事件
 *
 * @param {HTMLelement} element 元素
 * @param {string} event 事件名
 * @param {function} listener 执行函数
 */
function addEvent ( element, event, listener ) {
    if (!element || !element.nodeType) return false;

    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else {
        element.attachEvent('on'+event, listener);
    }
}


/**
 * 删除事件
 *
 * @param {HTMLelement} element 元素
 * @param {string} event 事件名
 * @param {function} listener 执行函数
 */
function removeEvent ( element, event, listener ) {
    if ( !element || !element.nodeType ) return false;

    if ( element.removeEventListener ) {
        element.removeEventListener(event, listener, false);
    } else {
        element.detachEvent ('on'+event, listener);
    }
}

/**
 * 添加点击事件
 *
 * @param {HTMLelement} element 元素
 * @param {function} listener 执行函数
 */
function addClickEvent ( element, listener ) {
    return addEvent(element, 'click', listener);
}


/**
 * 添加回车事件
 *
 * @param {HTMLelement} element 元素
 * @param {function} listener 执行函数
 */
function addEnterEvent ( element, listener ) {
    addEvent(element, 'keypress', function (e) {
        if ( e.keyCode === 13) {
            listener(e);
        }
    });
}


/**
 * 事件代理
 *
 * @param {HTMLelement} element 元素
 * @param {string} tag 标签名
 * @param {string} event 事件名
 * @param {function} listener 执行函数
 */
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



/**
 * 浏览器是否为IE
 *
 * @return {boolean}
 */
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



/**
 * 设置cookie
 *
 * @param {string} c_name cookieName
 * @param {string} value  cookieValue
 * 以下参数可选
 * @param {number} expiredays 保存天数
 * @param {string} path 路径
 * @param {string} domain 域
 * @param {string} secure 
 */
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


/**
 * 获取cookie值
 *
 * @param {string} c_name cookieName
 * @return {string} 对应的cookie值
 */
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

/**
 * 删除cookie
 *
 * @param {string} c_name cookieName
 * @param {string} value  cookieValue
 * 以下参数可选
 * @param {string} path 路径
 * @param {string} domain 域
 * @param {string} secure 
 */
function unsetCookie ( c_name, value, path, domain, secure ) {
    setCookie(c_name, '', new Date(0), path, domain, secure);
}


/** Ajax
 *
 * @param {string} url
 * @param {
 *      {string} type get/post
 *      {object} data 发送的数据
 *      {function} onsuccess 成功后回调
 *      {function} onfail 失败后回调  
 * } options 相关配置     
 */
function ajax ( url, options ) {
    var xhr, data, i;
    if ( window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (options.data){
        for ( i in options.data ) {
            data = i + "=" + options.data[i]
        }
    }

    if ( options.type === 'get') {
        url += "?"+data;
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            options.onsuccess && options.onsuccess(xhr.responseText, xhr);
        } else {
            options.onfail && options.onfail();
        }
    }
    
    xhr.open(options.type, url, true);
    if (options.type === 'post' && data) {
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(data);
    } else {
        xhr.send();  
    }
}



/**
 * 运动
 *
 * @param {HTMLelement} element
 * @param {string} attr 属性名
 * @param {number} oldValue 起始值
 * @param {number} newValue 结束值
 * @param {number} dTime 运动进行时间
 * @param {function} callBack 结束后可执行的回调
 */
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