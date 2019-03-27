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
document.getElementById('menu-method').innerHTML = "Methodology";
// document.querySelectorAll('#menu-about a')[0].innerHTML = common_translations[language]['menu_about'];
// document.querySelectorAll('#menu-about a')[0].setAttribute('href', common_translations[language]['menu_about_link'])
// let menu_more = document.getElementById('menu-more');
// menu_more.innerHTML = common_translations[language]['menu_more'] + menu_more.innerHTML;
// let menu_share = document.getElementById('menu-share');
// menu_share.innerHTML = common_translations[language]['menu_share'] + menu_share.innerHTML;
// document.querySelectorAll('#menu-more-constellation a')[0].innerHTML = common_translations[language]['menu_more_constellation'];
// document.querySelectorAll('#menu-more-biome a')[0].innerHTML = common_translations[language]['menu_more_biome'];
// document.querySelectorAll('#menu-more-domain a')[0].innerHTML = common_translations[language]['menu_more_domain'];
// document.querySelectorAll('#menu-more-threat a')[0].innerHTML = common_translations[language]['menu_more_threat'];
// document.querySelectorAll('#menu-more a').forEach(e => e.setAttribute('href', e.getAttribute('href') + '?language=' + language));
// let menu_language = document.getElementById('menu-language');
// menu_language.innerHTML = common_translations[language]['menu_language'] + menu_language.innerHTML;

// Share
// let share_url = window.location.protocol + '//' + window.location.host + window.location.pathname;
// let share_buttons = document.querySelectorAll('.st-custom-button');
// for (let button of share_buttons) {
//     button.setAttribute('data-url', share_url)
// }

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
//////////////////////// Method setup ////////////////////////
//////////////////////////////////////////////////////////////

document.getElementById('modal-method-img').setAttribute('src', 'img/methodology.png');

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

let method_modal = new VanillaModal.default({ //new modal for methodology
    onBeforeOpen: function() {
        document.querySelectorAll('.modal-content')[0].setAttribute('style', 'max-width: 1400px;');
    },
    onClose: function() {
        document.querySelectorAll('.modal-content')[0].removeAttribute('style');
    }
});
let method_modal_open = function() {
    // document.getElementById('menu').style.display = 'none';
    method_modal.open('#method-modal');
}
document.getElementById('menu-legend').addEventListener('click', legend_modal_open);
document.getElementById('intro-legend').addEventListener('click', legend_modal_open);
document.getElementById('menu-method').addEventListener('click', method_modal_open);

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
    console.log("Json ---> Data:",values[0])
    console.log(values[0].nodes.app_ADAPCONV)
    graph = values[0]
    let nodes = prepareNodes(graph)
    let edges = prepareEdges(graph)
    ////////////////////// Create the visual //////////////////////
    // console.log(nodes)
    container.call(threatVisual, nodes, edges, language, getFilteredData)
    queryURLparams();
    fillFilterMenu();
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

//----------------------------------------------------------------------------------------------------------------





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

threat_metadata = [
        { id: "vocabulary_ich_1265", color: "#EFB605", megatrend_relevance: 99}, //Adverse circumstances                     // RADAR   Authenticity / Disconnection
        { id: "vocabulary_ich_1268", color: "#E58903", megatrend_relevance: 140}, //Demographic issues                     // RADAR Continuous Connection
        { id: "vocabulary_ich_1287", color: "#E01A25", megatrend_relevance: 588}, //Derived practice                     // RADAR   Experiences
        { id: "vocabulary_ich_1264", color: "#C20049", megatrend_relevance: 615}, //Environmental degradation                     // RADAR  Health and Wellness
        { id: "vocabulary_ich_1286"}, //Weakened practice and transmission                     // RADAR    Sustainability
        { id: "vocabulary_ich_1263", color: "#66489F", megatrend_relevance: 298}, //Globalized information                     // RADAR Informed Consumers
        { id: "vocabulary_ich_1284", color: "#2074A0", megatrend_relevance: 242}, //New products and techniques                     // RADAR    Corporate Responsibility
        { id: "vocabulary_ich_1269", color: "#10A66E", megatrend_relevance: 159}, //Missing objects, spaces or systems                     // RADAR Seamlessness / Ease
        { id: "vocabulary_ich_1267", color: "#7EB852", megatrend_relevance: 174}, //Socioeconomical problems                     // RADAR   Hiper Personalization
    ]

// Papa.parse("../data/tempconcepts.csv", {
//     download: true,
//     header: true,
//     complete: function(results) {
//         window.tempcsv = results;
//         // console.log(results);
//     }
// });

// function changeconcepts(reg) { //this function was deprecated for the new createNewConceptsObjectArray
//     index=0;jindex=0;
//     window.test = [];
//     window.catlist =[];
//     for (j in threat_metadata) {window.catlist.push(threat_metadata[j].id);};

//     for (x in myjson.nodes) {
//              ++index;
//              // if (index == 50) break;
//              // console.log(x)
//       if (reg.test(x)) {
//         if (myjson.nodes[x].type === "concept" && myjson.nodes[x].group === "threat" && !catlist.includes(x)) {
//             console.log("-"+ x + "-" + myjson.nodes[x].label + "(---->)" + tempcsv.data[jindex]["Nome do destaque"]);
//             // window.test.push(myjson.nodes[x].label);
//             // console.log(tempcsv.data);
//             // console.log(tempcsv.data[jindex]["Nome do destaque"]+myjson.nodes[x].label)
//             myjson.nodes[x].label = tempcsv.data[jindex]["Nome do destaque"];
//              // if (index == 50) break;
//             ++jindex;if (jindex > tempcsv.data.length) break;
//          };
//         };
//     }
// }

function replaceOldConcepts(csv,conceptarray,oldjson) { //replaceOldConcepts(tempcsv,window.globalconcepts,myjson)
    // make list of category ids
    window.catlist =[];
    for (j in threat_metadata) {
        window.catlist.push(threat_metadata[j].id);
    };
    // create array with object for every concept in csv
    data = csv.data;
    newconceptarray = [];
    var iOld=0;
    for (r in data) {
        if (iOld===data.length-1) break;
        // parse array of images
        tempimglist=new Array([data[r]["Images"]][0]);
        tempimglist=String(tempimglist).split(",");
        // parse array of videos
        // tempvidlist=new Array([data[r]["Videos"]][0]);
        // tempvidlist=String(tempvidlist).split(",");
        tempvidvar=data[r]["Videos"];
        console.log(conceptarray[iOld])
        window.newconceptarray.push({
            [conceptarray[iOld].id]: {
                "type": conceptarray[iOld].type,
                "group": conceptarray[iOld].group,
                "label": data[r]["Nome do destaque"],
                "meta": {
                    "icon": {
                        "small": tempimglist[0],
                        "large": tempimglist[0]
                    },
                    "description": data[r]["Descri��o"],
                    "list": data[r]["tipo de destaque"],
                    "year": data[r]["mega trend associada"],
                    "multinational": false,
                    "link": data[r]["Link #1"],
                    "link2": data[r]["Link #2"],
                    "prevwork": data[r]["Previous work in SONAE"],
                    "howtoapproach": data[r]["How to approach?"]
                    //"highlighttype": data[r]["tipo de destaque"],
                    // "images": tempimgobjarray,
                    // "video": tempvidobjarray
                }
            }
        })
        //if images exist, push image property to json, else dont
        window.tempimgobjarray = [];
        for (var i = 1; i < tempimglist.length; i++) {
            tempimgobjarray.push({
                "url": tempimglist[i],
                "copyright": "",
                "title": ""
            })
        }
        if (tempimgobjarray.length) {
            newconceptarray[iOld][conceptarray[iOld].id].meta.images = tempimgobjarray;
        }
        window.tempvidobjarray = [];
        tempvidobjarray.push({
            "url": tempvidvar,
            "copyright": "",
            "title": ""
        })
        if (tempvidvar.length) {
            newconceptarray[iOld][conceptarray[iOld].id].meta.video = tempvidobjarray;
        }

        temprelmicrosarray = [];
        tempmicro1=data[r]["micro trend associada #1"];
        tempmicro2=data[r]["micro trend associada #2"];
        if (tempmicro1.length) {
            if (tempmicro2.length) {
                temprelmicrosarray.push(tempmicro2)
            }
            temprelmicrosarray.push(tempmicro1)
            newconceptarray[iOld][conceptarray[iOld].id].meta.highlighttype = temprelmicrosarray;
        }

        iOld++;

    };
    // create array with object for every concept in csv
    for (r in newconceptarray) {
        // console.log(Object.keys(newconceptarray[r]))
        // console.log(oldjson.nodes[Object.keys(newconceptarray[r])])
        oldjson.nodes[Object.keys(newconceptarray[r])] = newconceptarray[r][Object.keys(newconceptarray[r])];
        // console.log(oldjson.nodes[Object.keys(newconceptarray[r])])
    };
    // for every line in the CSV, create the respective Micro -> Concept edges
    tempnewedgesarray = [];
    window.concepthoverdefinitionsarray = [];//variable to hold definitions for translationsThreat.js (the ones when hovering concepts)
    counterCSV = 0;
    loop1:
    for (r in data) {
        tempMicroID2 = [];
        if (counterCSV===data.length-1) break;
        loop2:
        for (n in oldjson.nodes) {
            if (oldjson.nodes[n].label === data[r]["micro trend associada #1"]) {
                // console.log(oldjson.nodes[n].label);
                tempMicroID = n;
                console.log("found Micro: "+n+" = "+data[r]["micro trend associada #1"]);
                break loop2;
            }
        };
        loop2_0:
        for (n in oldjson.nodes) {
            if (oldjson.nodes[n].label === data[r]["micro trend associada #2"]) {
                // console.log(oldjson.nodes[n].label);
                tempMicroID2 = n;
                console.log("found Micro: "+n+" = "+data[r]["micro trend associada #2"]);
                break loop2_0;
            }
        };
        loop3:
        for (n in newconceptarray) {
            currentID = String(Object.keys(newconceptarray[n])[0]);
            if (newconceptarray[n][currentID].label === data[r]["Nome do destaque"]) {
                // console.log(oldjson.nodes[n].label);
                tempConceptID = Object.keys(newconceptarray[n])[0];
                console.log("found Concept: "+tempConceptID+" = "+data[r]["Nome do destaque"]);
                break loop3;
            }
        };
        loop4:
        for (n in oldjson.edges) {
            if (oldjson.edges[n].subject === tempConceptID) {
                // console.log(oldjson.nodes[n].label);
                console.log("found old concept<->Mega edges to delete: "+oldjson.edges[n].subject+" <-> "+oldjson.edges[n].object);
                delete oldjson.edges[n];
                break loop4;
            }
        };
        oldjson.edges = oldjson.edges.filter((obj) => obj); //remove nulls

        tempnewedgesarray.push({ // add Micro to Concept edge
            "subject": tempMicroID,
            "predicate": "related",
            "object": tempConceptID,
            "weight": 2
        })
        if (tempMicroID2.length) {
            tempnewedgesarray.push({ // add Micro to Concept edge
                "subject": tempMicroID2,
                "predicate": "related",
                "object": tempConceptID,
                "weight": 2
            })
        }
        tempnewedgesarray.push({ // also add Concept to Mega edge (based on main mega trend from CSV)
            "subject": tempConceptID,
            "predicate": "broader",
            "object": data[r]["threat_categories"],
            "weight": 2
        })
        concepthoverdefinitionsarray.push({ // also add Concept to Mega edge (based on main mega trend from CSV)
            "id": tempConceptID,
            "definition": data[r]["Descri��o"]
        })
        counterCSV++;
    };
    // console.log(tempnewedgesarray)
    Array.prototype.push.apply(oldjson.edges,tempnewedgesarray)
};

// function replaceOldConcepts(oldjson,newconcepts) { //replaceOldConcepts(myjson,newconceptarray)
//     // create array with object for every concept in csv
//     for (r in newconcepts) {
//         console.log(Object.keys(newconcepts[r]))
//         console.log(oldjson.nodes[Object.keys(newconcepts[r])])
//         oldjson.nodes[Object.keys(newconcepts[r])] = newconcepts[r][Object.keys(newconcepts[r])];
//         console.log(oldjson.nodes[Object.keys(newconcepts[r])])
//     };
// };

function resetMicroEdges(oldjson,microarray) { //setAllMicroEdgesToSameMega(myjson,globalelements)
//use replaceOldConcepts afterwards
    // create array with object for every concept in csv
    temparray = [];
    for (r in oldjson.edges) {
        if (/^element_/.test(oldjson.edges[r].subject) && (oldjson.edges[r].subject)!=="element_9999" && (oldjson.edges[r].subject)!=="element_9998") {
            console.log(oldjson.edges[r].subject);
            delete oldjson.edges[r];
        };


        // console.log(Object.keys(newconcepts[r]))
        // console.log(oldjson.nodes[Object.keys(newconcepts[r])])
        // oldjson.nodes[Object.keys(newconcepts[r])] = newconcepts[r][Object.keys(newconcepts[r])];
        // console.log(oldjson.nodes[Object.keys(newconcepts[r])])
    };
    console.log("deleted "+r+" elements")

    oldjson.edges = oldjson.edges.filter((obj) => obj); //remove nulls
    console.log("json now has " + oldjson.edges.length + " edges")
    //build temp array with new connections
    for (r in microarray) {
            temparray.push({
                "subject": microarray[r].id,
                "predicate": "related",
                "object": microarray[r].threat_categories[0],
                "weight": 2
            })
            // console.log(microarray[r])
            // temparray.push({ // introduce at least 1 connection edge to a Mega trend to make sure the micro stays even if its not linked to a highlight
            //     "subject": conceptcsv[r].id,
            //     "predicate": "related",
            //     "object": conceptcsv[r],
            //     "weight": 2
            // })
    };
    console.log(temparray)
    Array.prototype.push.apply(oldjson.edges,temparray)
    console.log("json now has " + oldjson.edges.length + " edges")
};


// Papa.parse("../data/tempmicros.csv", {
//     download: true,
//     header: true,
//     complete: function(results) {
//         window.tempmicroscsv = results;
//     }
// });

function createNewMicrosObjectArray(csv,microsarray) { // createNewMicrosObjectArray(tempmicroscsv,globalelements)
    // create array with object for every concept in csv
    data = csv.data;
    newmicroarray = [];
    var iOld=0;
    // console.log([data[0]["threat_categories"]][0].split(","))
    for (r in data) {
        if (iOld===data.length-1) break;
        tempcatlist=new Array([data[r]["threat_categories"]][0])//.split(",");
        tempcatlist=String(tempcatlist).split(",");
        console.log(tempcatlist);
        window.newmicroarray.push({
            [microsarray[iOld].id]: {
                "type": microsarray[iOld].type,
                "label": data[r]["Trend Title"],
                "threat_categories": tempcatlist,
                "meta": {
                    "icon": {
                        "small": data[r]["Images"], //data[r]["Video or image #1"],
                        "large": data[r]["Images"], //data[r]["Video or image #1"],
                    },
                    "description": data[r]["New Description"],
                    "list": "microtrends-list",
                    "year": data[r]["Main mega trend"],
                    "multinational": false,
                    // "link": "https://ich.unesco.org/img/photo/thumb/05391-BIG.jpg", //data[r]["Link #1"],
                    // "images": [],
                    // "video": []
                }
            }
        })
        iOld++;
    };
};

function replaceOldMicros(oldjson,newmicros) { //replaceOldConcepts(myjson,newmicroarray)
    // create array with object for every micro in csv
    for (r in newmicros) {
        console.log(Object.keys(newmicros[r]))
        console.log(oldjson.nodes[Object.keys(newmicros[r])])
        oldjson.nodes[Object.keys(newmicros[r])] = newmicros[r][Object.keys(newmicros[r])];
        console.log(oldjson.nodes[Object.keys(newmicros[r])])
    };
};

(function adminDataUpdate() {
    //parse query url params
    var i=0;
    var telem;
    var search_values=location.search.replace('\?','').split('&');
    var query={}
    for(i=0;i<search_values.length;i++){
        telem=search_values[i].split('=');
        query[telem[0]]=telem[1];
    }

    if (query.admin && query.admin.length>0 && query.admin == 'shift') {
        var rowToHtml = function( row ) {
            var result = "";
            for (key in row) {
                result += key + ": " + row[key] + "<br/>"
            }
            return result;
        }

        var previewCsvUrl = function( csvUrl ) {
             d3.csv( csvUrl, function( rows ) {
                // console.log(d3.csv( csvUrl))
                   d3.select("div#adminpreview").html(
                     "<b>First row:</b><br/>" + rowToHtml( rows[0] ));
             })
        }

        filenamearray = ['appData.csv', 'megatrendData.csv', 'microtrendData.csv', 'highlightData.csv'];
        var csvpromises
        window.admin_appData = null, window.admin_highlightData = null, window.admin_microtrendData = null, window.admin_megatrendData = null

        d3.select(".admin-data-container")
          .selectAll("div.fileinputs")
          .data(filenamearray)
          .enter()
          .append("div")
          .append("label")
          .text(function(d) {return (d+' | ')})
          .append("input")
          .attr("type", "file")
          .attr("accept", ".csv")
          // .style("margin", "5px")
          .on("change", function(d) {
            // console.log(d)
            var file = d3.event.target.files[0];
            if (file) {
              var reader = new FileReader();
                reader.onloadend = function(evt) {
                  var dataUrl = evt.target.result;
                  // The following call results in an "Access denied" error in IE.
                  csvpromises = d3.csv(dataUrl);
                  (csvpromises).then(function(values) {
                        window['admin_'+d.substr(0, d.indexOf('.'))] = values;
                    });
                  // previewCsvUrl(dataUrl);
              };
             reader.readAsDataURL(file);
            }
         })

        d3.select(".admin-data-container")
            .append('button')
            .text('Submit')
            .on('click', function(d) {
                if (admin_appData!=null && admin_highlightData!=null && admin_microtrendData!=null && admin_megatrendData!=null && admin_appData.length>0 && admin_highlightData.length>0 && admin_microtrendData.length>0 && admin_megatrendData.length>0) {
                    window.finaljson = mkFinalDataJson(admin_microtrendData,admin_megatrendData,admin_highlightData,admin_appData);
                    alert('Files successfully loaded, please overwrite graph_edited_en.json in data folder to see changes. Reload with CTRL+F5 to see changes. (If something broke, restore graph_edited_en.json)')
                    downloadjson(finaljson, 'graph_edited_en.json', 'json');
                } else {alert('Files missing or wrongfully loaded. Check if you uploaded the correct files.')}
            })
    }
})()

function fillFilterMenu() {
    input = graph.nodes;
    var keys = [];
    for (i in input)
    {
        Object.keys(input).forEach(function(key){
            if (typeof input[key].meta != "undefined" && typeof input[key].meta.filterlists != "undefined") {
                for (k in input[key].meta.filterlists) {
                    if(keys.indexOf(input[key].meta.filterlists[k]) == -1) {
                        keys.push(input[key].meta.filterlists[k]);
                    }
                }
            }
        });
    }
    // console.log(keys)

    d3.select("#filterOptionsHyperlinks")
    .selectAll("a.dropdown-item")
    .data(keys)
    .enter()
    .append("a")
    .attr("class", "dropdown-item")
    .attr("href", function(d) {return ("?filter="+d)})
    .html(function(d) {return d})
}


// function setNewMicro2ConceptEdges(oldjson,conceptcsv) { //setAllMicroEdgesToSameMega(myjson,"vocabulary_ich_1284",globalelements)
//     // create array with object for every concept in csv
//     temparray = [];
//     for (r in oldjson.edges) { //delete all edges for elements
//         if (/^element_/.test(oldjson.edges[r].subject) && (oldjson.edges[r].subject)!=="element_9999") {
//             console.log(oldjson.edges[r].subject);
//             delete oldjson.edges[r];
//         };


//         // console.log(Object.keys(newconcepts[r]))
//         // console.log(oldjson.nodes[Object.keys(newconcepts[r])])
//         // oldjson.nodes[Object.keys(newconcepts[r])] = newconcepts[r][Object.keys(newconcepts[r])];
//         // console.log(oldjson.nodes[Object.keys(newconcepts[r])])
//     };
//     console.log("deleted "+r+" elements")

//     oldjson.edges = oldjson.edges.filter((obj) => obj); // remove nulls
//     console.log("json now has " + oldjson.edges.length + " edges")
//     //build temp array with new connections
//     for (r in conceptcsv) {
//             temparray.push({
//                 "subject": conceptcsv[r].id,
//                 "predicate": "related",
//                 "object": conceptcsv[r],
//                 "weight": 2
//             })
//             console.log(conceptcsv[r].id)
//             console.log(conceptcsv[r])
//             // temparray.push({ // introduce at least 1 connection edge to a Mega trend to make sure the micro stays even if its not linked to a highlight
//             //     "subject": conceptcsv[r].id,
//             //     "predicate": "related",
//             //     "object": conceptcsv[r],
//             //     "weight": 2
//             // })
//     };
//     console.log(temparray)
//     Array.prototype.push.apply(oldjson.edges,temparray)
//     console.log("json now has " + oldjson.edges.length + " edges")
// };


// window.temp1 = concepts; //(concepts comes from createThreatVisual.js)
// window.new99 = [];
// temp1.forEach(d => window.new99.push({
//         "subject": "element_9999",
//         "predicate":"related",
//         "object": d.id,
//         "weight": 1
//     })
// )


// window.temp1 = concepts; //(concepts comes from createThreatVisual.js)
// window.conceptsFromCSV = [];
// temp1.forEach(d => window.new99.push({
//         "subject": "element_9999",
//         "predicate":"related",
//         "object": d.id,
//         "weight": 1
//     })
// )