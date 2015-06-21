
// $.click('#btn1', function(){
//     ajax('userlist', {
//         type: 'get',
//         data: {
//             q: $('#input').value
//         },
//         onsuccess: function (msg, xhr){
//             alert(msg);
//         }
//     })
// });

// $.click('#btn2', function(){
//     ajax('userlist', {
//         type: 'post',
//         data: {
//             q: $('#input').value
//         }
//     });
// });

function hide ( element ) {
    if (!element || !element.nodeType) return false;
    element.style.display = 'none';
}

function show ( element ) {
    if (!element || !element.nodeType) return false;
    element.style.display = 'block';
}

function renderList ( arr ) {
    var ul = $('#list');
    ul.innerHTML = '';

    if (!arr.length) {
        hide(ul);
    } else {
        show(ul);
        each(arr, function(el) {
            ul.innerHTML += '<li>'+ el +'</li>';
        });
    }
}

function active ( element ) {
    addClass(element,'active');
}

function clearActive ( container ) {
    var children = container.children,
        l = children.length,
        i;

    for (i=0; i<l; i++) {
        removeClass(children[i],'active');
    }
}

function move ( element ) {
    clearActive($('#list'));
    active(element);
}

function select ( element ) {
    $('#input').value = element.innerHTML;
    hide($('#list'));
}

function init () {
    var list = $('#list'),
        input = $('#input');
    

    $.on(input, 'keyup', function(e) {
        if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {     // 把Enter阻止掉留作它用
            return;
        }
        ajax('userlist', {
            type: 'get',
            data: {
                q: input.value
            },
            onsuccess: function (msg, xhr){
                renderList(JSON.parse(msg));
            }
        })
    });
    
    $.delegate(list, 'li', 'mouseover', function(e){
        move(e.target);
    });
    
    $.delegate(list, 'li', 'click', function(e){
        select(e.target);
    });

    $.on(list, 'mouseout', function(e){
        clearActive(list);
    });
    
    $.enter(document, function(e){
        if (list.style.display === 'block') {
            select($('.active'));
        }
    });
    
    $.on(document, 'keydown', function(e){
        var el;
        if (e.keyCode === 40 && list.style.display === 'block') {
            el = $('.active');
            if (!el) {
                move(list.firstChild);
            } else {
                if (el.nextSibling) {
                    clearActive(list);
                    active(el.nextSibling);
                }
            }
            e.preventDefault();
        }

        if (e.keyCode === 38 && list.style.display === 'block') {
            el = $('.active');
            if (!el) {
                move(list.lastChild);
            } else {
                if (el.previousSibling) {
                    move(el.previousSibling);
                } else {
                    clearActive(list);  
                }
            }
            e.preventDefault();
        }
    });
}

init();



