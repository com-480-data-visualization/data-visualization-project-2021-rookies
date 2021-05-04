/*
    CHESSBOARD
*/
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
            d3.select('#percentage').text("< 0.1%")
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
  function resetGame(){
    board.start()
    game = new Chess()
  }

  d3.select("#undo-button").on('click', undoMove)
  d3.select("#reset-button").on('click', resetGame)

  
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
