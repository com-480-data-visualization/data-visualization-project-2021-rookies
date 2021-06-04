var cy
function init_graph(json_data) {
  cy = cytoscape({

    container: document.getElementById('cy'), // container to render in
  
    elements:json_data, // list of graph elements to start with
    
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'haystack'
        }
      }
    ],
  
    // layout: {
    //   name: 'avsdf',
    //   nodeSeparation: 40
    //   //rows: 1
    // },
    layout: {
      name: 'euler',
      randomize: true,
      animate: false

      // some more options here...
    },
  
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
  
    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    minZoomedFontSize:15,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.2,
    pixelRatio: 'auto'
  
  });
}

//Variables for loading graph data and updating the infobox on the right

// const EDGES_FILENAME = "edges_16_08.json";
// const NODES_FILENAME = "nodes_16_08.json";

// const EDGES_FILENAME = "edges_16_08_classical_gt1700.json";
// const NODES_FILENAME = "nodes_16_08_classical_gt1700.json";

const EDGES_FILENAME = "edges_1808_sampled.json";
const NODES_FILENAME = "nodes_1808_sampled.json";

var nodes_properties = ["Elo", "id"]
var nodes_html_elems = []

var edges_properties = ["TimeControl", "Mode", "Site", "Opening", "wElo", "bElo", "wPseudo", "bPseudo", "wWin"]
var edges_html_elems = []

var active_edge = null;
var active_node = null;

//Variables for displaying and animating the chessboard
var currMove = 0;
var pgn;
var chess;
var chess1;
var pgn_moves;
let play = false;
var board = Chessboard('myBoard', 'start')
var playSpeed = 500;

//Reset the chessboard to its initial state
function reset_all() {
  currMove = 0;
  if (!active_edge) {
    return;
  }
  pgn = active_edge.data()['PGN']
  chess = new Chess();
  chess1 = new Chess();
  chess.load_pgn(pgn);
  pgn_moves = chess.history();
  play = false;
  board = Chessboard('myBoard', 'start');
}

//Display the "node" (=player) info in the infobox on the right
function update_html_node(node) {
  if (!node) {
    return;
  }
  var connected_edges = node.connectedEdges()
  nodes_html_elems.forEach(elem=>elem[1].textContent = node.data(elem[0]))
  document.getElementById("PlayerSite").setAttribute("href", "https://lichess.org/@/"+node.data("id"))
  if (!connected_edges[0]) {
    return;
  }
  var playerElo = connected_edges[0].data("wPseudo") == node.data("id") ? connected_edges[0].data("wElo") : connected_edges[0].data("bElo");
  document.getElementById("Elo").textContent = playerElo
  var totalGames = connected_edges.length;
  var totalTime = 0;
  connected_edges.forEach(edge => totalTime+=parseInt(edge.data("TimeControl").split("+")[0]))
  document.getElementById("nbrGames").textContent = totalGames
  document.getElementById("totalTime").textContent = totalTime+" seconds"
}

//Display the "edge" (=game) info in the infobox
function update_html_edge(edge) {
  if (!edge) {
    return;
  }
  edges_html_elems.forEach(elem=> {
    if (elem[0] == "wWin") {
      elem[1].textContent = edge.data()["wWin"] ? "White" : edge.data()["bWin"] ? "Black" : "None"
    } else if(elem[0] == "Site") {
      elem[1].setAttribute("href", edge.data(elem[0]))
    } else {
      elem[1].textContent = edge.data(elem[0])}
    }
    )
}

//Show wether the game on the infobox is the selected game or not
function update_active(isActive) {
  if (isActive) {
    document.getElementById("activeInfo").textContent = "Selected game"
  } else {
    document.getElementById("activeInfo").textContent = "Not selected"
  }
}

//Initialize the graph layouts and events with the JSON data
function init_webpage(json_data) {
  init_graph(json_data)
  filterGraph(elem => (currentEloFilter(elem) && currentModeFilter(elem)))
  toggle_loading();
  //Loading every html element with their id in the arrays
  nodes_properties.forEach(property_name => 
    nodes_html_elems.push([property_name, document.getElementById(property_name)])
  )
  edges_properties.forEach(property_name => 
    edges_html_elems.push([property_name, document.getElementById(property_name)])
  )
  add_graph_events();
}
function add_graph_events() {
  //Click on an edge to select it
  cy.on('click', 'edge', function(evt){
    var edge = evt.target;
    active_edge = edge;
    update_html_edge(edge)
    update_active(true)
    reset_all()
  });
  //Click on a node to select it
  cy.on('click', 'node', function(evt){
    var node = evt.target;
    active_node = node;
    update_html_node(node)
  });
}

//Fetching data from local JSON files and initiating webpage
var nodes_json;
var edges_json;
var data_json;
fetch('./'+NODES_FILENAME,{
  headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
.then(function(response){
  console.log(response)
  response.json().then(data=>nodes_json = data)
}).then(function(){
  fetch('./'+EDGES_FILENAME,{
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(function(response){
    console.log(response)
    edges_json = response.json().then(data=>edges_json = data).then(function(){
      data_json = {
        'nodes':nodes_json,
        'edges':edges_json,
      }
      init_webpage(data_json);
    })
    
  })
})

//Handles click on the "next move" button
function next_button() {
  if (play) {
    play = false
  }
  next_move()
}

//Display the next move of the selected game on the chessboard
function next_move() {
  if (currMove === pgn_moves.length) {
    reset_all()
    currMove = 0
  } else {
    chess1.move(pgn_moves[currMove])
    var fen = chess1.fen()
    board.position(fen, true)
    currMove++
  }
}

//Automatically play the game on the chessboard, with a move every 500ms
async function play_game() {
  play = true
  one_turn()
}

function one_turn() {
  if (play) {
    next_move()
    setTimeout(one_turn, playSpeed)
  }
}

//Pause the game if it is automatically played
function pause_game() {
  play=false
}

//Filter the graph
//Parameter : a function taking an edge as parameter and returning a boolean
async function filterGraph(conditionFunction) {
  console.log("filtering with"+conditionFunction)
  toggle_loading();
  reset_all();
  await new Promise(r => setTimeout(r, 50));
  console.log("filtering json");
  var filtered_edges = edges_json.filter(conditionFunction);
  console.log("initiating graph");
  init_graph(
    {
      'nodes':nodes_json,
      'edges':filtered_edges
    }
  )
  add_graph_events();
  console.log("removing empty nodes");
  remove_empty_nodes();
  reset_all();
  toggle_loading();
}

//******GAMEMODE FILTERING **/
//Functions for filtering the graph
function conditionModeBlitz(elem) {
  return elem.data.Mode == "Blitz"
}

function conditionModeClassical(elem) {
  return elem.data.Mode == "Classical"
}

var currentModeFilter = conditionModeClassical; 

const modeFilterData = [
  {
    "function" : conditionModeBlitz,
    "buttonId" : "filterModeBlitz"
  },
  {
    "function" : conditionModeClassical,
    "buttonId" : "filterModeClassical"
  },
]

modeFilterData.forEach((elem) => document.getElementById(elem["buttonId"]).onclick = function() {selectFilterMode(elem["function"])})

function selectFilterMode(filterFunction) {
  currentModeFilter = filterFunction;
  filterGraph(elem => (currentEloFilter(elem) && currentModeFilter(elem)))
}

//******ELO FILTERING **/

const ELO1=1400;
const ELO2=1600;
const ELO3=1800;

function conditionElo4(elem) {
  return elem.data.wElo>=ELO3 && elem.data.bElo>=ELO3
}

function conditionElo3(elem) {
  return elem.data.wElo>=ELO2 && elem.data.bElo>=ELO2 && elem.data.wElo<ELO3 && elem.data.bElo<ELO3
}

function conditionElo2(elem) {
  return elem.data.wElo>=ELO1 && elem.data.wElo<ELO2 && elem.data.bElo>=ELO1 && elem.data.bElo<ELO2
}

function conditionElo1(elem) {
  return elem.data.wElo<ELO1 && elem.data.bElo<ELO1
}

var currentEloFilter = conditionElo4;

const eloFilterData = [
  {
    "function" : conditionElo1,
    "buttonId" : "filterElo1"
  },
  {
    "function" : conditionElo2,
    "buttonId" : "filterElo2"
  },
  {
    "function" : conditionElo3,
    "buttonId" : "filterElo3"
  },
  {
    "function" : conditionElo4,
    "buttonId" : "filterElo4"
  }
]

eloFilterData.forEach((elem) => document.getElementById(elem["buttonId"]).onclick = function() {selectFilterElo(elem["function"])})

function selectFilterElo(filterFunction) {
  currentEloFilter = filterFunction;
  filterGraph(elem => (currentEloFilter(elem) && currentModeFilter(elem)))
}

function remove_empty_nodes() {
  cy.nodes(function(element){
    if( element.isNode() && element.degree()<1){
        cy.remove(element)
    }
  })
}

var sliderSpeed = document.getElementById("playSpeed");

// Update the current slider value (each time you drag the slider handle)
sliderSpeed.oninput = function() {
  const MAXSPEED = 200;
  const MINSPEED = 1500;
  playSpeed = MINSPEED - this.value + MAXSPEED;
  //document.getElementById("displaySpeed").textContent = playSpeed
} 

document.getElementById("playGame").onclick = play_game;
document.getElementById("pauseGame").onclick = pause_game;
document.getElementById("nextMove").onclick = next_button;
document.getElementById("resetBoard").onclick = reset_all;

function toggle_loading() {
  var htmlElem = document.getElementById("loading")
  if (htmlElem.style.display === "none") {
    htmlElem.style.display = "block";
  } else {
    htmlElem.style.display = "none";
  }
}

