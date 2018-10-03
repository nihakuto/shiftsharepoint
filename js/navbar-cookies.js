$(document).ready(function() {
    var expirytime = 43200; // time in MINUTES
    if (lscache.get('popState') != 'shown') {
        $('#brand-bar-modal').delay(500).modal('show') // time in milliseconds
    }

    $('#brand-bar-modal button.close').click(function(e) // You are clicking the close button
        {
            $('#brand-bar-modal').modal('hide'); // Now the pop up is hiden.
        });
    $('#NoAnswer').click(function(e) // You are clicking the close button
        {
            var clickedID = this.id;
            $('#brand-bar-modal').modal('hide'); // Now the pop up is hiden.
            lscache.set('popState', 'shown', expirytime) // time in MINUTES
            lscache.set('savedBrandID', clickedID, expirytime) // passed to Google Tag Manager
        });
    // $('#popup-container').click(function(e) {
    //     $('#brand-bar-modal').modal('hide');
    // });

    $('.brand-btn').click(function(){
        var clickedID = this.id;
        $('#brand-bar-modal').modal('hide');
        lscache.set('popState', 'shown', expirytime) // time in MINUTES
        lscache.set('savedBrandID', clickedID, expirytime) // passed to Google Tag Manager
    });
});
