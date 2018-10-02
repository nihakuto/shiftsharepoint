$(document).ready(function() {
    if (lscache.get('popState') != 'shown') {
        $('#brandmodal').delay(500).modal('show') // time in milliseconds
    }

    $('#brandmodal button.close').click(function(e) // You are clicking the close button
        {
            $('#brandmodal').modal('hide'); // Now the pop up is hiden.
        });
    $('#textclosebtn').click(function(e) // You are clicking the close button
        {
            $('#brandmodal').modal('hide'); // Now the pop up is hiden.
            lscache.set('popState', 'shown', 43200) // time in MINUTES
        });
    // $('#popup-container').click(function(e) {
    //     $('#brandmodal').modal('hide');
    // });

    $('.brand-btn').click(function(){
        $('#brandmodal').modal('hide');
        lscache.set('popState', 'shown', 43200) // time in MINUTES
    });
});
