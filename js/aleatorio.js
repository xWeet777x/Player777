var shuffle = function( el ) {
 var i = el.length, j, tempi, tempj;
 if ( i == 0 ) return el;
 while ( --i ) {
    j       = Math.floor( Math.random() * ( i + 1 ) );
    tempi   = el[i];
    tempj   = el[j];
    el[i] = tempj;
    el[j] = tempi;
 }
}

var arr = jQuery('.tab').find('.album');
shuffle( arr );
jQuery('.tab').html( arr );
