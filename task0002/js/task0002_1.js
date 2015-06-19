function showAlarm () {
    $("#alarm").style.display = "block";
}

function hideAlarm () {
    $("#alarm").style.display = "none";
}

function clickHandle (e) {
    var input = $("#input"),
        output,
        iString,
        iArr,
        uArr,
        oString;

    iString = input.value;
    iArr = iString.split(/\s*[，,、;；\s]\s*/);
    
    if ( !iString || iArr.length > 10 ) {
        showAlarm();
        return false;
    }

    output  = $("#output");
    uArr    = uniqArray(iArr);  // 这里没有\n是因为被\s包括了
    

    oString = "";

    each(uArr, function(el, index){
        //oString += index===uArr.length-1 ? trim(el) : trim(el) + "、 ";
        oString += "<input type='checkbox'>" + trim(el) ;
        oString += index === uArr.length-1 ? "" : "</br>";
    });

    output.innerHTML = oString;
    hideAlarm();
}


$.click("#btn",clickHandle);

// 下面这句本来是用于方便输入的，后面的练习要求使用textarea，不方便再绑回车事件了
$.enter("#input",clickHandle);

