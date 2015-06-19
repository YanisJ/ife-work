function showAlarm () {
    $("#alarm").style.display = 'block';
}

function hideAlarm () {
    $("#alarm").style.display = 'none';
}

function countDown ( eDay, oDiff ) {
    var timer;

    computeTime(oDiff);     //确保点击即会出现倒计时

    timer = setInterval(function(){
        var now;
        now = new Date();
        differ = eDay - now;
        if ( differ < 1000 ) {
            clearInterval(timer);
        }
        computeTime(differ);
    }, 1000);
    
}

function renderTime ( tObj ) {
    $("#output").innerHTML =   tObj.d + "天 " 
                       + tObj.h + "小时 "
                       + tObj.m + "分 "
                       + tObj.s + "秒";
}

function computeTime ( differ ) {

    var result = {};

    result.d = parseInt(differ / 1000 / 60 / 60 / 24);
    result.h = parseInt(differ / 1000 / 60 / 60 % 24);
    result.m = parseInt(differ / 1000 / 60 % 60);
    result.s = parseInt(differ / 1000 % 60);

    renderTime(result);
}

function clickHandle () {
    var str,
        dArr,
        eDay,
        differ;

    str = $("#input").value;

    dArr = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    eDay = new Date(dArr[1], dArr[2]-1, dArr[3]);

    differ = eDay - new Date();

    if ( !dArr || differ < 0) {
        showAlarm();
        return false;
    }



    hideAlarm();

    countDown(eDay, differ);
}

function init () {
    hideAlarm();
    $("#input").focus();
    $.click("#btn", clickHandle);
    $.enter("#input", clickHandle);
}

init();