var fs = require('fs');
var json2csv = require('json2csv').Parser;
var request = require('request');
var cheerio = require('cheerio');
const chalk = require('chalk');

sitelist = [ // COPY LIST OF URLS HERE
    "https://www.mcdonalds.pt/ementa/produtos/mcveggie/"
];
var metalist = [];

function crawl(callback) {
    progress = sitelist.length;
    for (site in sitelist) {
        // var url = 'http://www.thprd.org/activities/schedules/aquatic-fitness-water-fitness-class?cs_id=' + pools[pool];
        var url = sitelist[site];

        request(url, (function(site) { return function(err, resp, body) {
            if (body) {
                console.log(site,"|",chalk.green(sitelist[site]));
                $ = cheerio.load(body);
                // DEFINE METADATA FIELDS
                titleobj = $('meta[property="og:title" i]').eq(0).attr('content');
                console.log("(1) | ",titleobj);
                if (!titleobj) {titleobj = $("title").text().trim().replace(/\s\s+/g, ',').split(',')[0]; console.log("(2) | ",titleobj);}
                descobj = $('meta[property="og:description" i]').eq(0).attr('content');
                if (!descobj) {descobj = $("meta[name='description' i]").eq(0).attr("content");}
                imgobj = $('meta[property="og:image" i]').attr('content');

                // BUILD METADATA LIST
                metalist[site]={};
                if (sitelist[site]) (metalist[site].url=sitelist[site]);
                if (titleobj) (metalist[site].title=titleobj);
                if (descobj) (metalist[site].description=descobj);
                if (imgobj) (metalist[site].image=imgobj);
            } else {console.log("html body was empty")}


            progress--;
            if (progress===0) {
                // console.log(metalist);
                json = JSON.stringify(metalist,null,2);
                fs.writeFile('./data/metadataFromURLs.json', json, 'utf8', (err) => {  
                    if (err) throw err;
                    console.log('Metadata written to file');
                });
                 
                const fields = [];
                try {
                    const parser = new json2csv(fields);
                    const csv = parser.parse(metalist);
                    fs.writeFile('_scrapedURLs.csv', csv, 'utf8', (err) => {  
                        if (err) throw err;
                        console.log('CSV written to file');
                    });
                } catch (err) {
                  console.error(err);
                }
            };

            // console.log($("title").text().trim().replace(/\s\s+/g, ',').split(','));
            // console.log($("meta[name='description' i]").eq(0).attr("content"));

            // console.log($('meta[property="og:url"]').eq(0).attr('content'));
            // console.log($('meta[property="og:locale" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:locale:alternate" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:title" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:type" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:description" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:determiner" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:site_name" i]').eq(0).attr('content'));
            // console.log($('meta[property="og:image" i]').attr('content'));
            // console.log(metalist[sitelist[site]].title);
            console.log(chalk.red("------------------------------------------------------"));
            callback(metalist);
            // console.log($("meta[name='Viewport' i]").attr("content"));
            // console.log($("meta[name='Viewport' i]").attr("content"));
        }})(site));
    }
};

// crawl(function (result) {
//     global.test=result;
// });

// Start an IIFE to use `await` at the top level
(async function(){
    let json = await crawl(function (result) {
        global.test=result;
        // console.log(result);
    });
})();