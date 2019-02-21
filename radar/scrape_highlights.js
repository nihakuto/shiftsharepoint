var fs = require('fs');
var json2csv = require('json2csv').Parser;
var request = require('request');
var cheerio = require('cheerio');
const chalk = require('chalk');

sitelist = [ // COPY LIST OF URLS HERE
    "https://www.mcdonalds.pt/ementa/produtos/mcveggie/","https://www.forbes.com/sites/elizabethrushe/2018/11/22/the-beyond-burger-is-now-available-at-tesco-the-uks-largest-supermarket/#260250791461","https://www.booking.com/searchresults.html?aid=397594;label=gog235jc-1DCAEoggI46AdIH1gDaLsBiAEBmAEfuAEXyAEM2AED6AEB-AECiAIBqAID;sid=17c8ff66a97e2cdeb05450afd5a105c1;dest_id=-2140479;dest_type=city;highlighted_hotels=497786;nflt=ht_id%3D214%3Bht_id%3D219%3Bht_id%3D213%3Bht_id%3D229%3Bht_id%3D216%3Bht_id%3D209%3Bht_id%3D223%3Bht_id%3D212%3Bht_id%3D227%3Bht_id%3D215%3Bht_id%3D201%3Bht_id%3D208%3Bht_id%3D230%3Bht_id%3D232%3Bht_id%3D210%3Bht_id%3D220%3Bht_id%3D222%3Bht_id%3D224%3Bht_id%3D228;bhc_from_index=1;bhc_from_index=1","https://www.thefomofactory.com/","http://europe-re.com/fmo-pop-up-concept-store-opening-in-gothenburg-se/65770","https://www.seafoodsource.com/news/environment-sustainability/blockchain-trialed-for-sea-cucumber-traceability-in-japan","https://blog.ambrosus.com/in-depth-the-madagascar-bourbon-vanilla-supply-chain-on-amb-net-7f42ab0f5c9e","https://issuu.com/fashionrevolution/docs/fr_fashiontransparencyindex2018?e=25766662/60458846","https://www.monsterinsights.com/","https://www.wework.com/locations","https://youtu.be/NBYsK571vF0","https://www.beachub.com/work","https://www.lemonade.com/","https://www.30secondstofly.com/","https://www.mobilemarketer.com/news/marriott-makes-more-room-for-chatbots-to-enhance-guest-experiences/510117/","https://www.macrumors.com/2019/02/13/kroger-launches-kroger-pay-service/","https://www.weswap.com/en/","https://www.eurowag.com/pt-pt/reembolsos-de-impostos/","https://which-50.com/alipay-and-tourism-australia-trial-sydney-city-card-for-chinese-tourists/","https://www.goodnes.com/","https://www.theverge.com/2017/4/12/15259400/burger-king-google-home-ad-wikipedia","https://www.slu.edu/news/2018/august/slu-alexa-project.php","https://infarm.de/","http://www.growtogreen.com/","http://www.gizmag.com/fruit-silk-coating/43201/","http://www.phresh.io/index.html","http://www.madebycow.com.au/#worlds-first","https://www.indiegogo.com/projects/cupffee-the-edible-wafer-cup-for-your-coffee-innovation#/","http://www.davidideas.com/details/wikicells","https://thewaternetwork.com/article-FfV/water-soluble-packaging-f1Rl4Iex5XCR_9LD7rRjNA","http://www.vivosfilm.com/","http://solubag.cl/","http://chillcan.com/","http://www.impossiblefoods.com/faq/","http://www.goldandgreenfoods.com","http://beyondmeat.com/","https://oceanhuggerfoods.com/ahimi/","http://www.vbitesfoods.com/product/fish-free-smoked-salmon-slices-100g/","https://www.gardein.com/","http://ifoodbag.se/","http://smartflowersolar.com/","https://www.tesla.com/en_EU/solarroof?redirect=no","https://www.power-blox.com/","http://www.stem.com/","https://www.tesla.com/powerwall","http://www.physee.eu/","https://www.ibm.com/blockchain/solutions/food-trust","http://magiccandyfactory.com/events/","https://www.beeswrap.com/","https://tipa-corp.com/","https://www.packtin.com/en/","https://www.traxretail.com/","http://www.qopius.ai/","https://www.wiseshelf.com/","https://www.ses-imagotag.com/en/","https://www.displaydata.com/#Keyfacts-section","https://www.tronitag.com/us/","http://en.hanshow.com/#smart","https://www.pricer.com/","http://www.ontimesmart.com/","https://shelfierobot.com/","https://bizcargo.com/#/about","http://www.selitera.com/","https://www.sensei.tech/","https://www.advancingretail.org/solutions/caper","http://www.livello.com","https://www.aipoly.com/","https://itab.com/en/our-offer/checkout-arena/","https://ekiosk.com/en/","https://www.getmucho.com/","https://shelf.ai/","https://spoonshot.com/","https://vue.ai/ai-stylist/","https://www.tastry.com/","https://www.aquaponicsiberia.com/?lang=en","https://revibeenergy.com/","https://pro.hydrao.com/","https://www.retailquant.com/","https://eaternity.org/","https://linksquare.io/","http://www.aiconix.de/en","https://axonify.com","https://www.workwell.io/","https://www.beeapproved.co.uk/aboutus/","https://sonderpeople.com/","https://betalist.com/startups/wemonty","https://www.compt.io/?ref=betalist","http://www.morethancarrots.co.uk/","https://www.cogap.de/en","https://www.fitalety.com/","https://thea2milkcompany.com/","https://www.sourcemap.com/","https://www.thespikeapp.com/","https://emma.health/","http://www.emulsar.com/","https://www.nodoughpizza.com/","http://www.bolfoods.com","https://zveetz.com/","http://hello.keep-warranty.com/","https://oko.ai/","http://www.inui-studio.com","https://www.leapmotion.com/","https://get-nourished.com/","https://bulkboxfoods.com","https://www.menunfc.com/","https://unbabel.com/","https://www.wasteless.co/","https://www.cambridge-crops.com/","http://www.pikkart.com","http://www.trusttm.com/en/","https://luckyironfish.com","https://www.yusadrinks.com/","https://spirugrow.com/","http://inl.int/life-science/nano-for-food/","https://syngja.dk/","https://www.splosh.com/","https://www.greenbiz.com/article/loops-launch-brings-reusable-packaging-worlds-biggest-brands","https://www.dropwater.co/","http://www.framieapp.com/","https://youclap.tech/","https://olioex.com/","https://www.twoosk.com/page/about-us","https://www.joinforge.com/","https://tubularlabs.com/","https://www.beyondmeat.com/","https://www.quorn.co.uk","https://wholifoods.com/","https://cuisinesoleil.com/en/","http://algamafoods.com/","https://kriket.be/","https://seamorefood.com/","https://www.sensbar.com/en","https://www.eatizz.com/en/","https://movingworlds.org/international-corporate-volunteering","https://werk.co/","https://ambrosus.com/","https://www.nutrasign.io/en/","https://www.sap.com/products/batch-product-traceability.html","https://traace.io/","http://www.smartlogo.it/","https://uwinloc.com/","https://bettercotton.org/","https://www.toptal.com/careers","https://www.knotel.com","https://www.smartaisle.io/","https://www.bitext.com/","https://www.3d-berlin.com/en/","https://www.eyeconic.com/help-me/virtual-try-on","https://www.goinstore.com/","http://ecodyger.com/","https://www.elvisandkresse.com/","http://www.greenjournal.co.uk/2015/07/transparent-solar-panels-2/","https://www.curbed.com/2017/6/19/15828644/solar-paint-renewable-energy-rmit-university","http://www.channelnewsasia.com/news/singapore/nus-scientists-roll-out-diabetic-friendly-bread-8184586","http://www.deakin.edu.au/research/research-news/articles/scientists-unscramble-egg-allergens","https://www.nanowerk.com/news/newsid=1441.php","http://eot.pt/en/","https://www.docplanner.com/about-us","https://www.magnomics.pt/","https://www.mydxlife.com/","https://kubo.education/","https://thebookofeveryone.com/","http://www.ionseed.eu/","https://situm.es/en","https://www.nevisq.com/home","http://www.cloqwerk.com/home.html","http://swiftwallet.io/","https://pingpilot.com/","https://www.optionizr.com/","https://www.themotion.com/","https://www.omknee.com/","https://agrimp.com/","http://gcourage.com/","https://www.flow.ai/","https://kami.ai/","https://www.coolerscreens.com/","https://www.affectiva.com/","https://profila.com/","https://www.adpack.tv/","http://www.arpa.tech/indexe.html","https://www.publico.pt/2019/01/11/p3/noticia/spray-portugues-quer-subsituir-o-plastico-na-conservacao-de-alimentos-1857507#gs.yzRGWbEh","https://www.naturalproductsglobal.com/europe/unilver-adds-vegetarian-butcher-to-growing-plant-based-portfolio/","https://www.marketwatch.com/story/kroger-rolls-out-driverless-cars-to-deliver-groceries-2018-12-18?fbclid=IwAR3_YflqEDM1O38t98aCk6ro1OT_KJ_kbVVGwPw-BXHV8iTlfbMssDSZ09A"
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