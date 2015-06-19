function hide ( element ) {
    if ( !element || !element.nodeType ) return false;

    removeClass(element, 'active');
}

function show ( element ) {
    if ( !element || !element.nodeType ) return false;

    addClass(element, 'active');
}

//goRight($("#testbox"), 0, 100, hide);

function cAnimate ( current, next, dd ) {
    animate(current, 'left', 0, -dd, 1, hide);
    next.style.left = dd + 'px';
    show(next);
    animate(next, 'left', dd, 0, 1)
}


function initCarousel ( option ) {
    var container, elList, dd;

    container = $('#carousel');
    elList    = [].slice.call(container.getElementsByTagName('div'));
    var dd    = parseInt(container.offsetWidth)*option.direction;

    if ( option.direction === -1 ) {
        elList = elList.reverse();   
    }

    each(elList, hide);
    show(elList[0]);
    elList[0].style['left'] = 0;

    timer = setInterval(function () {
        var now = $('.active'),
            index = elList.indexOf(now),
            nextIndex;

        if ( !option.loop && index === elList.length-1 ) {
            clearInterval(timer);
        } else {
            nextIndex = index === elList.length-1 ? 0 : index+1;
            cAnimate(now, elList[nextIndex],dd);
        }
        
    },option.dTime);

}

function clickHandle (e) {
    var option;
    option = {
        direction: parseInt($('#direction').value),
        loop:      $('#loop').value === "true",
        dTime:     parseInt($('#d_time').value)*1000
    }

    clearInterval(timer);

    initCarousel(option);
}

var timer;

function init () {
    var option = {
        direction: 1,
        loop: true,
        dTime: 2000
    }
    initCarousel( option );
    $.click('#btn', clickHandle);
}

init();