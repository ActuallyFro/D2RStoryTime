//Zoom functions: https://embed.plnkr.co/1Mub7rTUKQuuAB6TAoJb/

function DrawGraph(name_of_json){
  // clear <div> GraphArea
  document.getElementById("GraphArea").innerHTML = "";
  document.getElementById("div_tooltip").innerHTML = "";

  // var w, h which are 100% of the screen width and height
  var w = window.innerWidth*1.0,
      h = window.innerHeight*0.66;

  var vis = d3.select("#GraphArea").append("svg:svg").attr("width", w).attr("height", h);

  d3.json(name_of_json, function(json) {

    //BAD, BRUTE FORCE way to lookup the link's name to the indexed node -- but d3 is gonna d3 ...
    //console.log("Loaded nodes: "+json.nodes.length);
    //console.log("Loaded links: "+json.links.length);
    for (var i = 0; i < json.links.length; i++) {
      var link = json.links[i];  
      // console.log("Link: "+link.source+" "+link.target+" "+link.value);

      var sourceFound = false;
      var targetFound = false;

      //console.log("Converting NAMED refs for Link["+i+"]:<"+link.value+"> {src:"+link.source+", tgt:"+link.target+"}");
      //look for both source and target... update nodes with respective index...
      for (var ii = 0; ii < json.nodes.length; ii++) {
        // print loop number:
        var node = json.nodes[ii];
        //console.log("Loop ["+ii+"]: ID:<"+node.id+"> (named: "+node.name+")");

        //print node.id
        if (sourceFound == false) {
          //console.log("\tComparing node's name: "+node.id+" of node["+ii+"] <for source: "+link.source+">");
          if (node.id == link.source) {
            //console.log("\tUpdating json.linksFound source: "+ii+" <for source: "+link.source+">");
            json.links[i].source = ii;
            sourceFound = true;
          }  
        }

        if (targetFound == false) {
          //console.log("\tComparing node's name: "+node.id+" of node["+ii+"] <for target: "+link.target+">");
          if (node.id == link.target) {
            json.links[i].target = ii;
            //console.log("\tUpdating json.linksFound target: "+ii+" <for target: "+link.source+">");
            targetFound = true;
          }
        }

        if (sourceFound == true && targetFound == true) {
          //console.log("\tFOUND both source and target -- DONE");
          break;
        }
      }
    }
    //TOOL TIP - START
    var Tooltip = d3.select("#div_tooltip").append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)

      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function(d) {
      Tooltip.html("Decription:" + d.description).style("left", (d3.mouse(this)[0]+70) + "px").style("top", (d3.mouse(this)[1]) + "px")
    }

    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
      
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }
    //TOOL TIP - END

    var force = self.force = d3.layout.force()
      .nodes(json.nodes)
      .links(json.links)
      .gravity(.05)
      .distance(100)
      .charge(-100)
      .size([w, h])
      .start();

    var link = vis.selectAll("line.link")
      .data(json.links)
      .enter().append("svg:line")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    var node_drag = d3.behavior.drag().on("dragstart", dragstart).on("drag", dragmove).on("dragend", dragend);
    var node_zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom);

    function dragstart(d, i) {
        force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy; 
      tick(); // this is the key to make it work together with updating both px,py,x,y on d !
    }

    function dragend(d, i) {
      d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
      tick();
      force.resume();
    }

    function zoom() {
      var zoom = d3.event;
      vis.attr("transform", "translate(" + zoom.translate + ")scale(" + zoom.scale + ")");
    }
    
    var node = vis.selectAll("g.node")
      .data(json.nodes)
      .enter().append("svg:g")
      .attr("class", "node")
      .call(node_drag)
      .call(node_zoom);

    node.append("svg:image").attr("class", "circle").attr("xlink:href", function (d){
      var IconLink="http://classic.battle.net/favicon.ico";

      // BOSSES
      if (d.name === "Diablo") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Diablo-icon.png";

      } else if (d.name === "Andariel") {
        IconLink="https://icons.iconarchive.com/icons/tooschee/medievalish-gaming/72/diablo-icon.png";
        
      //Locations
      } else if (d.name === "Rogue Encampment") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Town-Portal-icon.png";

      } else if (d.name === "Tristram") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Portal-to-Tristram-icon.png";

      } else if (d.name === "Rogue Monastery") {
        IconLink="https://icons.iconarchive.com/icons/lyle-zapato/archaeologicons/32/Trilith-icon.png";

      } else if (d.name === "Cairn Stones") {
        IconLink="https://icons.iconarchive.com/icons/lyle-zapato/archaeologicons/32/Trilith-icon.png";

      // NPCS
      } else if (d.name === "Akara") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Akara-icon.png";

      } else if (d.name === "Warriv") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Warriv-in-Lut-Gohlein-icon.png";

      } else if (d.name === "Gheed") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Gheed-icon.png";

      } else if (d.name === "Charsi") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Charsi-icon.png";

      } else if (d.name === "Kashya") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Kashya-icon.png";

      } else if (d.name === "Dark Wanderer") {
        IconLink="https://icons.iconarchive.com/icons/jonathan-rey/star-wars-characters/32/Anakin-Jedi-02-icon.png";
        // IconLink="https://www.windows10themes.net/wallpaper/cat/games/diablo-3-2013-wallpaper/thumbs/thumbs_daiabolos.ico";

      } else if (d.name === "Flavie") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Flavie-icon.png";

      } else if (d.name === "Jamella") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Jamella-icon.png";

      } else if (d.name === "Cain") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Deckard-Cain-icon.png";

      //ITEMS
      } else if (d.name === "Full Rejuv") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Full-Rejuvenation-icon.png";

      } else if (d.name === "Treasure Closed") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Treasure-Closed-icon.png";

      } else if (d.name === "Town Portal") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Town-Portal-icon.png";

      } else if (d.name === "Speech") {
        IconLink="http://classic.battle.net/images/battle/diablo2exp/images/npcs/speech.gif";

      } else if (d.name === "Gossip") {
        IconLink="http://classic.battle.net/images/battle/diablo2exp/images/npcs/speech.gif";

      //Character Classes
      } else if (d.name === "Barbarian") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Barbarian-icon.png";
        
      } else if (d.name === "Necromancer") {
        IconLink="https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Necromancer-icon.png";
      }

      return IconLink;
    })
    .attr("x", "-8px")
    .attr("y", "-8px")
    .attr("width", "16px")
    .attr("height", "16px")
    .on("mouseover", mouseover)     //|Tool tip check on hover/etc.
    .on("mousemove", mousemove)     //|
    .on("mouseleave", mouseleave);  //|

    node
      .append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

    //the converted JSON has rogue, maybe malformed, groups from networkx + comunity...
    //Thus, for each node that are undefined, remove
    node.filter(function(d) { return !d.name; }).remove(); //May need: d.name == "" check        

    force.on("tick", tick);

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };
  });
}


/*
https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Tyreal-icon.png
https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Sorceress-icon.png




claw:
https://iconarchive.com/show/archaeologicons-icons-by-lyle-zapato/Jamadhar-icon.html

scroll:
https://iconarchive.com/show/archaeologicons-icons-by-lyle-zapato/Scroll-icon.html

Cairn:
https://icons.iconarchive.com/icons/lyle-zapato/archaeologicons/32/Trilith-icon.png


http://classic.battle.net/favicon.ico
http://classic.battle.net/images/battle/diablo2exp/images/animations/npcs/act1/deckardcain.gif

"funny"
https://icons.iconarchive.com/icons/topicons/diablo-2/32/Clay-Golem-icon.png
https://icons.iconarchive.com/icons/topicons/diablo-2/32/Decard-Cain-icon.png
https://icons.iconarchive.com/icons/topicons/diablo-2/32/Skeleton-icon.png
https://icons.iconarchive.com/icons/topicons/diablo-2/32/Diablo-icon.png
https://icons.iconarchive.com/icons/topicons/diablo-2/32/Fire-Golem-icon.png
https://icons.iconarchive.com/icons/topicons/diablo-2/32/Killer-Cow-icon.png

https://static.wikia.nocookie.net/diablo_gamepedia/images/4/44/Betrayal_of_Harrogath_icon.png/revision/latest?cb=20091125131114
https://static.wikia.nocookie.net/diablo_gamepedia/images/4/44/Betrayal_of_Harrogath_icon.png/revision/latest/scale-to-width-down/120?cb=20091125131114
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/ec/Blade_of_the_Old_Religion_icon.png/revision/latest?cb=20091125130737
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/ec/Blade_of_the_Old_Religion_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130737
https://static.wikia.nocookie.net/diablo_gamepedia/images/2/2c/Den_of_Evil_icon.png/revision/latest?cb=20091125130309
https://static.wikia.nocookie.net/diablo_gamepedia/images/2/2c/Den_of_Evil_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130309
https://static.wikia.nocookie.net/diablo_gamepedia/images/4/45/Eve_of_Destruction_icon.png/revision/latest?cb=20090906102513
https://static.wikia.nocookie.net/diablo_gamepedia/images/4/45/Eve_of_Destruction_icon.png/revision/latest/scale-to-width-down/120?cb=20090906102513
https://static.wikia.nocookie.net/diablo_gamepedia/images/c/c5/Hell%27s_Forge_icon.png/revision/latest?cb=20090916194844
https://static.wikia.nocookie.net/diablo_gamepedia/images/c/c5/Hell%27s_Forge_icon.png/revision/latest/scale-to-width-down/120?cb=20090916194844
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/e5/Khalim%27s_Will_icon.png/revision/latest?cb=20091125130800
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/e5/Khalim%27s_Will_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130800
https://static.wikia.nocookie.net/diablo_gamepedia/images/d/d3/Lam_Esen%27s_Tome_icon.png/revision/latest?cb=20090906103210
https://static.wikia.nocookie.net/diablo_gamepedia/images/d/d3/Lam_Esen%27s_Tome_icon.png/revision/latest/scale-to-width-down/120?cb=20090906103210
https://static.wikia.nocookie.net/diablo_gamepedia/images/0/04/Prison_of_Ice_icon.png/revision/latest?cb=20091125131052
https://static.wikia.nocookie.net/diablo_gamepedia/images/0/04/Prison_of_Ice_icon.png/revision/latest/scale-to-width-down/120?cb=20091125131052
https://static.wikia.nocookie.net/diablo_gamepedia/images/d/d6/Radament%27s_Lair_icon.png/revision/latest?cb=20091125130534
https://static.wikia.nocookie.net/diablo_gamepedia/images/d/d6/Radament%27s_Lair_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130534
https://static.wikia.nocookie.net/diablo_gamepedia/images/8/89/Rescue_on_Mount_Arreat_icon.png/revision/latest?cb=20091125131038
https://static.wikia.nocookie.net/diablo_gamepedia/images/8/89/Rescue_on_Mount_Arreat_icon.png/revision/latest/scale-to-width-down/120?cb=20091125131038
https://static.wikia.nocookie.net/diablo_gamepedia/images/6/60/Rite_of_Passage_icon.png/revision/latest?cb=20091125131131
https://static.wikia.nocookie.net/diablo_gamepedia/images/6/60/Rite_of_Passage_icon.png/revision/latest/scale-to-width-down/120?cb=20091125131131
https://static.wikia.nocookie.net/diablo_gamepedia/images/2/20/Siege_on_Harrogath_icon.png/revision/latest?cb=20091125131013
https://static.wikia.nocookie.net/diablo_gamepedia/images/2/20/Siege_on_Harrogath_icon.png/revision/latest/scale-to-width-down/120?cb=20091125131013
https://static.wikia.nocookie.net/diablo_gamepedia/images/5/59/Sisters_to_the_Slaughter_icon.png/revision/latest?cb=20091125130504
https://static.wikia.nocookie.net/diablo_gamepedia/images/5/59/Sisters_to_the_Slaughter_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130504
https://static.wikia.nocookie.net/diablo_gamepedia/images/9/97/Sisters%27_Burial_Grounds_icon.png/revision/latest?cb=20091125130332
https://static.wikia.nocookie.net/diablo_gamepedia/images/9/97/Sisters%27_Burial_Grounds_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130332
https://static.wikia.nocookie.net/diablo_gamepedia/images/c/cb/Terror%27s_End_icon.png/revision/latest?cb=20090906102258
https://static.wikia.nocookie.net/diablo_gamepedia/images/c/cb/Terror%27s_End_icon.png/revision/latest/scale-to-width-down/120?cb=20090906102258
https://static.wikia.nocookie.net/diablo_gamepedia/images/7/7e/The_Arcane_Sanctuary_icon.png/revision/latest?cb=20091125130630
https://static.wikia.nocookie.net/diablo_gamepedia/images/7/7e/The_Arcane_Sanctuary_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130630
https://static.wikia.nocookie.net/diablo_gamepedia/images/0/03/The_Blackened_Temple_icon.png/revision/latest?cb=20091125130823
https://static.wikia.nocookie.net/diablo_gamepedia/images/0/03/The_Blackened_Temple_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130823
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/e2/The_Fallen_Angel_icon.png/revision/latest?cb=20091125130157
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/e2/The_Fallen_Angel_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130157
https://static.wikia.nocookie.net/diablo_gamepedia/images/b/bf/The_Forgotten_Tower_icon.png/revision/latest?cb=20091125130408
https://static.wikia.nocookie.net/diablo_gamepedia/images/b/bf/The_Forgotten_Tower_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130408
https://static.wikia.nocookie.net/diablo_gamepedia/images/9/95/The_Golden_Bird_icon.png/revision/latest?cb=20091125130720
https://static.wikia.nocookie.net/diablo_gamepedia/images/9/95/The_Golden_Bird_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130720
https://static.wikia.nocookie.net/diablo_gamepedia/images/b/b5/The_Guardian_icon.png/revision/latest?cb=20091125130836
https://static.wikia.nocookie.net/diablo_gamepedia/images/b/b5/The_Guardian_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130836
https://static.wikia.nocookie.net/diablo_gamepedia/images/1/1d/The_Horadric_Staff_icon.png/revision/latest?cb=20091125130555
https://static.wikia.nocookie.net/diablo_gamepedia/images/1/1d/The_Horadric_Staff_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130555
https://static.wikia.nocookie.net/diablo_gamepedia/images/5/58/The_Search_for_Cain_icon.png/revision/latest?cb=20091125130353
https://static.wikia.nocookie.net/diablo_gamepedia/images/5/58/The_Search_for_Cain_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130353
https://static.wikia.nocookie.net/diablo_gamepedia/images/a/ab/The_Seven_Tombs_icon.png/revision/latest?cb=20091125130703
https://static.wikia.nocookie.net/diablo_gamepedia/images/a/ab/The_Seven_Tombs_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130703
https://static.wikia.nocookie.net/diablo_gamepedia/images/5/58/The_Summoner_icon.png/revision/latest?cb=20091125130648
https://static.wikia.nocookie.net/diablo_gamepedia/images/5/58/The_Summoner_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130648
https://static.wikia.nocookie.net/diablo_gamepedia/images/2/2f/The_Tainted_Sun_icon.png/revision/latest?cb=20091125130614
https://static.wikia.nocookie.net/diablo_gamepedia/images/2/2f/The_Tainted_Sun_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130614
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/e8/Tools_of_the_Trade_icon.png/revision/latest?cb=20091125130427
https://static.wikia.nocookie.net/diablo_gamepedia/images/e/e8/Tools_of_the_Trade_icon.png/revision/latest/scale-to-width-down/120?cb=20091125130427


--CO PIOLOT: https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Valeera-icon.png
--https://icons.iconarchive.com/icons/iconfactory/diablo-2/32/Vault-Guard-icon.png
*/