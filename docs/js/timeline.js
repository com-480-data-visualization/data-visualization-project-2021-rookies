const unselectedColor = '#ccc'
const selectedColor = '#33C3F0'
const transitionDuration = 300

const height = window.innerHeight;
const width = window.innerWidth*0.9;
// The svg
var mapSvg = d3.select("svg")
            .attr('width', '100%')
            .attr('height', '100%')

    // Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(140)
  .center([10,50])
//   .translate([window.innerWidth / 2, window.innerHeight / 2]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .await(ready);

function ready(error, topo) {

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(transitionDuration)
      .attr('fill', unselectedColor)
    d3.select(this)
      .transition()
      .duration(transitionDuration)
      .attr('fill', selectedColor)
      .style("stroke", "#fff")
    }
    
    

  // Draw the map
  mapSvg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", unselectedColor)
      .style("stroke", "transparent")
      .style("stroke-width", 1)
      .attr("class", () => "Country")
      .attr("id", d => d.properties.name)
      .on("mouseover", mouseOver )
      .on("mouseleave", mapMouseLeave )
      
    
    d3.select('#highlight')
        .on('click',() => hightlightCountry('USA'))
}

let mapMouseLeave = function(d) {
    d3.selectAll(".Country")
    .transition()
    .duration(transitionDuration)
    .style("stroke", "transparent")
    .attr('fill', unselectedColor)
}

let hightlightCountry = (name) => {
    mapMouseLeave()
    d3.select('#' + name)
        .transition()
        .duration(transitionDuration)
        .attr('fill', selectedColor)
        .style("stroke", "#fff")
}


const margin = {top: 10, right: 30, bottom: 30, left: 60}
// const timelineWidth = 100
// const timelineHeight = '100%'
const timelineWidth = 460 - margin.left - margin.right
const timelineHeight = 500 - margin.top - margin.bottom

// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
d3.csv("../../data/example_timeline.csv",

  // When reading the csv, I must format variables:
//   function(d){
//     return { date : d3.timeParse("%Y")(d.date), value : d.value }
//   },// Now I can use this dataset:
  function(data) {
    var timelineSvg = d3.select("#timeline")
                .append("svg")
                .attr("width", timelineWidth + margin.left + margin.right)
                .attr("height", timelineHeight)

    // Add Y axis
    var y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.date))
            .rangeRound([timelineHeight - margin.top, margin.bottom])

    var yAxis = timelineSvg.append("g")
    .attr("transform","translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).tickFormat(d3.format(".0f")))

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = timelineSvg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", timelineWidth + margin.left + margin.right)
        .attr("height", timelineHeight) // + margin.top + margin.bottom
        .attr("x", 0)
        .attr("y", margin.top);

    // Create the scatter variable: where both the circles and the brush take place
    timelineSvg.append('g').attr("clip-path", "url(#clip)")

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [timelineWidth, timelineHeight]])
        .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    timelineSvg.append("rect")
        .attr("width", timelineWidth + margin.left + margin.right)
        .attr("height", timelineHeight + margin.top + margin.bottom)
        .style("fill", "none")
        .style("pointer-events", "all")
        // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);
    // now the user can zoom and it will trigger the function called updateChart

    timelineSvg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("cx", () => 100)
        .attr("cy", function(d) { return y(d.date) })
        .attr('opacity', 0.7)
        .attr("r", 10)
        .on('mouseover', timelineMouseOver)
        // .on('mousemouve', timelineMouseMouve)
        .on('mouseleave', timelineMouseLeave)
        
    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart() {
        // recover the new scale
        // var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with these new boundaries
        // xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY).tickFormat(d3.format(".0f")))

        timelineSvg.selectAll("circle")
                    .attr('cy', function(d) {return newY(d.date)});
    }


    function timelineMouseOver(d){
        hightlightCountry(d.country)
        // timelineSvg.selectAll('circle')
        //             .attr('opacity', 0.5)
        d3.select(this).attr('opacity', 1)
        d3.select('#timeline-description')
            .style("opacity", 1)
            .html(d.description)
            // .style("left", (this.cx.baseVal.value) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            // .style("top", (this.cy.baseVal.value-50) + "px")
    }
    // function timelineMouseMouve(d){
    //     console.log(d.description)
    // }
    function timelineMouseLeave(d){
        mapMouseLeave()
        timelineSvg.selectAll('circle')
                    .attr('opacity', 0.7)
        d3.select('#timeline-description')
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

})