//////////////////////////////////////////////////////////////
////////////////////////// URL params ////////////////////////
//////////////////////////////////////////////////////////////

// Get URL params
let params = new URLSearchParams(window.location.search)

// Language
let language = ['en', 'fr', 'es'].indexOf(params.get('language')) === -1 ? 'en' : params.get('language')

// Hide menu items
let hide = params.get('hide') === null ? [] : params.get('hide').split(',')

//////////////////////////////////////////////////////////////
///////////////////////// Intro setup ////////////////////////
//////////////////////////////////////////////////////////////

document.getElementById('intro-welcome').innerHTML = translations[language]['intro_welcome'];
document.getElementById('intro-unesco').innerHTML = translations[language]['intro_unesco'];
document.getElementById('intro-title').innerHTML = translations[language]['intro_title'];
document.getElementById('intro-subtext').innerHTML = translations[language]['intro_subtext'];
document.getElementById('intro-info').innerHTML = translations[language]['intro_info'];

//////////////////////////////////////////////////////////////
///////////////////////// Menu setup /////////////////////////
//////////////////////////////////////////////////////////////

// Translate
document.getElementById('menu-intro').innerHTML = common_translations[language]['menu_intro'];
document.getElementById('menu-legend').innerHTML = common_translations[language]['menu_legend'];
document.querySelectorAll('#menu-about a')[0].innerHTML = common_translations[language]['menu_about'];
document.querySelectorAll('#menu-about a')[0].setAttribute('href', common_translations[language]['menu_about_link'])
let menu_more = document.getElementById('menu-more');
menu_more.innerHTML = common_translations[language]['menu_more'] + menu_more.innerHTML;
let menu_share = document.getElementById('menu-share');
menu_share.innerHTML = common_translations[language]['menu_share'] + menu_share.innerHTML;
document.querySelectorAll('#menu-more-constellation a')[0].innerHTML = common_translations[language]['menu_more_constellation'];
document.querySelectorAll('#menu-more-biome a')[0].innerHTML = common_translations[language]['menu_more_biome'];
document.querySelectorAll('#menu-more-domain a')[0].innerHTML = common_translations[language]['menu_more_domain'];
document.querySelectorAll('#menu-more-threat a')[0].innerHTML = common_translations[language]['menu_more_threat'];
document.querySelectorAll('#menu-more a').forEach(e => e.setAttribute('href', e.getAttribute('href') + '?language=' + language));
let menu_language = document.getElementById('menu-language');
menu_language.innerHTML = common_translations[language]['menu_language'] + menu_language.innerHTML;

// Share
let share_url = window.location.protocol + '//' + window.location.host + window.location.pathname;
let share_buttons = document.querySelectorAll('.st-custom-button');
for (let button of share_buttons) {
    button.setAttribute('data-url', share_url)
}

// Hide
hide.push('more-threat', 'language-' + language);
hide = [...new Set(hide)]; // unique values
for (let item of hide) {
    let e = document.getElementById('menu-' + item);
    if (e) e.setAttribute('style', 'display: none;');
}

//////////////////////////////////////////////////////////////
//////////////////////// Legend setup ////////////////////////
//////////////////////////////////////////////////////////////

document.getElementById('modal-legend-img').setAttribute('src', 'img/Legend-Threat_' + language + '.png');

//////////////////////////////////////////////////////////////
////////////////////// Switch language ///////////////////////
//////////////////////////////////////////////////////////////

function switch_language() {
    let l = this.getAttribute('id').substr(-2);
    window.location.href = window.location.pathname + '?language=' + l;
}

document.querySelectorAll('#menu-language li').forEach(e => e.addEventListener('click', switch_language));

//////////////////////////////////////////////////////////////
///////////////////////// Modal setup ////////////////////////
//////////////////////////////////////////////////////////////

//From https://github.com/benceg/vanilla-modal

// Intro modal
let intro_modal = new VanillaModal.default({
    onBeforeOpen: function() {
        // Add intro class
        document.getElementById('container-modal').classList.add('modal-intro');
    },
    onClose: function() {
        // Remove intro class
        document.getElementById('container-modal').classList.remove('modal-intro');
        // Show menu icon
        document.getElementById('menu').style.display = 'inline-block';
        // Show legend
        if (show_legend_modal) {
            show_legend_modal = false;
            legend_modal.open('#legend-modal');
        }
    }
});

// Start with the intro modal
let intro_modal_open = function() {
    document.getElementById('menu').style.display = 'none';
    intro_modal.open('#intro-modal');
    document.cookie = 'dive_threat_show_intro=false';
}
let show_intro_modal = document.cookie.includes('dive_threat_show_intro=false') ? false : true;
if (show_intro_modal === true) intro_modal_open();
document.getElementById('menu-intro').addEventListener('click', intro_modal_open);

// Node modal
let node_modal = new VanillaModal.default()
node_modal_init_scroll();

// Legend Modal
let show_legend_modal = false;
let legend_modal = new VanillaModal.default({
    onBeforeOpen: function() {
        document.querySelectorAll('.modal-content')[0].setAttribute('style', 'max-width: 1400px;');
    },
    onClose: function() {
        document.querySelectorAll('.modal-content')[0].removeAttribute('style');
    }
});
let legend_modal_open = function() {
    if (document.querySelector('.modal-intro') !== null) {
        show_legend_modal = true;
        intro_modal.close();
    } else {
        legend_modal.open('#legend-modal');
    }
}
document.getElementById('menu-legend').addEventListener('click', legend_modal_open);
document.getElementById('intro-legend').addEventListener('click', legend_modal_open);

//////////////////////////////////////////////////////////////
///////////////////////// Chart setup ////////////////////////
//////////////////////////////////////////////////////////////

//Div that will hold the chart
let container = d3.select("#chart")

//Set-up the chart - it's not drawn yet
let w = container.node().parentNode.clientWidth
let h = Math.max(window.innerHeight, container.node().parentNode.clientHeight)
let size = findGoodSize(w, h)
let threatVisual = createThreatVisual()
    .width(size)
    .height(size)
    // .scaleFactor(2)
    // .nodeRadius(15) //Set the radius of the nodes, if you get a broken visual, try adding or subtracting 0.1
    .showModal(createModal)

//////////////////////////////////////////////////////////////
////////////// Read in the data - Draw the chart /////////////
//////////////////////////////////////////////////////////////

//Make sure the fonts are loaded that are in the visual
let font1 = new FontFaceObserver("Oswald", { weight: 300 })
let font2 = new FontFaceObserver("Oswald", { weight: 400 })
let font3 = new FontFaceObserver("IBM Plex Serif", { weight: 400 })

let promises = []
promises.push(d3.json("../data/graph_edited_" + language + ".json?v=" + version))
promises.push(font1.load())
promises.push(font2.load())
promises.push(font3.load())

Promise.all(promises).then(values => {
    ////////////////////// Data preparation //////////////////////
    graph = values[0]
    let nodes = prepareNodes(graph)
    let edges = prepareEdges(graph)
    ////////////////////// Create the visual //////////////////////
    container.call(threatVisual, nodes, edges, language, getFilteredData)
})//promises

//////////////////////////////////////////////////////////////
////////////////////////// When ready ////////////////////////
//////////////////////////////////////////////////////////////

function getFilteredData(nodes) {
    // console.log(nodes)
}//function getFilteredData

//////////////////////////////////////////////////////////////
////////////////////// Page resize actions ///////////////////
//////////////////////////////////////////////////////////////

let current_width = window.innerWidth
d3.select(window).on("resize", function() {
    //Only resize if the width is changed, not the height
    //Otherwise you get odd behavior on mobile due to URL bar appearing and disappearing
    if(window.innerWidth !== current_width) {
        current_width = window.innerWidth
        let w = container.node().parentNode.clientWidth
        let h = Math.min(window.innerHeight, container.node().parentNode.clientHeight)
        //Based on these sizes, find a good actual size of the visual
        let size = findGoodSize(w, h)

        //Update the visual
        threatVisual
            .width(size)
            .height(size)
            .resize()
    }//if
})//on resize

//Figure out a nice scaling to fit the visual on your screen - not perfected at all :S
function findGoodSize(w, h) {
    //Figure out a nice scaling to fit the visual on your screen
    let size_ratio = h / w
    let size
    size = size_ratio > 0.8 ? w : (h > 1100 ? h * 1 : h * 1.2)
    if(w > 900) size = Math.min(size, w)
    size = Math.min(size, 1210)

    return Math.round(size)
}//function findGoodSize

//////////////////////////////////////////////////////////////
////////// Functions to prepare the node & edge data /////////
//////////////////////////////////////////////////////////////

function prepareNodes(graph) {
    let nodes = []
    //Place all nodes in array instead, since that's what d3's force wants
    for(let element in graph.nodes) {
        graph.nodes[element].id = element
        nodes.push(graph.nodes[element])
    }//for i
    return nodes
}//function prepareNodes

function prepareEdges(graph) {
    let edges = graph.edges
    //Rename since d3's force needs a "source-target" pair
    edges.forEach(d => {
        d.source = d.subject
        d.target = d.object
        delete d.subject
        delete d.object
    })
    return edges
}//function prepareEdges


function downloadjson(content, fileName, contentType) {
    newcontent = JSON.stringify(content, null, 4);
    var a = document.createElement("a");
    var file = new Blob([newcontent], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
//downloadjson(myjson, 'myjson.json', 'text/plain');

// myjson = d3.json("../data/graph_edited_en.json");

// myjson.nodes.forEach(function (index){
//         if(this.type.startsWith("country")){
//             myjson.nodes.splice(index,1); // This will remove the object that first name equals to Test1
//             return false; // This will stop the execution of jQuery each loop.
//         }
//         );

// Promise.all(promises).then(values => {
//     window.myjson = values[0];
// })//promises

jQuery.getJSON("../data/graph_edited_en.json", function(json) {
    myjson = json; // this will show the info it in firebug console
});

// window.myjson = d3.json("../data/graph_edited_en.json"); //RADAR

// myjson;
console.log("/^country/");
function deletestuff(reg) {
    i=0;
    for (x in myjson.nodes) {
             ++i;
             // if (i == 50) break;
             // console.log(x)
      if (reg.test(x)) {
            console.log(x);
            delete myjson.nodes[x];
             // if (i == 50) break;
        };
    }
}   