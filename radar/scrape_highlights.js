var fs = require('fs');
var json2csv = require('json2csv').Parser;
var request = require('request');
var cheerio = require('cheerio');
const chalk = require('chalk');

sitelist = [ // COPY LIST OF URLS HERE
    "http://digitaldetoxholidays.com/","https://www.finery.com/","https://www.ebayinc.com/stories/blogs/tech/interactive-visual-search/","https://www.wasteless.co/","https://www.amazon.com/Dash-Buttons/b?ie=UTF8&node=10667898011","https://www.munchingmongoose.co.za/","http://www.eyalter.com/en/tunnel-decision/","https://news.sap.com/2015/03/young-old-powerful-combination/","https://www.bitc.org.uk/resources-training/resources/impact-stories/ageing-workforce-award-barclays","https://www.thebodyshop.com/en-us/about-us/against-animal-testing","http://www.geltor.com/n-collage/","https://www.poulehouse.fr/","https://www.quorn.co.uk","https://www.marksandspencer.com/c/food-to-order/adventures-in-food/plant-kitchen","http://crussh.com/powered-by-plants","https://www.tesco.com/groceries/en-GB/zone/wicked-kitchen/","https://www.beyondmeat.com/","https://www.undercurrentnews.com/2017/07/28/tesco-collaborates-with-turkish-bass-bream-farmers-uk-processors-on-new-humane-slaughtering-method/","https://www.adweek.com/brand-marketing/story-behind-one-most-beautiful-real-moments-advertising-158478/","https://sonderpeople.com/","https://edition.cnn.com/travel/article/aeromexico-dna-discount-travel-ad-video/index.html","https://www.thequint.com/lifestyle/life/ariels-share-the-load-campaign-gender-disparity-video","https://driving.ca/bmw/7-series/auto-news/news/how-it-works-bmw-gesture-control","https://www.leapmotion.com/","http://www.inui-studio.com","https://www.slu.edu/news/2018/august/slu-alexa-project.php","https://www.goodnes.com/","https://atap.google.com/jacquard/","https://www.cloudflare.com/learning/dns/what-is-1.1.1.1/","http://www.gifts-today.co.uk/news/carrefour_launches_afterwork_pickup_point_for_belgian_office_workers.aspx","http://www.carrefour.com/current-news/carrefour-drive-opens-a-first-pick-up-point-on-a-technology-campus-in-belgium","https://www.workwell.io/","https://medium.com/@jinghanhao/experiencing-new-retail-in-china-hema-fresh-a5ba4c94da22","https://www.inc.com/bill-murphy-jr/amazon-is-recruiting-entrepreneurs-to-local-start-delivery-companies-heres-why-i-think-some-people-could-get-rich.html","https://econsultancy.com/11-examples-of-marketing-campaigns-starring-youtubers/","https://tubularlabs.com/","https://www.eatizz.com/en/","https://www.ibm.com/blockchain/solutions/food-trust","http://www.emulsar.com/","https://www.cogap.de/en","https://www.nutrinohealth.com/","https://thea2milkcompany.com/","https://www.traxretail.com/","https://www.eyeconic.com/help-me/virtual-try-on","https://www.warbyparker.com","https://www.youtube.com/channel/UCGYyLEdGEQjVVfwlzOB5Kng","https://www.sensei.tech/","https://www.30secondstofly.com/","https://shelf.ai/","https://www.bulknationusa.com/","http://smartflowersolar.com/","http://solubag.cl/","https://www.ypack.eu/","https://blog.ambrosus.com/in-depth-the-madagascar-bourbon-vanilla-supply-chain-on-amb-net-7f42ab0f5c9e","https://ambrosus.com/","https://www.seafoodsource.com/news/environment-sustainability/blockchain-trialed-for-sea-cucumber-traceability-in-japan","https://www.nutrasign.io/en/","https://www.sourcemap.com/","https://www.food-interrupted.com/","https://www.thehersheycompany.com/en_us/whats-inside.html","https://www.whatsinmyfood.com/","https://digit.co/","https://www.uber.com/en-CA/blog/biggame/","https://vue.ai/ai-stylist/","https://www.smartaisle.io/","https://www.tastry.com/","https://www.advancingretail.org/solutions/caper","https://www.adweek.com/agencies/hulu-reveals-the-strategy-behind-its-partnership-with-instagrams-viral-world-record-egg/","https://www.theverge.com/2017/4/12/15259400/burger-king-google-home-ad-wikipedia","https://www.kelloggs.com/en_US/brands/happy-inside.html#num=12","https://www.forbes.com/sites/walterloeb/2016/08/08/best-buy-focuses-on-shop-in-shop-sales-and-is-making-changes-for-growth/#66875e575bca","http://fortune.com/2016/09/22/pepsico-restaurant-kola-house/","https://www.greenbiz.com/article/loops-launch-brings-reusable-packaging-worlds-biggest-brands","https://www.splosh.com/","https://www.festfoods.com/blog/2-new-cheese-snacks-are-grate-go","https://thesourcebulkfoods.com.au","https://allbulkfoods.com","https://bulkboxfoods.com","https://www.startup.si/en-us/startup/151/vinegar-and-ketchup-as-innovative-functional-foods","https://luckyironfish.com","https://wholifoods.com/","https://lrmonline.com/news/keeping-up-with-animation-trends-through-pixar-university/","https://axonify.com","https://www.monsterinsights.com/","https://www.booking.com/searchresults.html?aid=397594;label=gog235jc-1DCAEoggI46AdIH1gDaLsBiAEBmAEfuAEXyAEM2AED6AEB-AECiAIBqAID;sid=17c8ff66a97e2cdeb05450afd5a105c1;dest_id=-2140479;dest_type=city;highlighted_hotels=497786;nflt=ht_id%3D214%3Bht_id%3D219%3Bht_id%3D213%3Bht_id%3D229%3Bht_id%3D216%3Bht_id%3D209%3Bht_id%3D223%3Bht_id%3D212%3Bht_id%3D227%3Bht_id%3D215%3Bht_id%3D201%3Bht_id%3D208%3Bht_id%3D230%3Bht_id%3D232%3Bht_id%3D210%3Bht_id%3D220%3Bht_id%3D222%3Bht_id%3D224%3Bht_id%3D228;bhc_from_index=1;bhc_from_index=1","http://europe-re.com/fmo-pop-up-concept-store-opening-in-gothenburg-se/65770","https://www.thefomofactory.com/","https://www.beachub.com/work","https://www.wework.com/locations","https://werk.co/","https://www.knotel.com","https://sweatco.in/","https://www.netflix.com/pt-en/title/80988062","http://www.ynap.com/news/net-a-porter-mr-porter-announce-enhanced-personal-shopping-services-for-top-customers/","https://olioex.com/","https://www.youtube.com/watch?v=IIW3l-ENHdA","https://www.businessoffashion.com/articles/bof-exclusive/inside-farfetchs-store-of-the-future","https://movingworlds.org/international-corporate-volunteering","https://pay.google.com","https://brandless.com/","https://www.youtube.com/watch?v=26qmJzTCRG4","https://www.realfoodrealstories.org/","https://www.youtube.com/playlist?list=PLtF-ZfyeXJcew2fYXmaLEdggPdKdjn7kL","https://www.joinforge.com/","https://www.thenational.ae/business/economy/carrefour-s-new-school-will-train-2-500-managers-for-the-digital-age-of-retail-1.821752","https://www.compt.io/?ref=betalist","https://betalist.com/startups/wemonty","https://www.miele.co.uk/domestic/1563.htm?info=200107190-ZPV","https://www.bloomberg.com/news/articles/2018-11-05/senior-citizens-are-replacing-teenagers-at-fast-food-joints?srnd=premium","https://www.udemy.com","https://www.skillshare.com/","https://www.bizjournals.com/bizwomen/news/latest-news/2018/06/craft-retailer-joann-tests-new-store-concept.html","https://www.roam.co/business","https://www.theassemblage.com/","https://retaildesignblog.net/2018/12/14/a-new-spot-for-digital-creators-in-warsaw/","https://www.toptal.com/careers","https://youtu.be/NBYsK571vF0","https://www.forbes.com/sites/elizabethrushe/2018/11/22/the-beyond-burger-is-now-available-at-tesco-the-uks-largest-supermarket/#260250791461","https://www.apyball.com/","https://www.mcdonalds.pt/ementa/produtos/mcveggie/","https://www.mobilemarketer.com/news/marriott-makes-more-room-for-chatbots-to-enhance-guest-experiences/510117/","https://www.lemonade.com/","https://www.walmart.com/cp/1908812?u1=IS,SofADaVergaraJustMadetheUnder-$40JeansYourButtHasAlwaysWanted,lreilly805,FAS,ART,3417806,201902,I&oid=645206.1&wmlspartner=93xLBvPhAeE&sourceid=29947390703266111865&affillinktype=10&veh=aff","https://www.news.com.au/lifestyle/food/drink/cocacola-launches-new-adult-drink-that-mixes-coffee-with-soft-drink/news-story/b6fd65b314ea2c92ced28824b47df549?utm_source=DesignTAXI&utm_medium=DesignTAXI&utm_term=DesignTAXI&utm_content=DesignTAXI&utm_campaign=DesignTAXI","https://www.kickstarter.com/projects/67420768/mim-x-the-first-smartwatch-with-invisible-display","https://www.jnsq.com/","https://www.newscientist.com/article/2190259-ai-created-images-of-food-just-by-reading-the-recipes/","https://techcrunch.com/2019/01/29/facebook-project-atlas/","https://www.stryyk.com/","http://www.jackdanielscoffee.com/","https://www.arket.com/en_eur/about.html","https://www.sap.com/products/batch-product-traceability.html","https://issuu.com/fashionrevolution/docs/fr_fashiontransparencyindex2018?e=25766662/60458846","https://bettercotton.org/","https://www.weswap.com/en/","https://www.eurowag.com/pt-pt/reembolsos-de-impostos/","https://which-50.com/alipay-and-tourism-australia-trial-sydney-city-card-for-chinese-tourists/","https://www.thetimes.co.uk/article/ask-james-dyson-jfrhm8nchzg","https://www.standardcognition.com/app/","https://www.functionofbeauty.com/about/","https://prose.com/"
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
                    fs.writeFile('out.csv', csv, 'utf8', (err) => {  
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