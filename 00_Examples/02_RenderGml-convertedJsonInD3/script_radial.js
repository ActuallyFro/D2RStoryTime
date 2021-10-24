var header = d3.select("#circle").insert("h1")
    .text("Title");

var diameter = 500,
    radius = diameter / 2,
    margin = 20,
    graph,
    filename = "lesmis.json";

// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("id");

    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("id", "tooltip");

    var offset = tooltip.node().getBBox().width / 2 + 100;

    if ((x - offset) < -radius) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (radius)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}


var svg  = d3.select("body").select("#circle")
    .append("svg")
    .attr("width", diameter + 200)
    .attr("height", diameter + 200);

svg.append("g")
    .attr("id", "plot")
    .attr("transform", "translate(" + (radius + 100) + ", " + (radius + 100) + ")");

// Draws an arc diagram for the provided undirected graph
function drawGraph() {
    // create svg image

    header.text(filename);

    graph.nodes.forEach(function(d, i) {
      if ("label" in d) {
        graph.nodes[i].name = d.label;
      } else {
        graph.nodes[i].name = d.id;
      }
    });
    // console.log(graph);

    // fix graph links to map to objects instead of indices
    graph.links.forEach(function(d, i) {
        d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
        d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
    });

    // calculate node positions
    circleLayout(graph.nodes);

    // draw edges first
    drawLinks(graph.links);
    // drawCurves(graph.links);

    // draw nodes last
    drawNodes(graph.nodes);
}

// Calculates node locations
function circleLayout(nodes) {
    // use to scale node index to theta value
    var scale = d3.scale.linear()
        .domain([0, nodes.length])
        .range([0, 2 * Math.PI]);

    // calculate theta for each node
    nodes.forEach(function(d, i) {
        // calculate polar coordinates
        var theta  = scale(i);
        var radial = radius - margin;

        // convert to cartesian coordinates
        d.x = radial * Math.sin(theta);
        d.x1 = (10+radial) * Math.sin(theta);
        d.y = radial * Math.cos(theta);
        d.y1 = (10+radial) * Math.cos(theta);
    });
}

// Draws nodes with tooltips
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scale.category20();

    var nodeData = d3.select("#plot").selectAll(".node")
      .data(nodes);
    var nodeGroups = nodeData
                      .enter()
                        .append("g")
                        .attr("class", "node");

    nodeGroups.append("text")
      .attr("class", "rtext")
      .attr("x", function(d) { return d.x1; })
      .attr("y", function(d) { return d.y1; })
      .attr("text-anchor", function(d) { return d.x < 0 ? "end" : "start"; })
      .attr("transform", function(d) {
        if ( d.x < 0 ) {
          return "rotate(" + -d.y1 / 3.14 + ", " + d.x1 + "," + d.y1 + ")";
        } else {
          return "rotate(" + d.y1 / 3.14 + ", " + d.x1 + "," + d.y1 + ")";
        }
      })
      .text(function(d) { return d.name; });

    nodeGroups
        .append("circle")
        .attr("id", function(d) { return d.name; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 5)
        .style("fill", function(d) { return color(d.value); })
        .on("mouseover", function() { addTooltip(d3.select(this)); })
        .on("mouseout", function() { d3.select("#tooltip").remove(); });

    nodeData.exit().remove();
}

// Draws straight edges between nodes
function drawLinks(links) {
    var linkData = d3.select("#plot").selectAll(".link")
                    .data(links);

     linkData
      .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    linkData.exit().remove();
}

// Draws curved edges between nodes
function drawCurves(links) {
    // remember this from tree example?
    var curve = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });

    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", curve);
}

function clean_nodes(json) {
  //I added an extra node to the karate dataset b/c the
  //links started with index of 1 instead of 0
  var data = json;
  if (!("id" in json.nodes[0])) {
    data.nodes = json.nodes.slice(1);
    data.links.forEach(function (d){
      d.source = d.source - 1;
      d.target = d.target - 1;
    });
  }
  // if ("value" in json.nodes[0]){
  //   json.nodes = json.nodes.sort(function(a, b) { return b.value - a.value; });
  // }
  return data;
}


function read_json(fn){
  //Brute force clear data before reading next file
  graph = {"nodes": [], "links": []};
  drawGraph();
  d3.json(fn, function(error, json) {
    if (error) {
      throw error;
    }
    filename = fn;
    graph = clean_nodes(json);
    drawGraph();
  });
}

read_json(filename);