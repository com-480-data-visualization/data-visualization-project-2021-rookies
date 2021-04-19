/*
    CHESSBOARD
*/

var board = null
var root = null
// var sample_node = null
var game = new Chess()
var whiteSquareGrey = 'rgba(240,217,181, 0.5)'
var blackSquareGrey = 'rgba(181,136,99, 0.5)'

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart (source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
    removeGreySquares()
  
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
  
    // illegal move
    if (move === null) return 'snapback'
  }
  
  function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    greySquare(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
  }
  
  function onMouseoutSquare (square, piece) {
    removeGreySquares()
  }
  
  function findNode(parent, name){
    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i]
        if (child.data.name == name) return child
    }
  }
  function onSnapEnd () {
    board.position(game.fen())
    if(root != null) {
        moves = game.history()
        node = root
        for (let i = 0; i < moves.length; i++) {
            node = findNode(node, moves[i])
            if (node == undefined) break;
        }
        if (node == undefined) {
            d3.select('#percentage').text("<0.1%")
            d3.select('#opening').text("This sequence didn't occur enough times in the dataset")
        } else if(node.data.name == "root"){
            resetAll()
        } else{
            displayInformation(node)
        }
    }
  }

  function undoMove(){
      game.undo()
      onSnapEnd()
  }

  d3.select("#undo-button").on('click', undoMove)

  function resetGame(){
    board.start()
    game = new Chess()
  }
  
  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard('myBoard', config)

/* 
    SUNBURST PLOT
*/

// Dimensions of sunburst.
var width = window.innerWidth / 2;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
const winRateDomain =[0.45, 0.6]
const scale = d3.scaleLinear().domain(winRateDomain)
                .range(['rgb(255,155,0)', 'rgb(120,0,117)'])
                .interpolate(d3.interpolateHcl);
const colorOpacity = 1

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition()
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

d3.text("../../../data/sunburst.json", function(text) {
    var json = JSON.parse(text)
  createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
//   drawLegend();

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius +5)
      .style("opacity", 0);

  // Turn the data into a d3 hierarchy and calculate the sums.
  root = d3.hierarchy(json)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });
  
  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition(root).descendants()
      .filter(function(d) {
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { 
            if (!d.depth || d.data.name == 'end') return 'none'
            else return null})
        // return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", d => scale(winRate(d)))
      .style("opacity", colorOpacity)
      .on("mouseover", mouseover)
      

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", resetAll)

  // Get total size of the tree = value of root node from partition.
  totalSize = path.datum().value;
 };

function winRate(d){
    const winSum = d.leaves().map(d => d.data.wins).reduce((a,b) => a+b)
    const sizeSum = d.leaves().map(d => d.data.size).reduce((a,b) => a+b)
    return winSum/sizeSum
}

// Fade all but the current sequence, and show it in the breadcrumb trail.
function displayInformation(d) {
    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
      percentageString = "< 0.1%";
    }
    if (d.descendants().length == 2){
        opening_name = d.descendants()[1].data.opening.replace(/\\/g, "") //Remove backslash in name
        d3.select('#opening').text(opening_name)
    } else {
          d3.select('#opening').text("")
    }
    
    
    d3.select("#percentage")
        .text(percentageString);
    
    d3.select("#explanation")
        .style("visibility", "");
    
    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift(); // remove root node from the array
    updateBreadcrumbs(sequenceArray, winRate(d));
    
    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);
    
    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(node => sequenceArray.indexOf(node) >= 0)
        .style("opacity", colorOpacity);
}
function mouseover(d) {
    // console.log('mouseover')
    displayInformation(d)

  //Update chess board
  moves = d.ancestors().map(d => d.data.name).reverse().slice(1)
  game = new Chess()
 for (let i = 0; i < moves.length; i++) {
    game.move(moves[i])
 }
  board.position(game.fen())
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", colorOpacity)
      .on("end", function() {
        d3.select(this).on("mouseover", mouseover);
      });

  d3.select("#explanation")
      .style("visibility", "hidden");
}

function resetAll(){
    mouseleave()
    resetGame()
}
d3.select("#reset-button").on('click', resetAll)

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, nodeWinRate) {

  // Data join; key function combines name and depth (= position in sequence).
  var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.data.name + d.depth; });

  // Remove exiting nodes.
  trail.exit().remove();

  // Add breadcrumb and label for entering nodes.
  var entering = trail.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", d => scale(winRate(d)))
      .style("opacity", colorOpacity);

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data.name; });

  // Merge enter and update selections; set position for all nodes.
  entering.merge(trail).attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.7) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((100*nodeWinRate).toPrecision(2)+'% win rate');

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  const gradient = [{offset: "0%", stopColor:"rgb(120,0,117)"}, 
                        {offset: "100%", stopColor:"rgb(255,155,0)"}]
  var legend = d3.select("#legend")
                 .append("svg:svg")
                 .attr('width', 30)
                 .attr('height', 500)
  legend.append('svg:text')
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text("Win rate legend");

  legend.append('defs')
  .append('linearGradient')
  .attr('id', 'gradient')
  .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%')
  .selectAll('stop')
  .data(gradient)
  .enter()
  .append('stop').attr('offset', d => d.offset).attr('stop-color', d => d.stopColor)

  legend.append('svg:rect')
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", 30)
        .attr("height", 500)
        .style('fill', 'url(#gradient)')
}