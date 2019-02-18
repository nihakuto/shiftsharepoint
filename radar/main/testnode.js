
var fs = require('fs');
// var Papa = require('papaparse');
// const file = fs.createReadStream('../data/urlsForMetaScrape.csv');
// var count = 0; // cache the running count
// global.sitelist = [];
// Papa.parse(file, {
//     // download: true,
//     header: true,
//     // complete: function(results) {
//     //     sitelist = results.data;
//     //     console.log(results);
//     // }
//     worker: true, // Don't bog down the main thread if its a big file
//     step: function(result) {
//         // do stuff with result
//     },
//     complete: function(results, file) {
//         global.sitelist = results.data;
//         console.log(results);
//         console.log('parsing complete read', count, 'records.'); 
//     }
// });



var obj = {
   table: []
};
obj.table.push({id: 1, square:2});


sitelist = [
// {"url":"https://www.stitchfix.com/women"},
// {"url":"https://www.forbes.com/sites/callyrussell/2019/01/10/will-2019-be-the-year-clothing-subscription-takes-over/#13d914d32675/"},
// {"url":"https://www.lorealparisusa.com/beauty-magazine/makeup/makeup-looks/makeupgenius-changes-makeup-application-forever.aspx"},
// {"url":"https://sephoravirtualartist.com/landing_5.0.php?country=US&lang=en&x=&skintone=&currentModel="},
// {"url":"https://augmented.reality.news/news/mac-cosmetics-stores-get-ar-makeover-with-virtual-try-mirrors-0181153/"},
// {"url":"https://www.eyeconic.com/help-me/virtual-try-on"},
// {"url":"https://en.wikipedia.org/wiki/Augmented_reality"},
// {"url":"https://en.wikipedia.org/wiki/Sentiment_analysis"},
// {"url":"https://en.wikipedia.org/wiki/Near-field_communication"},
// {"url":"https://en.wikipedia.org/wiki/Chroma_key"},
{"url":"https://www.isizeyou.com/#/"},
{"url":"http://modiface.com/"},
{"url":"http://sensemi.com/"},
{"url":"https://www.youtube.com/watch?v=R60rAQCqkeM"},
// {"url":"https://medium.com/@jinghanhao/experiencing-new-retail-in-china-hema-fresh-a5ba4c94da22"},
// {"url":"https://www.akumina.com/office-365/akumina-helping-to-enable-retail-execution-at-nrf-2018-retails-big-show/"},
// {"url":"https://behavioralsignals.com/behavioral-patterns/"},
// {"url":"https://medium.com/@jinghanhao/experiencing-new-retail-in-china-hema-fresh-a5ba4c94da22"},
// {"url":"https://www.inc.com/bill-murphy-jr/amazon-is-recruiting-entrepreneurs-to-local-start-delivery-companies-heres-why-i-think-some-people-could-get-rich.html"},
// {"url":"https://www.youtube.com/channel/UCOYTXGVqi_SKtbO6X6-baJQ"},
// {"url":"https://tubularlabs.com/"},
// {"url":"https://www.eatizz.com/en/"},
// {"url":"https://exoskeletonreport.com/product-category/exoskeleton-catalog/industrial/"},
// {"url":"https://www.ibm.com/blockchain/solutions/food-trust"},
// {"url":"http://www.emulsar.com/"},
// {"url":"https://www.cogap.de/en"},
// {"url":"https://thea2milkcompany.com/"},
// {"url":"https://www.nutrinohealth.com/"},
// {"url":"https://food.ndtv.com/food-drinks/robots-used-for-packaging-processing-fruits-and-veggies-1208177"},
// {"url":"https://www.rw3.com/image-recognition-at-the-shelf-the-solution-to-solve-on-shelf-availability/"},
// {"url":"https://www.eyeconic.com/help-me/virtual-try-on"},
// {"url":"https://www.warbyparker.com"},
// {"url":"https://www.prnewswire.com/news-releases/israel-s-shufersal-the-first-supermarket-chain-to-offer-customers-amazon-go-experience-with-trigo-vision-872123282.html"},
// {"url":"https://www.30secondstofly.com/"},
// {"url":"https://shelf.ai/"},
// {"url":"https://www.wired.co.uk/article/energy-agrivoltaic-farms"},
// {"url":"https://news.energysage.com/tesla-solar-panel-roof-the-next-solar-shingles/"},
// {"url":"https://news.energysage.com/solar-panel-windows-solar-blinds/"},
// {"url":"https://www.noticiasmagazine.pt/2018/sacos-plastico-amigos-do-planeta-sim-ja-existem/ "},
// {"url":"https://olioex.com/"},
// {"url":"https://www.ypack.eu/"},
// {"url":"https://www.meyash.co/"},
// {"url":"https://www.museumoficecream.com/"},
// {"url":"https://www.meatfreemondays.com/"},
// {"url":"https://www.netflix.com/pt-en/title/80988062"},
// {"url":"https://sweatco.in/"},
// {"url":"https://www.nhs.uk/live-well/eat-well/5-a-day-what-counts/"},
// {"url":"https://www.boxed.com/"},
// {"url":"https://www.scarymommy.com/amazon-has-a-free-sample-section/"},
// {"url":"https://www.businessinsider.com/walmart-patent-shopping-cart-that-tracks-stress-levels-2018-9"}
];

// //PROCESS ALL THE DATA
const urlMetadata = require('url-metadata')
for (var i = sitelist.length - 1; i >= 0; i--) {
	metadataObj = urlMetadata(sitelist[i].url).then(
	  function (metadata) { // success handler
	    console.log(metadata)
	    // global.metadataObj = metadata;
	  },
	  function (error) { // failure handler
	    console.log(error)
	  })
	json = JSON.stringify(metadataObj,null,2);
	fs.writeFile('./data/metadataFromURLs.json', json, 'utf8', (err) => {  
	    if (err) throw err;
	    console.log('Data written to file');
	});
}

// var json = await JSON.stringify(global.metadataObj,null,2);
// fs.writeFile('./data/metadataFromURLs.json', json, 'utf8', (err) => {  
//     if (err) throw err;
//     console.log('Data written to file');
// });




// fs.readFile('../data/metadataFromURLs.json', 'utf8', function readFileCallback(err, data){
//     if (err){
//         console.log(err);
//     } else {
//     obj = JSON.parse(data); //now it an object
//     obj.table.push({id: 2, square:3}); //add some data
//     json = JSON.stringify(obj); //convert it back to json
//     fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
// }});

// urlMetadata('http://sonae.pt').then(
//   function (metadata) { // success handler
//     console.log(metadata)
//   },
//   function (error) { // failure handler
//     console.log(error)
//   })