var width = 960,
  height = 500,
  radius = 6;

var force = d3.layout.force()
  .gravity(.05)
  .charge(-120)
  .linkDistance(80)
  .size([width, height]);

var header = d3.select("#graph").insert("h1")
    .text("Title");

var svg = d3.select("#graph").append("svg")
  .attr("width", width)
  .attr("height", height);


function update() {
  var color = d3.scale.category20();
  header.text(filename);

  force
    .nodes(data.nodes)
    .links(data.links)
    .start();

  var link = svg.selectAll(".link")
    .data(data.links);

  var node = svg.selectAll(".node")
    .data(data.nodes);

  node.exit().remove();
  link.exit().remove();

  link.enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) {
      if ("value" in d) {
        return Math.sqrt(d.value);
      } else {
        return 1;
      }
    });

  var groups = node.enter()
    .append("g")
    .attr("class", "node");

    groups.append("circle").attr("r", function(d) {
      if ("id" in d) { return 5; }
      else { return 0; }
    })
    .style("fill", function(d) { return color(d.value); })
    .call(force.drag);

    groups.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text("hi");

  node.selectAll("text")
  .text(function(d) {
      if ("label" in d) {
        return d.label;
      } else {
        return d.id;
      }
    }
  );

  force.on("tick", function() {
    link.attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

      node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  // EXIT
  // Remove old elements as needed.
}

var data;
function clean_nodes(json) {
  //I added an extra node to the karate dataset b/c the
  //links started with index of 1 instead of 0
  if (!('id' in json.nodes[0])) {
    json.nodes = json.nodes.slice(1);
    json.links.forEach(function (d){
      d.source = d.source - 1;
      d.target = d.target - 1;
    })
  }
  // if ("value" in json.nodes[0]){
  //   json.nodes = json.nodes.sort(function(a, b) { return a.value - b.value; });
  // }
  return json;
}

function read_json(fn){
  //Brute force clear data before reading next file
  data = {"nodes": [], "links": []};
  update();
  d3.json(fn, function(error, json) {
    if (error) {
      throw error;
    }
    filename = fn;
    data = clean_nodes(json);
    update();
  });
}
var filename = "lesmis.json";
read_json(filename)