//////////////////////////////////////////////////////////////
//////////// Functions for ICH element click modal ///////////
//////////////////////////////////////////////////////////////

//Initialize the function for showing the modal on node's 2nd click on hover
function createModal(obj) {
    // console.log(obj)
    d3.select("#chart-modal-img-slider").html('');
    d3.select("#modal-node-snippets").html('');
    if(obj.meta && obj.meta.icon && (obj.meta.icon.large != "https://www.logistec.com/wp-content/uploads/2017/12/placeholder.png")) {
        d3.select("#chart-modal-full-img").style("background-image", `url("${obj.meta.icon.large}")`)
        d3.select("#chart-modal-full-img").style("padding-bottom", "40%");
        d3.select("#chart-modal-full-img").style("min-height", "200px");
        if (obj.id.startsWith("app_")) {
            d3.select("#chart-modal-full-img").style("padding-bottom", "0");
            d3.select("#chart-modal-full-img").style("min-height", "0");
        }
        //Change to 2nd image if the first is portrait, hoping the 2nd one isn't...
        /*
        let img = new Image()
        img.src = obj.meta.icon.small
        img.onload = function () {
            if (this.width < this.height) d3.select("#chart-modal-full-img").style("background-image", `url("${obj.meta.images[1].url}")`)
        }//onload
        */
    } else if (!(obj.meta.icon) || obj.meta.icon.large == "https://www.logistec.com/wp-content/uploads/2017/12/placeholder.png") {
        d3.select("#chart-modal-full-img").style("background-image", `url("#")`);
        d3.select("#chart-modal-full-img").style("padding-bottom", 0);
        d3.select("#chart-modal-full-img").style("min-height", 0);
    }

    //Change titles
    d3.select("#modal-node-type").html((obj.meta && obj.meta.list) ? common_translations[language][obj.meta.list.toLowerCase()] : typeConversion(obj.type))
    d3.select("#modal-node-highlighttype").html((obj.meta && obj.meta.highlighttype) ? obj.meta.highlighttype : '')
    d3.select("#modal-node-title").html(obj.label)
    d3.select("#modal-node-year").html((obj.meta && obj.meta.year) ? obj.meta.year : '')
    // d3.select("#modal-node-countries").html(obj.countries.sort().join(", "))
    if(obj.meta && obj.meta.description) d3.select("#modal-node-description").html(obj.meta.description)
    else d3.select("#modal-node-description").html(null)

    if(!obj.meta || (!obj.meta.highlighttype)) { //List of trends in the highlighttype field
        d3.select("#modal-node-highlighttype").style("display","none")
    } else {
        d3.select("#modal-node-highlighttype").style("display","block")
        d3.select("#modal-node-highlighttype").html(null);
        if (obj.meta && obj.meta.highlighttype[0]) {
            if (obj.meta && obj.meta.highlighttype[1]) {
                d3.select("#modal-node-highlighttype").html(obj.meta.highlighttype[0] + ', ' + obj.meta.highlighttype[1]);
            } else {
                d3.select("#modal-node-highlighttype").html(obj.meta.highlighttype[0]);
            }
        }
    };

    d3.select("#modal-node-link").html(null);
    if (obj.meta && obj.meta.link) {
        if (obj.meta && obj.meta.link2) {
            d3.select("#modal-node-link").html('<a href="' + obj.meta.link + '" target="_blank">' + common_translations[language]['more'] + '</a>' +
             ', <a href="' + obj.meta.link2 + '" target="_blank">' + "and here for even more" + '</a>');
        }
        else {
            d3.select("#modal-node-link").html('<a href="' + obj.meta.link + '" target="_blank">' + common_translations[language]['more'] + '</a>');
        }
    }

    if(!obj.meta || (!obj.meta.howtoapproach && !obj.meta.prevwork)) {
        d3.select("#chart-modal-aftervid").style("display","none")
    } else {
        d3.select("#chart-modal-aftervid").style("display","block")
        d3.select("#modal-node-howtoapproach").html(null);
        if (obj.meta && obj.meta.howtoapproach) {
            d3.select("#modal-node-howtoapproach").html('<strong>' + 'Recommended action for 2019: ' + '</strong>' + obj.meta.howtoapproach);
        }
        d3.select("#modal-node-prevwork").html(null);
        if (obj.meta && obj.meta.prevwork) {
            d3.select("#modal-node-prevwork").html('<strong>' + 'Previous work in SONAE: ' + '</strong>' + obj.meta.prevwork);
        }
    };

    //Show the modal
    node_modal.open("#chart-modal");

    //Hide video/images if there are none (along with the link to scroll to them)
    if(!obj.meta || (!obj.meta.images && !obj.meta.video)) {
        d3.select("#chart-modal-img-slider").style("display","none")
        d3.select("#modal-node-watch").style("display","none")
    } else {
            d3.select("#chart-modal-img-slider").style("display","block")
            d3.select("#modal-node-watch").style("display","block")
    };

    //Carousel
    if(obj.meta && (obj.meta.images || obj.meta.video)) {
        let glideDiv = document.createElement('div');
        glideDiv.setAttribute('class', 'slider__track glide__track');
        glideDiv.setAttribute('data-glide-el', 'track');

        let glideNextButton = document.createElement('button');
        glideNextButton.setAttribute('data-glide-dir', '>');
        glideNextButton.setAttribute('class', 'right');
        glideNextButton.innerHTML = '&#9654;';
        let glidePrevButton = document.createElement('button');
        glidePrevButton.setAttribute('data-glide-dir', '<');
        glidePrevButton.innerHTML = '&#9664;';

        let glideNPDiv = document.createElement('div');
        glideNPDiv.setAttribute('id', 'chart-modal-img-slider-controls');
        glideNPDiv.setAttribute('data-glide-el', 'controls');
        glideNPDiv.appendChild(glidePrevButton);
        glideNPDiv.appendChild(glideNextButton);

        let glideBulletDiv = document.createElement('div');
        glideBulletDiv.setAttribute('class', 'glide__bullets');
        glideBulletDiv.setAttribute('data-glide-el', 'controls[nav]');

        let cmp = 0;
        let glideUl = document.createElement('ul');
        if (obj.meta.video) {
            for(i = 0; i < obj.meta.video.length; i++) {
                let glideLi = document.createElement('li');
                glideLi.setAttribute('title', obj.meta.video[i].title + ' - ' + obj.meta.video[i].copyright);

                let glideVideo = document.createElement('iframe');
                glideVideo.src = obj.meta.video[i].url.replace('watch?v=', 'embed/') + '?rel=0&fs=0';

                let glideVideoDesc = document.createElement('p');
                glideVideoDesc.setAttribute('class', 'description');
                glideVideoDesc.append(obj.meta.video[i].title);
                let glideVideoCr = document.createElement('p');
                glideVideoCr.setAttribute('class', 'copyright');
                if (obj.meta.video[i].copyright !== "") glideVideoCr.append('© ' + obj.meta.video[i].copyright);

                glideLi.appendChild(glideVideo);
                // glideLi.appendChild(glideVideoDesc);
                // glideLi.appendChild(glideVideoCr);
                glideUl.appendChild(glideLi);

                let bulletButton = document.createElement('button');
                bulletButton.setAttribute('class', 'glide__bullet');
                bulletButton.setAttribute('data-glide-dir', '='+cmp);
                glideBulletDiv.appendChild(bulletButton);
                cmp++;
            }
        }
        if (obj.meta.images) {
            for(i = 0; i < obj.meta.images.length; i++) {
                let glideLi = document.createElement('li');
                glideLi.setAttribute('title', obj.meta.images[i]['title'] + ' - ' + obj.meta.images[i]['copyright']);

                let glideImg = new Image();
                glideImg.alt = obj.meta.images[i]['title'];
                glideImg.src = obj.meta.images[i]['url'];

                let glideImgDesc = document.createElement('p');
                glideImgDesc.setAttribute('class', 'description');
                glideImgDesc.append(obj.meta.images[i]['title']);
                let glideImgCr = document.createElement('p');
                glideImgCr.setAttribute('class', 'copyright');
                if (obj.meta.images[i]['copyright'] !== "") glideImgCr.append('© ' + obj.meta.images[i]['copyright']);


                glideLi.appendChild(glideImg);
                glideLi.appendChild(glideImgDesc);
                glideLi.appendChild(glideImgCr);
                glideUl.appendChild(glideLi);

                let bulletButton = document.createElement('button');
                bulletButton.setAttribute('class', 'glide__bullet');
                bulletButton.setAttribute('data-glide-dir', '='+cmp);
                glideBulletDiv.appendChild(bulletButton);
                cmp++;
            }
        }
        glideDiv.appendChild(glideUl);

        document.getElementById('chart-modal-img-slider').appendChild(glideDiv);
        document.getElementById('chart-modal-img-slider').appendChild(glideNPDiv);
        document.getElementById('chart-modal-img-slider').appendChild(glideBulletDiv);

        let glide = new Glide('#chart-modal-img-slider', { type: 'carousel', perView: 1 });
        glide.mount();
    }

    // Permalink

    let permalink = document.getElementById('permalink');
    if (permalink !== null) {
        let url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?focus=' + obj.id.substring(8);
        permalink.setAttribute('style', 'display: block;');
        permalink.innerHTML = 'Permalink: <a href="' + url + '">' + url + '</a>';
    }

    // RADAR BUILDING HIGHLIGHTS

    console.log(obj)

    // Microtrends    
    if(obj.meta && obj.meta.evidence_articles && (obj.meta.evidence_articles.names[0] && obj.meta.evidence_articles.urls[0])) {

        let microDiv = document.createElement('div');

        let microArtTitleH5 = document.createElement('h5');
        microArtTitleH5.setAttribute('class', 'mt-3');
        microArtTitleH5.append('Articles on this Microtrend');

        let microRowDiv = document.createElement('div');
        microRowDiv.setAttribute('class', 'row mt-3');
        for(i = 0; i < obj.meta.evidence_articles.urls.length; i++) {
            let colDiv = document.createElement('div');
            colDiv.setAttribute('class', 'col-md-12');

            let cardDiv = document.createElement('div');
            cardDiv.setAttribute('class', 'card flex-md-row mb-3 box-shadow h-md-250');
            cardDiv.setAttribute('card-id', "micro_"+i);

            let cardBodyDiv = document.createElement('div');
            cardBodyDiv.setAttribute('class', 'card-body d-flex flex-column align-items-start p-2');
            
            let artTitleH6 = document.createElement('h6');
            artTitleH6.setAttribute('class', 'mb-1');
            let artTitleAnchor = document.createElement('a');
            artTitleAnchor.setAttribute('class', 'text-dark');
            artTitleAnchor.append(obj.meta.evidence_articles.names[i]);
            if (obj.meta.evidence_articles.urls[i]) {
                artTitleAnchor.setAttribute('href', obj.meta.evidence_articles.urls[i]);
            }
            artTitleH6.append(artTitleAnchor);
            cardBodyDiv.append(artTitleH6);
            cardDiv.append(cardBodyDiv);
            colDiv.append(cardDiv);
            microRowDiv.append(colDiv);
        }
        microDiv.append(microArtTitleH5,microRowDiv);
        document.getElementById('modal-node-snippets').appendChild(microDiv);
    }


    // Highlights
    if(obj.meta && obj.meta.highlights && (obj.meta.highlights.implementation || obj.meta.highlights.partner || obj.meta.highlights.technology)) {

        let highlightDiv = document.createElement('div');

        if (obj.meta.highlights.implementation) {
            let impH5 = document.createElement('h5');
            impH5.setAttribute('class', 'mt-3');
            impH5.append('Real Implementations');
            let impRowDiv = document.createElement('div');
            impRowDiv.setAttribute('class', 'row mt-3');
            for(i = 0; i < obj.meta.highlights.implementation.length; i++) {
                let colDiv = document.createElement('div');
                colDiv.setAttribute('class', 'col-md-12');

                let cardDiv = document.createElement('div');
                cardDiv.setAttribute('class', 'card flex-md-row mb-3 box-shadow h-md-250');
                cardDiv.setAttribute('card-id', "imp_"+i);

                let thumbDiv = document.createElement('div');
                thumbDiv.setAttribute('class', 'full-thumbnail');
                if (obj.meta.highlights.implementation[i].image) {
                    thumbDiv.setAttribute('style', "background-image: url('" + obj.meta.highlights.implementation[i].image + "');");
                } else {
                    thumbDiv.setAttribute('style', "background-image: url('https://dummyimage.com/1x1/cccccc/cccccc.png')");
                }
                let cardBodyDiv = document.createElement('div');
                cardBodyDiv.setAttribute('class', 'card-body d-flex flex-column align-items-start p-2');
                
                let impTitleH6 = document.createElement('h6');
                impTitleH6.setAttribute('class', 'mb-1');
                let impTitleAnchor = document.createElement('a');
                impTitleAnchor.setAttribute('class', 'text-dark');
                impTitleAnchor.append(obj.meta.highlights.implementation[i].name);
                if (obj.meta.highlights.implementation[i].main_link) {
                    impTitleAnchor.setAttribute('href', obj.meta.highlights.implementation[i].main_link);
                }
                let impDescParagraph = document.createElement('p');
                impDescParagraph.setAttribute('class', 'card-text mb-2');
                if (obj.meta.highlights.implementation[i].description) {
                    impDescParagraph.append(obj.meta.highlights.implementation[i].description);
                }
                let impLinksParagraph = document.createElement('p');
                impLinksParagraph.setAttribute('class', 'card-text mb-2');
                if (obj.meta.highlights.implementation[i].article_links[0].length) {
                    for(j = 0; j < obj.meta.highlights.implementation[i].article_links.length; j++) {
                        let impArticleAnchor = document.createElement('a');
                        impArticleAnchor.setAttribute('href', obj.meta.highlights.implementation[i].article_links[j]);
                        impArticleAnchor.append('Article #'+(j+1));
                        impLinksParagraph.append(impArticleAnchor);
                        if (j+1!==obj.meta.highlights.implementation[i].article_links.length) {impLinksParagraph.append(" | ")}
                    }
                }
                // Append all childs to all parents.
                impTitleH6.append(impTitleAnchor);
                cardBodyDiv.append(impTitleH6,impDescParagraph,impLinksParagraph);
                cardDiv.append(thumbDiv,cardBodyDiv);
                colDiv.append(cardDiv);
                impRowDiv.append(colDiv);
            }
            highlightDiv.append(impH5,impRowDiv);
            document.getElementById('modal-node-snippets').appendChild(highlightDiv);
        }
        if (obj.meta.highlights.technology) {
            let techH5 = document.createElement('h5');
            techH5.setAttribute('class', 'mt-3');
            techH5.append('Enabling Emerging Technologies');
            let techRowDiv = document.createElement('div');
            techRowDiv.setAttribute('class', 'row mt-3');
            for(i = 0; i < obj.meta.highlights.technology.length; i++) {
                let colDiv = document.createElement('div');
                colDiv.setAttribute('class', 'col-md-12');

                let cardDiv = document.createElement('div');
                cardDiv.setAttribute('class', 'card flex-md-row mb-3 box-shadow h-md-250');
                cardDiv.setAttribute('card-id', "tech_"+i);

                let thumbDiv = document.createElement('div');
                thumbDiv.setAttribute('class', 'full-thumbnail');
                if (obj.meta.highlights.technology[i].image) {
                    thumbDiv.setAttribute('style', "background-image: url('" + obj.meta.highlights.technology[i].image + "');");
                } else {
                    thumbDiv.setAttribute('style', "background-image: url('https://dummyimage.com/1x1/cccccc/cccccc.png')");
                }
                let cardBodyRecWrapper = document.createElement('div');
                cardBodyRecWrapper.setAttribute('class', 'd-flex flex-column align-items-start w-100');
                let cardBodyDiv = document.createElement('div');
                cardBodyDiv.setAttribute('class', 'card-body d-flex flex-column align-items-start p-2 w-100');
                
                let techTitleH6 = document.createElement('h6');
                techTitleH6.setAttribute('class', 'mb-1');
                techTitleH6.append(obj.meta.highlights.technology[i].name);
                cardBodyDiv.append(techTitleH6) // Append Title
                // let techTitleAnchor = document.createElement('a');   // techTitleAnchor not needed - tech has no mainlink
                // techTitleAnchor.setAttribute('class', 'text-dark');
                // techTitleAnchor.append(obj.meta.highlights.technology[i].name);
                // if (obj.meta.highlights.technology[i].main_link) {
                //     techTitleAnchor.setAttribute('href', obj.meta.highlights.technology[i].main_link);
                // }
                if (obj.meta.highlights.technology[i].description) {
                    let techDescParagraph = document.createElement('p');
                    techDescParagraph.setAttribute('class', 'card-text mb-2');
                    techDescParagraph.append(obj.meta.highlights.technology[i].description);
                    cardBodyDiv.append(techDescParagraph) // Append Description Paragraph
                }
                if (obj.meta.highlights.technology[i].prevwork) {
                    let techPrevWorkParagraph = document.createElement('p');
                    techPrevWorkParagraph.setAttribute('class', 'card-text mb-2');
                    let techPrevWorkStrongTag = document.createElement('strong');techPrevWorkStrongTag.append('Previous work in SONAE: ');
                    techPrevWorkParagraph.append(techPrevWorkStrongTag);
                    techPrevWorkParagraph.append(obj.meta.highlights.technology[i].prevwork);
                    cardBodyDiv.append(techPrevWorkParagraph) // Append PrevWork Paragraph
                }

                let techLinksParagraph = document.createElement('p');
                techLinksParagraph.setAttribute('class', 'card-text mb-2');
                if (obj.meta.highlights.technology[i].prevworkurl) {
                    let techIntUrlAnchor = document.createElement('a');
                    techIntUrlAnchor.setAttribute('href', obj.meta.highlights.technology[i].prevworkurl);
                    techIntUrlAnchor.append('Internal Report');
                    techLinksParagraph.append(techIntUrlAnchor);
                    if (obj.meta.highlights.technology[i].externalurls.length) {techLinksParagraph.append(" | ")}
                }
                // need to parse string of URLs
                externalurlArray = new Array(obj.meta.highlights.technology[i].externalurls[0]);        externalurlArray=String(externalurlArray).split(",");
                // console.log(obj.meta.highlights.technology[i])
                if (externalurlArray[0].length) {
                    for(j = 0; j < externalurlArray.length; j++) {

                        let techExtUrlAnchor = document.createElement('a');
                        techExtUrlAnchor.setAttribute('href', externalurlArray[j]);
                        techExtUrlAnchor.append('External Report #'+(j+1));
                        techLinksParagraph.append(techExtUrlAnchor);
                        if (j+1!==externalurlArray.length) {techLinksParagraph.append(" | ")}
                    }
                }
                if (obj.meta.highlights.technology[i].externalurls.length || obj.meta.highlights.technology[i].prevworkurl) {
                    cardBodyDiv.append(techLinksParagraph)// Append Tech Links Paragraph
                }

                if (obj.meta.highlights.technology[i].recommendation) {
                    var techRecDiv = document.createElement('div'); techRecDiv.setAttribute('class', 'redlight-bar-container w-100');
                    let techRecBarDiv = document.createElement('div'); techRecBarDiv.setAttribute('class', 'redlight-bar');
                    let techRecBarTrack = document.createElement('div'); techRecBarTrack.setAttribute('class', 'redlight-bar-track');
                    techRecBarDiv.append(techRecBarTrack);
                    let recKey = ["watch","study","experiment","implement"]
                    switch(obj.meta.highlights.technology[i].recommendation) {
                        case "watch": activestepidx = 1;break;
                        case "study": activestepidx = 2;break;
                        case "experiment": activestepidx = 3;break;
                        case "implement": activestepidx = 4;break;
                        default: activestepidx = 1;break;
                    }
                    for (var stepidx = 1; stepidx < 5; stepidx++) {
                        var currentStepDiv = document.createElement('div')
                        if (stepidx < activestepidx) {
                            currentStepDiv.setAttribute('class', 'redlight-bar-step is-complete');
                        } else if (stepidx == activestepidx) {
                            currentStepDiv.setAttribute('class', 'redlight-bar-step is-active');
                        } else if (stepidx > activestepidx) {
                            currentStepDiv.setAttribute('class', 'redlight-bar-step');
                        }
                        currentStepDiv.append(common_translations[language][recKey[stepidx-1]])
                        techRecBarDiv.append(currentStepDiv);
                    }

                    let techRecStrongTag = document.createElement('strong');techRecStrongTag.append('Recommended action for '+ (new Date()).getFullYear()+': ');
                    cardBodyDiv.append(techRecStrongTag); //just title on body
                    techRecDiv.append(techRecBarDiv);
                    // techRecDiv.append(obj.meta.highlights.technology[i].recommendation);
                    // cardBodyDiv.append(techRecDiv) // Append Recommendation Paragraph
                }

                cardBodyRecWrapper.append(cardBodyDiv,techRecDiv);

                cardDiv.append(thumbDiv,cardBodyRecWrapper);
                colDiv.append(cardDiv);
                techRowDiv.append(colDiv);
            }
            highlightDiv.append(techH5,techRowDiv);
            document.getElementById('modal-node-snippets').appendChild(highlightDiv);
        }
        if (obj.meta.highlights.partner) {
            partH5 = document.createElement('h5');
            partH5.setAttribute('class', 'mt-3');
            partH5.append('Enabling Partners');
            partRowDiv = document.createElement('div');
            partRowDiv.setAttribute('class', 'row mt-3');
            for(i = 0; i < obj.meta.highlights.partner.length; i++) {
                colDiv = document.createElement('div');
                colDiv.setAttribute('class', 'col-md-12');

                cardDiv = document.createElement('div');
                cardDiv.setAttribute('class', 'card flex-md-row mb-3 box-shadow h-md-250');
                cardDiv.setAttribute('card-id', "part_"+i);

                thumbDiv = document.createElement('div');
                thumbDiv.setAttribute('class', 'full-thumbnail');
                if (obj.meta.highlights.partner[i].image) {
                    thumbDiv.setAttribute('style', "background-image: url('" + obj.meta.highlights.partner[i].image + "');");
                } else {
                    thumbDiv.setAttribute('style', "background-image: url('https://dummyimage.com/1x1/cccccc/cccccc.png')");
                }
                cardBodyDiv = document.createElement('div');
                cardBodyDiv.setAttribute('class', 'card-body d-flex flex-column align-items-start p-2');
                
                partTitleH6 = document.createElement('h6');
                partTitleH6.setAttribute('class', 'mb-1');
                // partTitleH6.append(obj.meta.highlights.partner[i].name);
                partTitleAnchor = document.createElement('a');
                partTitleAnchor.setAttribute('class', 'text-dark');
                partTitleAnchor.append(obj.meta.highlights.partner[i].name);
                if (obj.meta.highlights.partner[i].main_link) {
                    partTitleAnchor.setAttribute('href', obj.meta.highlights.partner[i].main_link);
                }
                partTitleAnchor.append(partTitleH6)
                cardBodyDiv.append(partTitleAnchor)
                if (obj.meta.highlights.partner[i].description) {
                    partDescParagraph = document.createElement('p');
                    partDescParagraph.setAttribute('class', 'card-text mb-2');
                    partDescParagraph.append(obj.meta.highlights.partner[i].description);
                    cardBodyDiv.append(partDescParagraph) // Append Description Paragraph
                }
                partLinksParagraph = document.createElement('p');
                partLinksParagraph.setAttribute('class', 'card-text mb-2');
                if (obj.meta.highlights.partner[i].sonae_link) {
                    partIntUrlAnchor = document.createElement('a');
                    partIntUrlAnchor.setAttribute('href', obj.meta.highlights.partner[i].sonae_link);
                    partIntUrlAnchor.append('SONAR Contact');
                    partLinksParagraph.append(partIntUrlAnchor);
                    if (obj.meta.highlights.partner[i].article_links.length) {partLinksParagraph.append(" | ")}
                }
                if (obj.meta.highlights.partner[i].article_links[0].length) { // Parse 
                    for(j = 0; j < obj.meta.highlights.partner[i].article_links.length; j++) {
                        partExtUrlAnchor = document.createElement('a');
                        partExtUrlAnchor.setAttribute('href', obj.meta.highlights.partner[i].article_links[j]);
                        partExtUrlAnchor.append('Article #'+(j+1));
                        partLinksParagraph.append(partExtUrlAnchor);
                        if (j+1!==obj.meta.highlights.partner[i].article_links.length) {partLinksParagraph.append(" | ")}
                    }
                }
                if (obj.meta.highlights.partner[i].article_links.length || obj.meta.highlights.partner[i].sonae_link.length) {
                    cardBodyDiv.append(partLinksParagraph)// Append part Links Paragraph
                }
                cardDiv.append(thumbDiv,cardBodyDiv);
                colDiv.append(cardDiv);
                partRowDiv.append(colDiv);
            }
            highlightDiv.append(partH5,partRowDiv);
            document.getElementById('modal-node-snippets').appendChild(highlightDiv);
        }
    }


}//function createModal

//Simple conversion from the node types to what is placed in the tooltip
function typeConversion(type) {
    if (type === "element") type = 'ich';
    if (type in common_translations[language]) {
        return common_translations[language][type];
    } else {
        return type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter
    }
}//function typeConversion

// Scroll to carousel
function node_modal_init_scroll() {
    document.getElementById('modal-node-watch').innerHTML = '<a>' + common_translations[language]['watch'] + '</a>';
    document.querySelectorAll('#modal-node-watch a')[0].addEventListener('click', function() {
        let offset = document.getElementById('chart-modal-img-slider').offsetTop;
        document.querySelectorAll('.modal-inner')[0].scrollTop = offset;
    });
}