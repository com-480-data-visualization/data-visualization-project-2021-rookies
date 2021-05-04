// set the dimensions and margins of the graph
var margin = {top: 80, right: 25, bottom: 30, left: 40},
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {
d3.csv("../../data/heatmap1split.csv", function(data) {

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.group;}).keys()
  var myVars = d3.map(data, function(d){return d.variable;}).keys()

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  var myColor = d3.scaleLinear()
  .domain([0,0.04])
  .range(['#FBF6EE', 'rgb(172,125,88)'])
  
  // create a tooltip
  var tooltip = d3.select("#heatmap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "0.5px")
    .style("border-radius", "5px")
    .style("border-color", "#777")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "white")
      .style("opacity", 0.5)
  }
  var mousemove = function(d) {
    tooltip
      .html(`<div class="tooltip-text">This square is used <br\>${Math.round(10000*d.value) /100.0}% of the time.</div>`)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1] + 20) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
  }

  let squares = svg.selectAll()
    .data(data.filter(d => d.Elo == 1000))
    .enter()
    .append("rect")
    .style("opacity", 0.9)
    .attr("x", function(d) { return x(d.group)})
    .attr("y", function(d) { return y(d.variable)})
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("fill", d => myColor(d.value)) 
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    function updateSquares(data){
        squares.data(data)
        .transition()
        .duration(500)
        .style("fill", d => myColor(d.value)) 
    }
  
    
    elo1000Button = d3.select('#elo_1000')
    elo3000Button = d3.select('#elo_3000')

    elo1000Button.on('click', function() {
        elo3000Button.classed('button-primary', false);
        elo1000Button.classed('button-primary', true);
        updateSquares(data.filter(d => d.Elo == 1000));
    });
    elo3000Button.on('click', function() {
        elo1000Button.classed('button-primary', false);
        elo3000Button.classed('button-primary', true);
        updateSquares(data.filter(d => d.Elo == 3000));
    });
})

// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Position heatmap");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("The most common positions on the board.");

