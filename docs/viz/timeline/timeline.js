const unselectedColor = '#ccc'
const selectedColor = '#33C3F0'
const transitionDuration = 50

const height = window.innerHeight;
const width = window.innerWidth*0.9;
// The svg
var mapSvg = d3.select("svg")

    // Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(140)
  .center([10,50])

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .await(ready);

function ready(error, topo) {
    d3.csv("chess_timeline.csv", function(data) {
    const countries = data.map(d => d.country).concat("Europe")
    console.log(countries)
    const colorScale = d3.scaleOrdinal()
                        .domain(countries)
                        .range(d3.schemeSet2)
  
    let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(transitionDuration)
      .attr('fill', unselectedColor)
    d3.select(this)
      .transition()
      .duration(transitionDuration)
      .attr('fill',  countries.includes(this.id) ? colorScale(this.id) : unselectedColor)
      .style("stroke", "#fff")
    }

    let mapMouseLeave = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(transitionDuration)
        .style("stroke", "transparent")
        .attr('fill', unselectedColor)
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
      
        
        
    const europe = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "England"]
    let hightlightCountry = (name) => {
        mapMouseLeave()
        if (name == "Europe"){
            europe.map(name => d3.select('#' + name)
            .transition()
            .duration(transitionDuration)
            .attr('fill', colorScale("Europe"))
            .style("stroke", "#fff"))
        } else {
            d3.select('#' + name)
            .transition()
            .duration(transitionDuration)
            .attr('fill', colorScale(name))
            .style("stroke", "#fff")
        }
    }
    
    
    const margin = {top: 10, right: 30, bottom: 10, left: 60}
    const timelineWidth = 300 - margin.left - margin.right
    const timelineHeight = 450 - margin.top - margin.bottom
    
    var timelineSvg = d3.select("#timeline")
            .append("svg")
            .attr("width", timelineWidth + margin.left + margin.right)
            .attr("height", timelineHeight)

    // Add Y axis
    var y = d3.scaleLinear()
            .domain([2020, 450])
            .rangeRound([timelineHeight - margin.top, margin.bottom])

    var yAxis = timelineSvg.append("g")
    .attr("transform","translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).tickFormat(d3.format(".0f")))

     // Y axis label:
     timelineSvg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -margin.top - timelineHeight/2 + 20)
        .text("Year")

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
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.2) and zoom (x20)
        .extent([[0, 0], [timelineWidth, timelineHeight]])
        .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        timelineSvg.append("rect")
        .attr("id", "zoom-rect")
        .attr("width", timelineWidth + margin.left + margin.right)
        .attr("height", timelineHeight + margin.top + margin.bottom)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(zoom)
    
    timelineSvg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("fill", d => colorScale(d.country))
        .attr("stroke", "none")
        .attr("cx", (d,i) => 100 + (i %2 == 0 ? 20: 0))
        .attr("cy", function(d) { return y(d.date) })
        .attr('opacity', 0.7)
        .attr("r", 10)
        .on('mouseover', timelineMouseOver)
        .on('mouseleave', timelineMouseLeave)
        
    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart() {
        // recover the new scale
        var newY = d3.event.transform.rescaleY(y);
        // update axes with these new boundaries
        yAxis.call(d3.axisLeft(newY).tickFormat(d3.format(".0f")))

        timelineSvg.selectAll("circle")
                    .attr('cy', function(d) {return newY(d.date)});
    }

    
    function timelineMouseOver(d){
        hightlightCountry(d.country)
        d3.select(this)
            .attr('opacity', 1)
            .attr('stroke', "#ccc")
            .attr('stoke-width', 1)
            .attr('r', 12)
        d3.select('#timeline-country')
            .html(d.country)
        d3.select('#timeline-text')
            .html(d.description)
    }
    function timelineMouseLeave(d){
        mapMouseLeave()
        timelineSvg.selectAll('circle')
                    .attr('opacity', 0.9)
                    .attr('stroke', "none")
                    .attr('r', 10)
    }

    })
        
}