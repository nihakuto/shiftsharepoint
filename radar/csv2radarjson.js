Papa.parse("../data/microtrendData.csv", {
    download: true,
    header: true,
    complete: function(results) {
        window.microTrendData = results;
        console.log(results);
    }
});

function mkmicrotrendNodes(csv) {
    // create array with object for every concept in csv
    data = csv.data;
    microNodes = [];
    // console.log([data[0]["threat_categories"]][0].split(","))
    for (row in data) {
        if (row===data.length-1) break;
        // console.log(data[row]["radar_include"]);
        if (data[row]["radar_include"] != 1) continue;
        tempcatlist=new Array([data[row]["threat_categories"]][0])//.split(",");
        tempcatlist=String(tempcatlist).split(",");
        // console.log(tempcatlist);
        // console.log(tempcatlist);
        artnamelist=new Array([data[row]["article_name_list"]][0]);        artnamelist=String(artnamelist).split(",");
        arturllist=new Array([data[row]["article_name_list"]][0]);        arturllist=String(arturllist).split(",");
        microtrendcode = ("micro_"+data[row]["trend_id"]);
        microNodes.push({
            [microtrendcode]: {
                "type": "element",
                "label": data[row]["trend_title"],
                "threat_categories": tempcatlist,
                "meta": {
                    "icon": {
                        "small": data[row]["micro_image"], //data[row]["Video or image #1"],
                        "large": data[row]["micro_image"], //data[row]["Video or image #1"],
                    },
                    "description": data[row]["new_description"],
                    "list": "microtrends-list",
                    "year": data[row]["main_mega_trend"],
                    "multinational": false,
                    // "link": "https://ich.unesco.org/img/photo/thumb/05391-BIG.jpg", //data[row]["Link #1"],
                    // "images": [],
                    // "video": []
                    "evidence_articles": {
                        "names": artnamelist, //data[row]["Video or image #1"],
                        "urls": arturllist, //data[row]["Video or image #1"],
                    },
                }
            }
        })
    }
    return microNodes
};

function mkmicroappEdges(csv) {
    // create array with object for every concept in csv
    data = csv.data;
    microappEdges = [];
    // console.log([data[0]["threat_categories"]][0].split(","))
    for (row in data) {
        if (row===data.length-1) break;
        if (data[row]["radar_include"] != 1) continue; //skip cycle if micro is not to be included.
        microtrendcode = ("micro_"+data[row]["trend_id"]);
        //separate app list
        appcodelist=new Array([data[row]["apps_code_list"]][0]);        appcodelist=String(appcodelist).split(",");
        appcodelist=appcodelist.map(function(el) {return 'app_' + el});//console.log(appcodelist);

        for (app in appcodelist) {
            microappEdges.push(
                {
                    "subject": microtrendcode,
                    "predicate": "related",
                    "object": appcodelist[app],
                    "weight": 1,
                    "edgetype": "micro_to_application"
                }
            )
        }
    }
    return microappEdges
};

Papa.parse("../data/appData.csv", {
    download: true,
    header: true,
    complete: function(results) {
        window.appData = results;
        console.log(results);
    }
});

function mkappNodes(csv) {
    // create array with object for every concept in csv
    data = csv.data;
    appNodes = [];
    // console.log([data[0]["threat_categories"]][0].split(","))
    for (row in data) {
        if (row===data.length-1) break;
        // console.log(data[row]["radar_include"]);
        if (data[row]["radar_include"] != 1) continue;

        appcode = ("app_"+data[row]["app_CODE"]);

        //separate micro code list
        micronamelist=new Array([data[row]["linked_microtrends"]][0]);        micronamelist=String(micronamelist).split(",");
        // micronamelist=micronamelist.map(function(el) {return 'micro_' + el});//console.log(micronamelist);

        appObj = {
            "type": "concept",
            "group": "threat",
            "label": data[row]["App_name"],
            "meta": {
                "icon": {
                    "small": data[row]["app_image"], //data[row]["Video or image #1"],
                    "large": data[row]["app_image"], //data[row]["Video or image #1"],
                },
                "description": data[row]["App_description"],
                "list": "Trend Application",
                "year": data[row]["MegaT #1"],
                "multinational": false,
                // "link": "https://www.eatizz.com/en/",
                // "link2": "",
                // "prevwork": "",
                // "howtoapproach": "",
                // "images": [],
                // "video": [],
                "highlighttype": micronamelist
            },
        }
        appNodes[appcode]=appObj;
    }
    return appNodes
};

function mkappmegaEdges(csv) {
    // create array with object for every concept in csv
    data = csv.data;
    appmegaEdges = [];
    // console.log([data[0]["threat_categories"]][0].split(","))
    for (row in data) {
        if (row===data.length-1) break;
        if (data[row]["radar_include"] != 1) continue; //skip cycle if micro is not to be included.

        appcode = ("app_"+data[row]["app_CODE"]);
        megalink=data[row]["main_mega_link"];

        appmegaEdges.push(
            {
                "subject": appcode,
                "predicate": "broader",
                "object": megalink,
                "weight": 2,
                "edgetype": "app_to_mega"
            }
        )
    }
    return appmegaEdges
};

Papa.parse("../data/highlightData.csv", {
    download: true,
    header: true,
    complete: function(results) {
        window.highlightData = results;
        console.log(results);
    }
});

function appendHighlights(hl_csv,oldAppNodesObj) {
    // create array with object for every concept in csv
    data = hl_csv.data;
    newAppNodesObj = oldAppNodesObj;
    // console.log([data[0]["threat_categories"]][0].split(","))
    for (appcode in newAppNodesObj) {
        excel_appcode = appcode.split("app_");        excel_appcode = excel_appcode[1]; // remove app_ prefix because of notation in Excel
        for (row in data) {
            if (row===data.length-1) break;
            highlightAppCodeList = new Array([data[row]["app_code_list"]][0]);        highlightAppCodeList=String(highlightAppCodeList).split(",");

            if (!(highlightAppCodeList.includes(excel_appcode))) continue;

            // console.log(newAppNodesObj[appcode])
            if (typeof newAppNodesObj[appcode]["meta"]["highlights"] === 'undefined' || newAppNodesObj[appcode]["meta"]["highlights"] === null) {
                newAppNodesObj[appcode]["meta"]["highlights"]={}; // if app doesnt have highlights yet, define highlights field
            }
            if (typeof newAppNodesObj[appcode]["meta"]["highlights"][data[row]["highlight_type"]] === 'undefined' || newAppNodesObj[appcode]["meta"]["highlights"][data[row]["highlight_type"]] === null) {
            newAppNodesObj[appcode]["meta"]["highlights"][data[row]["highlight_type"]]=[]; // if app doesnt have this type of highlight yet, define its field
            }
            // console.log(newAppNodesObj[appcode]["meta"]["highlights"][data[row]["highlight_type"]])

            newHLobj = {};
            switch (data[row]["highlight_type"]) {
                case "implementation":
                    articlearray = new Array([data[row]["article_links"]][0]);        articlearray=String(articlearray).split(",");
                    newHLobj={
                        "uid" : data[row]["highlight_uid"],
                        "name" : data[row]["highlight_name"],
                        "author" : data[row]["highlight_author"],
                        "description" : data[row]["highlight_description"],
                        "image" : data[row]["image_url"],
                        "video" : data[row]["video_url"],
                        "main_link" : data[row]["main_link"],
                        "article_links" : articlearray
                    };
                    break;
                case "partner":
                    articlearray = new Array([data[row]["article_links"]][0]);        articlearray=String(articlearray).split(",");
                    newHLobj={
                        "uid" : data[row]["highlight_uid"],
                        "name" : data[row]["highlight_name"],
                        "author" : data[row]["highlight_author"],
                        "description" : data[row]["highlight_description"],
                        "image" : data[row]["image_url"],
                        "video" : data[row]["video_url"],
                        "main_link" : data[row]["main_link"],
                        "article_links" : articlearray,
                        "sonar_link" : data[row]["partner_suricata_link"]
                    };
                    break;
                case "technology":
                    articlearray = new Array([data[row]["article_links"]][0]);        articlearray=String(articlearray).split(",");
                    newHLobj={
                        "uid" : data[row]["highlight_uid"],
                        "name" : data[row]["highlight_name"],
                        "author" : data[row]["highlight_author"],
                        "description" : data[row]["highlight_description"],
                        "image" : data[row]["image_url"],
                        "video" : data[row]["video_url"],
                        "prevwork" : data[row]["tech_previous_work_description"],
                        "prevworkurl" : data[row]["tech_previous_work_url"],
                        "externalurls" : data[row]["tech_external_url"],
                        "recommendation" : data[row]["tech_recommendation"]
                    };
                    break;
            }
            if (typeof newHLobj !== 'undefined' && newHLobj !== null) {
                newAppNodesObj[appcode]["meta"]["highlights"][data[row]["highlight_type"]].push(newHLobj) // if highlight found, push it into the json obj
            }
        }
    }
    return newAppNodesObj
};

// example:  // missing columns: app_image 

        // "vocabulary_ich_1114": {
        //     "type": "concept",
        //     "group": "threat",
        //     "label": "Last-Minute Discounts",
        //     "meta": {
        //         "icon": {
        //             "small": "https://innovationmtl.files.wordpress.com/2017/01/eatizz-pub.png",
        //             "large": "https://innovationmtl.files.wordpress.com/2017/01/eatizz-pub.png"
        //         },
        //         "description": "Eatizz is a Canadian startup that offers a simple and clever solution to users which are notified when shopkeeper offer discounted food (close to sales� expiry date, unsold products) in their neighborhood.",
        //         "list": "Trend Application",
        //         "year": "Continuous Connection",
        //         "multinational": false,
        //         "link": "https://www.eatizz.com/en/",
        //         "link2": "",
        //         "prevwork": "",
        //         "howtoapproach": "",
        //         "highlighttype": [
        //             "Fear Of Missing Out"
        //         ]
        //     }
        // },

        // edges
        // {
        //     "subject": "vocabulary_ich_1114",
        //     "predicate": "broader",
        //     "object": "vocabulary_ich_1268",
        //     "weight": 2
        // },









// function resetMicroEdges(oldjson,microarray) { //setAllMicroEdgesToSameMega(myjson,globalelements)
// //use replaceOldConcepts afterwards
//     // create array with object for every concept in csv
//     temparray = [];
//     for (r in oldjson.edges) {
//         if (/^element_/.test(oldjson.edges[r].subject) && (oldjson.edges[r].subject)!=="element_9999" && (oldjson.edges[r].subject)!=="element_9998") {
//             console.log(oldjson.edges[r].subject);
//             delete oldjson.edges[r];
//         };

//     };
//     console.log("deleted "+r+" elements")

//     oldjson.edges = oldjson.edges.filter((obj) => obj); //remove nulls
//     console.log("json now has " + oldjson.edges.length + " edges")
//     //build temp array with new connections
//     for (r in microarray) {
//             temparray.push({
//                 "subject": microarray[r].id,
//                 "predicate": "related",
//                 "object": microarray[r].threat_categories[0],
//                 "weight": 2
//             })
//     };
//     console.log(temparray)
//     Array.prototype.push.apply(oldjson.edges,temparray)
//     console.log("json now has " + oldjson.edges.length + " edges")
// };


// Papa.parse("../data/tempmicros.csv", {
//     download: true,
//     header: true,
//     complete: function(results) {
//         window.tempmicroscsv = results;
//         console.log(results);
//     }
// });

// function createNewMicrosObjectArray(csv,microsarray) { // createNewMicrosObjectArray(tempmicroscsv,globalelements)
//     // create array with object for every concept in csv
//     data = csv.data;
//     newmicroarray = [];
//     var iOld=0;
//     // console.log([data[0]["threat_categories"]][0].split(","))
//     for (r in data) {
//         if (iOld===data.length-1) break;
//         tempcatlist=new Array([data[r]["threat_categories"]][0])//.split(",");
//         tempcatlist=String(tempcatlist).split(",");
//         console.log(tempcatlist);
//         window.newmicroarray.push({
//             [microsarray[iOld].id]: {
//                 "type": microsarray[iOld].type,
//                 "label": data[r]["Trend Title"],
//                 "threat_categories": tempcatlist,
//                 "meta": {
//                     "icon": {
//                         "small": data[r]["Images"], //data[r]["Video or image #1"],
//                         "large": data[r]["Images"], //data[r]["Video or image #1"],
//                     },
//                     "description": data[r]["New Description"],
//                     "list": "microtrends-list",
//                     "year": data[r]["Main mega trend"],
//                     "multinational": false,
//                     // "link": "https://ich.unesco.org/img/photo/thumb/05391-BIG.jpg", //data[r]["Link #1"],
//                     // "images": [],
//                     // "video": []
//                 }
//             }
//         })
//         iOld++;
//     };
// };

// function replaceOldMicros(oldjson,newmicros) { //replaceOldConcepts(myjson,newmicroarray)
//     // create array with object for every micro in csv
//     for (r in newmicros) {
//         console.log(Object.keys(newmicros[r]))
//         console.log(oldjson.nodes[Object.keys(newmicros[r])])
//         oldjson.nodes[Object.keys(newmicros[r])] = newmicros[r][Object.keys(newmicros[r])];
//         console.log(oldjson.nodes[Object.keys(newmicros[r])])
//     };
// };