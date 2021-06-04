// Array representation of pieces
var pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'R', 'N', 'B', 'Q', 'K', 'P'];
var pieces_img = ['bR', 'bN', 'bB', 'bQ', 'bK', 'bP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'wP']
var piecesKinds = ['R', 'N', 'B', 'Q', 'K', 'P'];
var piecesNames = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Pawn'];

// Chessboard configuration for showing moves
var fens = {bR: '8/8/8/8/1K2r3/8/8/7k b - - 0 1',
            bN: '8/8/8/2K5/4n3/8/8/7k b - - 0 1',
            bB: '8/8/2K5/8/4b3/8/8/7k b - - 0 1',
            bQ: '8/1K6/8/8/4q3/8/8/7k b - - 0 1',
            bK: '8/8/8/8/3Pk3/8/8/7K b - - 0 1',
            bP: '8/8/4p3/3K4/8/8/8/7k b - - 0 1',
            wR: '8/8/8/8/1k2R3/8/8/7K w - - 0 1',
            wN: '8/8/8/2k5/4N3/8/8/7K w - - 0 1',
            wB: '8/8/2k5/8/4B3/8/8/7K w - - 0 1',
            wQ: '8/1k6/8/8/4Q3/8/8/7K w - - 0 1',
            wK: 'k7/8/8/8/3Kp3/8/8/8 w - - 0 1',
            wP: '8/8/8/3k4/4P3/8/8/7K w - - 0 1'
          };

// Chessboard configuration for start position  
var fensStart = {bR: 'r3k2r/8/8/8/8/8/8/R3K2R b - - 0 1',
          bN: '1n2k1n1/8/8/8/8/8/8/1N2K1N1 b - - 0 1',
          bB: '2b1kb2/8/8/8/8/8/8/2B1KB2 b - - 0 1',
          bQ: '3qk3/8/8/8/8/8/8/3QK3 b - - 0 1',
          bK: '4k3/8/8/8/8/8/8/4K3 b - - 0 1',
          bP: '4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 b - - 0 1',
          wR: 'r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1',
          wN: '1n2k1n1/8/8/8/8/8/8/1N2K1N1 w - - 0 1',
          wB: '2b1kb2/8/8/8/8/8/8/2B1KB2 w - - 0 1',
          wQ: '3qk3/8/8/8/8/8/8/3QK3 w - - 0 1',
          wK: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
          wP: '4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1'
        };

// Move for capturing piece
var moveCaptures = {bR: 'e4-b4',
        bN: 'e4-c5',
        bB: 'e4-c6',
        bQ: 'e4-b7',
        bK: 'e4-d4',
        bP: 'e6-d5',
        wR: 'e4-b4',
        wN: 'e4-c5',
        wB: 'e4-c6',
        wQ: 'e4-b7',
        wK: 'd4-e4',
        wP: 'e4-d5'
};

// Showcasing the moves
var moveClassic = {bR: ['e4-e6', 'e6-f6', 'f6-f2'],
        bN: ['e4-d6', 'd6-f7', 'f7-e5'],
        bB: ['e4-f3', 'f3-h5', 'h5-e8'],
        bQ: ['e4-c2', 'c2-c7', 'c7-g3'],
        bK: ['e4-f4', 'f4-f3', 'f3-e2'],
        bP: ['e6-e5', 'e5-e4', 'e4-e3'],
        wR: ['e4-e6', 'e6-f6', 'f6-f2'],
        wN: ['e4-d6', 'd6-f7', 'f7-e5'],
        wB: ['e4-f3', 'f3-h5', 'h5-e8'],
        wQ: ['e4-c2', 'c2-c7', 'c7-g3'],
        wK: ['d4-c3', 'c3-b3', 'b3-b4'],
        wP: ['e4-e5', 'e5-e6', 'e6-e7']
};


// For barplot
var segmentWidth = 500;
var colorScale = d3.scaleOrdinal()
.domain(pieces)
.range(['#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5']);


// On loading the page, load json file and display page for selected piece
function load_page(){
  d3.json("stats_pieces.json", function(data) {
    eats = data.Eats;
    nMoves = data.NumberOfMoves;
    lifeSpan = data.LifeSpan;
    eatenBy = data.EatenBy;
    favVictim = data.Favorite_victim;
    worstEnnemy = data.Worst_ennemy;

    piece = 'N';
    selectImage(5);
  });

}

load_page();


// When one piece is selected, display its page
function selectImage(i) {
  // Scale back the previous piece
  img = document.getElementById("piece-img-"+pieces.indexOf(piece));
  img.style.transform = "scale(1)";
  img.style.transition = "transform 0.25s ease";

  // Update current piece
  piece = pieces[i];

  // Scale newly selected piece
  img = document.getElementById("piece-img-"+i);
  img.style.transform = "scale(1.4)";
  img.style.transition = "transform 0.25s ease";

  // Clear stats divs
  clearEveryStats();

  // Display current piece
  var elem = document.createElement("img");
  elem.src =  "../../assets/img/chesspieces/current/"+pieces_img[pieces.indexOf(piece)]+".png";
  elem.style.width = '40%';
  document.getElementById("current-piece").appendChild(elem);

  // Update textual descriptions
  d3.json("text_pieces.json", function(data) {
    descriptions = data.descriptions;
    textStartPos = data.textStartPos;
    textMoves = data.textMoves;
    textStats = data.textStats;
    document.getElementById("general-piece-description").innerHTML = descriptions[pieces_img[pieces.indexOf(piece)]]; 
    document.getElementById("start-position").innerHTML = textStartPos[pieces_img[pieces.indexOf(piece)]];
    document.getElementById("moves-description").innerHTML = textMoves[pieces_img[pieces.indexOf(piece)]];
    document.getElementById("stats-description").innerHTML = textStats[pieces_img[pieces.indexOf(piece)]];
    document.getElementById("precise-stats-decription").innerHTML = 'Here are some interesting statistics: how often does it captures others pieces and how often it is captured by other pieces.';
  });

  


  // Display Worst ennemy 
  // Kings don't have a worst ennemy because they are never captured
  if(piece!='K' && piece!='k') {
    var t = document.createTextNode("Worst Ennemy : ");
    document.getElementById("worstEnnemy").appendChild(t);

    var elem = document.createElement("img");
    elem.src =  "../../assets/img/chesspieces/wikipedia/"+pieces_img[pieces.indexOf(worstEnnemy[piece])]+".png";
    document.getElementById("worstEnnemy").appendChild(elem);
  }

  // Display favorite victim
  var t = document.createTextNode("Favorite Victim : ");
  document.getElementById("favVictim").appendChild(t);

  var elem = document.createElement("img");
  elem.src =  "../../assets/img/chesspieces/wikipedia/"+pieces_img[pieces.indexOf(favVictim[piece])]+".png";
  document.getElementById("favVictim").appendChild(elem);

  // Display nmoves and lifespan
  var t_moves = document.createTextNode("Average number of moves : "+ nMoves[piece]);
  document.getElementById("nMoves").appendChild(t_moves);

  var t_life = document.createTextNode("Expected lifespan : "+ lifeSpan[piece]);
  document.getElementById("lifespan").appendChild(t_life);

  // Display stats
  showEatsDataSinglePiece(eats, piece);
  showEatenByDataSinglePiece(eatenBy, piece);

  // Display chessboard moves
  createChessBoard(pieces_img[pieces.indexOf(piece)], fens, 'board-moves');

  // Display chessboard start position
  createChessBoard(pieces_img[pieces.indexOf(piece)], fensStart, 'board-start');
}

// Handy function to clear the divs
function clearEveryStats() {
  d3.select("#current-piece").html("");
  d3.select(".statsEats").html("");
  d3.select(".statsEatenBy").html("");
  d3.select(".worstEnnemy").html("");
  d3.select(".favVictim").html("");
  d3.select(".nMoves").html("");
  d3.select(".lifespan").html("");
}


// Create all the divs for the barplot 
function createEatsDivs(piece) {

  d3.select(".statsEats")
      .append("div")
      .attr("class", "bold")
      .text("How often does it ... ")
      .style('fill', 'darkOrange')
      .append("div")
      .attr("class","titleStats")
      .attr("id", "title-eats");

  piecesKinds.forEach(p => {
    if (p != 'K' & p != 'k'){
      d3.select(".statsEats")
        .append("text")
        .text("Captures a "+piecesNames[piecesKinds.indexOf(p)])
        .append("div")
        .attr("class","eats"+p)
        .attr("id", "eats"+p);
      }
    });
}

function createEatenByDivs(piece) {

  d3.select(".statsEatenBy")
        .append("div")
        .attr("class", "bold")
        .text("How often is it ... ")
        .append("div")
        .attr("class","titleStats")
        .attr("id", "title-eatenby");

  piecesKinds.forEach(p => {
      d3.select(".statsEatenBy")
        .append("text")
        .text("Captured by a "+piecesNames[piecesKinds.indexOf(p)])
        .append("div")
        .attr("class","eatenBy"+p)
        .attr("id", "eatenBy"+p);
    });
}

// Creates visualisation of bar plots - how much a piece has eaten another
function showEatsDataSinglePiece(d, piece) {
      d3.select(".statsEats").html("");
      createEatsDivs();
      
      d[piece].forEach(function(percentage, index){
        if (percentage>0){
          oneBar('.eats' + pieces[index].toUpperCase(), piece, percentage);
        }
      });
}

// Creates visualisation of bar plots - how much a piece has been eaten by another
function showEatenByDataSinglePiece(d, piece) {
  
  d3.select(".statsEatenBy").html("");
  if (piece != 'K' & piece != 'k'){
    createEatenByDivs();
    d[piece].forEach(function(percentage, index){
      if (percentage>0){
        oneBar('.eatenBy' + pieces[index].toUpperCase(), piece, percentage);
      }
    });
  }
}

// Displays one animated bar
function oneBar(piece, currentPiece, percentage) { 
  // piece: piece for which the stats are shown 
  // currentPiece: stats w/ respect to the currentPiece 

  var svg = d3.select(piece)
		.append('svg')
		.attr('height', 50)
		.attr('width', 500);

	svg.append('rect')
		.attr('class', 'bg-rect')
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('fill', 'gray')
		.attr('height', 15)
		.attr('width', function(){
			return segmentWidth;
		})
		.attr('x', 0);

	var progress = svg.append('rect')
					.attr('class', 'progress-rect')
					.attr('fill', function(){
						return colorScale(currentPiece);
					})
					.attr('height', 15)
					.attr('width', 0)
					.attr('rx', 10)
					.attr('ry', 10)
					.attr('x', 0);

	progress.transition()
		.duration(1000)
		.attr('width', function(){
			var index = pieces.indexOf(currentPiece);
			return (index + 1) * segmentWidth;
		});

  // Animation of the transition
	function moveProgressBar(state){
		progress.transition()
			.duration(1000)
			.attr('fill', function(){
				return colorScale(state);
			})
			.attr('width', function(){
				return percentage * segmentWidth;
			});
	}
  moveProgressBar(piece)
}


/* CHESSBOARD */

function createChessBoard(p, fens, idDiv) {
  // NOTE: this uses the chess.js library:
  // https://github.com/jhlywa/chess.js

  var board = null

  var config = {
    draggable: false,
    position: fens[p]
  }

  // On click of the button 'Capture', move the piece so that it captures the other one
  board = Chessboard(idDiv, config)
  $('#captBtn').on('click', function () {
    board = Chessboard(idDiv, config)
    moves(moveCaptures[p]);
    
  })

  // On click of the button 'Move', move the piece following the path defined above
  $('#moveBtn').on('click', function () {
    board = Chessboard(idDiv, config)
    threeMoves(moveClassic[p]);
  })

  // Do not move the piece immediatly after clicking the button
  function moves(move) {
    setTimeout(function () {
       board.move(move)
    }, 700);
}

  // Wait a bit between every move of the piece
  function threeMoves(moves) {
    setTimeout(function () {
      board.move(moves[0])
      setTimeout(function () {
        board.move(moves[1])
        setTimeout(function () {
          board.move(moves[2])
       }, 1000);
     }, 1000);
   }, 1000);
  }

}