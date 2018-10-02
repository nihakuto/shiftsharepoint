$(document).ready(function() {
    if (lscache.get('popState') != 'shown') {
        $('#brand-bar-modal').delay(500).modal('show') // time in milliseconds
    }

    $('#brand-bar-modal button.close').click(function(e) // You are clicking the close button
        {
            $('#brand-bar-modal').modal('hide'); // Now the pop up is hiden.
        });
    $('#NoAnswer').click(function(e) // You are clicking the close button
        {
            $('#brand-bar-modal').modal('hide'); // Now the pop up is hiden.
            lscache.set('popState', 'shown', 43200) // time in MINUTES
        });
    // $('#popup-container').click(function(e) {
    //     $('#brand-bar-modal').modal('hide');
    // });

    $('.brand-btn').click(function(){
        $('#brand-bar-modal').modal('hide');
        lscache.set('popState', 'shown', 43200) // time in MINUTES
    });
});
