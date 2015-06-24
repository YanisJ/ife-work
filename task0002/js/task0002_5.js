function downHandle ( e ) {
    var tar      = e.target,
        position = getPosition( tar ),
        left     = position.x,
        top      = position.y,
        x        = e.clientX,
        y        = e.clientY;

    function moveHandle ( e ) {

        left += e.clientX - x;
        top  += e.clientY - y;

        x = e.clientX;
        y = e.clientY;


        css( tar, {
            'left': left + 'px',
            'top': top + 'px'
        } );
    }
    
    function upHandle ( e ) {
        tar.removeAttribute('style');

        $.un( document, 'mousemove', moveHandle );
        $.un( document, 'mouseup', upHandle );

        if ( tar.parentNode === $('#b1') &&left>762 && left<1062 && top>60 && top<530) {
            // 912 - 180 + 30 = 762
            // 912 + 180 - 30 = 1062
            // 100 - 60 + 20 = 60
            // 100 + 450 - 20 = 530
            $('#b2').appendChild(tar);
        }

        if ( tar.parentNode === $('#b2') &&left>182 && left<482 && top>60 && top<530) {
            // 332 -180 + 30 = 182
            // 482
            $('#b1').appendChild(tar);
        }
    }   

    
    css( tar, {
        'position': 'absolute',
        'left': left + 'px',
        'top': top + 'px'
    } );

    $.on( document, 'mousemove', moveHandle );

    $.on( document, 'mouseup', upHandle );
}


$.delegate( '#b1', 'span', 'mousedown', downHandle );
$.delegate( '#b2', 'span', 'mousedown', downHandle );
