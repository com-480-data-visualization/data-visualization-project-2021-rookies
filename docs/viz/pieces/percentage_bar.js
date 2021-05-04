// python -m http.server
// http://localhost:8000/html/percentage_bar.html

var pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'R', 'N', 'B', 'Q', 'K', 'P'];
var pieces_img = ['bR', 'bN', 'bB', 'bQ', 'bK', 'bP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'wP']
var piecesKinds = ['R', 'N', 'B', 'Q', 'K', 'P'];
var piecesNames = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Pawn'];
var fens = {bR: '8/8/8/8/1K2r3/8/8/7k b - - 0 1',
            bN: '8/8/8/2K5/4n3/8/8/7k b - - 0 1',
            bB: '8/8/2K5/8/4b3/8/8/7k b - - 0 1',
            bQ: '8/1K6/8/8/4q3/8/8/7k b - - 0 1',
            bK: '8/8/8/8/4k3/8/8/7K b - - 0 1',
            bP: '8/8/4p3/3K4/8/8/8/7k b - - 0 1',
            wR: '8/8/8/8/1k2R3/8/8/7K w - - 0 1',
            wN: '8/8/8/2k5/4N3/8/8/7K w - - 0 1',
            wB: '8/8/2k5/8/4B3/8/8/7K w - - 0 1',
            wQ: '8/1k6/8/8/4Q3/8/8/7K w - - 0 1',
            wK: 'k7/8/8/8/4K3/8/8/8 w - - 0 1',
            wP: '8/8/8/3k4/4P3/8/8/7K w - - 0 1'
          };

var descriptions = {
    bR: 'Text about piece',
    bN: 'Text about piece',
    bB: 'Text about piece',
    bQ: 'Text about piece',
    bK: 'Text about piece',
    bP: 'Text about piece',
    wR: 'Text about piece',
    wN: 'Text about piece',
    wB: 'Text about piece',
    wQ: 'Text about piece',
    wK: 'Text about piece',
    wP: 'Text about piece'
}

var textMoves = {
  bR: 'Text about general moves',
  bN: 'Text about general moves',
  bB: 'Text about general moves',
  bQ: 'Text about general moves',
  bK: 'Text about general moves',
  bP: 'Text about general moves',
  wR: 'Text about general moves',
  wN: 'Text about general moves',
  wB: 'Text about general moves',
  wQ: 'Text about general moves',
  wK: 'Text about general moves',
  wP: 'Text about general moves'
}


var textStats = {
  bR: 'Text about general stats',
  bN: 'Text about general stats',
  bB: 'Text about general stats',
  bQ: 'Text about general stats',
  bK: 'Text about general stats',
  bP: 'Text about general stats',
  wR: 'Text about general stats',
  wN: 'Text about general stats',
  wB: 'Text about general stats',
  wQ: 'Text about general stats',
  wK: 'Text about general stats',
  wP: 'Text about general stats'
}


var preciseStats = {
  bR: 'Some more precise stats',
  bN: 'Some more precise stats',
  bB: 'Some more precise stats',
  bQ: 'Some more precise stats',
  bK: 'Some more precise stats',
  bP: 'Some more precise stats',
  wR: 'Some more precise stats',
  wN: 'Some more precise stats',
  wB: 'Some more precise stats',
  wQ: 'Some more precise stats',
  wK: 'Some more precise stats',
  wP: 'Some more precise stats'
}

var segmentWidth = 500;

var colorScale = d3.scaleOrdinal()
.domain(pieces)
.range(['#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5', '#b58863', '#f0d9b5']);


function load_page(){
  d3.json("../../data/stats_pieces.json", function(data) {
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
  document.getElementById("general-piece-description").innerHTML = descriptions[pieces_img[pieces.indexOf(piece)]]; 
  document.getElementById("moves-description").innerHTML = textMoves[pieces_img[pieces.indexOf(piece)]];
  document.getElementById("stats-description").innerHTML = textStats[pieces_img[pieces.indexOf(piece)]];
  document.getElementById("precise-stats-decription").innerHTML = preciseStats[pieces_img[pieces.indexOf(piece)]];


  // Display Worst ennemy and favorite victim
  if(piece!='K' && piece!='k') {
    
    var t = document.createTextNode("Worst Ennemy : ");
    document.getElementById("worstEnnemy").appendChild(t);

    var elem = document.createElement("img");
    elem.src =  "../../assets/img/chesspieces/wikipedia/"+pieces_img[pieces.indexOf(worstEnnemy[piece])]+".png";
    document.getElementById("worstEnnemy").appendChild(elem);
  }

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

  // Display chessboard
  createChessBoard(pieces_img[pieces.indexOf(piece)]);
}

function clearStats() {
  d3.select(".statsEats").html("");
  d3.select(".statsEatenBy").html("");
}

function clearEveryStats() {
  d3.select("#current-piece").html("");
  d3.select(".statsEats").html("");
  d3.select(".statsEatenBy").html("");
  d3.select(".worstEnnemy").html("");
  d3.select(".favVictim").html("");
  d3.select(".nMoves").html("");
  d3.select(".lifespan").html("");
}


function createEatsDivs(piece) {

  d3.select(".statsEats")
      .append("text")
      .text("How often does it ... ")
      .append("div")
      .attr("class","titleStats")
      .attr("id", "title-eats");

  piecesKinds.forEach(p => {
    if (p != 'K'){
      d3.select(".statsEats")
        .append("text")
        .text("Captures the "+piecesNames[piecesKinds.indexOf(p)])
        .append("div")
        .attr("class","eats"+p)
        .attr("id", "eats"+p);
      }
    });
}

function createEatenByDivs(piece) {

  d3.select(".statsEatenBy")
        .append("text")
        .text("How often is it ... ")
        .append("div")
        .attr("class","titleStats")
        .attr("id", "title-eatenby");

  piecesKinds.forEach(p => {
      d3.select(".statsEatenBy")
        .append("text")
        .text("Captured by the "+piecesNames[piecesKinds.indexOf(p)])
        .append("div")
        .attr("class","eatenBy"+p)
        .attr("id", "eatenBy"+p);
    });
}

function showEatsDataSinglePiece(d, piece) {
      //clearStats();
      d3.select(".statsEats").html("");
      createEatsDivs();
      
      d[piece].forEach(function(percentage, index){
        if (percentage>0){
          oneBar('.eats' + pieces[index].toUpperCase(), piece, percentage);
        }
      });
}

function showEatenByDataSinglePiece(d, piece) {
  //clearStats();
  
  d3.select(".statsEatenBy").html("");
  if (piece != 'K'){
    createEatenByDivs();
    d[piece].forEach(function(percentage, index){
      if (percentage>0){
        oneBar('.eatenBy' + pieces[index].toUpperCase(), piece, percentage);
      }
    });
  }
}


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

function createChessBoard(p) {
  // NOTE: this example uses the chess.js library:
  // https://github.com/jhlywa/chess.js

  var board = null
  var game = new Chess(fens[p])
  var whiteSquareGrey = '#a9a9a9'
  var blackSquareGrey = '#696969'


  function removeGreySquares () {
    $('#board1 .square-55d63').css('background', '')
  }

  function greySquare (square) {
    var $square = $('#board1 .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
    }

    $square.css('background', background)
  }

  function onDragStart (source, piece_drag) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // or if it's not that side's turn
    if ((game.turn() === 'w' && piece_drag.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece_drag.search(/^w/) !== -1)) {
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

  function onSnapEnd () {
    board.position(game.fen())
  }


  var config = {
    draggable: true,
    position: fens[p],
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard('board1', config)
}