// var express = require('express');
// var request = require('request');
// var cheerio = require('cheerio');
// var app = express()

var request = require('request');
var cheerio = require('cheerio');

days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
pools = {
    'Aloha': 3,
    'Beaverton': 15,
    'Conestoga': 12,
    'Harman': 11,
    'Raleigh': 6,
    'Somerset': 22,
    'Sunset': 5,
    'Tualatin Hills': 2
};
for (pool in pools) {
    var url = 'http://www.thprd.org/activities/schedules/aquatic-fitness-water-fitness-class?cs_id=' + pools[pool];

    request(url, (function(pool) { return function(err, resp, body) {
        $ = cheerio.load(body);
        $('#location_calendar_id .location--calendar_events').each(function(day) {
            $(this).find('.location--calendar_event_title').each(function() {
                event = $(this).text().trim().replace(/\s\s+/g, ',').split(',');
        console.log(event[0]);
                if (event.length >= 2 && (event[1].match(/open swim/i) || event[1].match(/family swim/i)))
                    console.log(pool + ',' + days[day] + ',' + event[0] + ',' + event[1]);
            });
        });
    }})(pool));
}