// Javascript Chess
// Description: simple project I decided to work on after my first
// quarter at Oregon State University's Computer Science program.
// Copyright © James Whiteley IV


//initiate game
var game = new Phaser.Game(840, 640, Phaser.AUTO, null, {
	preload: preload, create: create, update: update
});

textStyle = { font: "50px Open Sans", fill: "#ffff00", align: "center" };

var whitePawn;
var whiteRook;
var whiteKnight;
var whiteBishop;
var whiteQueen;
var whiteKing;
var blackPawn;
var blackRook;
var blackKnight;
var blackBishop;
var blackQueen;
var blackKing;

var rowFrom;
var rowToo;
var colFrom;
var colToo;

var whiteCaptures = [];
var blackCaptures = [];
var stateText;
//var gameState = 'U'; // U = unfinished, CB = check black, CW = check white, MB = checkmate black, MW = checkmate white

var turn = 1;
var pieceSelected = false;

var Square = [];
for(var c=0; c<8; c++) {
	Square[c] = [];
	for(var d=0; d<8; d++) {
		Square[c][d] = {x:0, y:0, pieceNumber: 0, pieceName: null, name: null, defaultColor: 'lightSquare'};
	}
}

//preload images
function preload() {
	game.stage.backgroundColor = "#dbd1b4";
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.load.image('whitePawn', 'img/wP.png');
	game.load.image('whiteRook', 'img/wR.png');
	game.load.image('whiteKnight', 'img/wN.png');
	game.load.image('whiteBishop', 'img/wB.png');
	game.load.image('whiteQueen', 'img/wQ.png');
	game.load.image('whiteKing', 'img/wK.png');
	game.load.image('blackPawn', 'img/bP.png');
	game.load.image('blackRook', 'img/bR.png');
	game.load.image('blackKnight', 'img/bN.png');
	game.load.image('blackBishop', 'img/bB.png');
	game.load.image('blackQueen', 'img/bQ.png');
	game.load.image('blackKing', 'img/bK.png');
	game.load.image('lightSquare', 'img/lightSquare.png');
	game.load.image('darkSquare', 'img/darkSquare.png');
	game.load.image('selectedSquare', 'img/selectedSquare.png');

}

//initiate backend board to keep track of piece positions
function create() {

	Square[0][0].pieceNumber = 2;
	Square[0][1].pieceNumber = 3;
	Square[0][2].pieceNumber = 4;
	Square[0][3].pieceNumber = 9;
	Square[0][4].pieceNumber = 8;
	Square[0][5].pieceNumber = 4;
	Square[0][6].pieceNumber = 3;
	Square[0][7].pieceNumber = 2;

	for(i=0; i<8; i++)
	{
		Square[1][i].pieceNumber = 1;
		Square[2][i].pieceNumber = 0;
		Square[3][i].pieceNumber = 0;
		Square[4][i].pieceNumber = 0;
		Square[5][i].pieceNumber = 0;
		Square[6][i].pieceNumber = -1;
	}

	Square[7][0].pieceNumber = -2;
	Square[7][1].pieceNumber = -3;
	Square[7][2].pieceNumber = -4;
	Square[7][3].pieceNumber = -9;
	Square[7][4].pieceNumber = -8;
	Square[7][5].pieceNumber = -4;
	Square[7][6].pieceNumber = -3;
	Square[7][7].pieceNumber = -2;

	//make every even square dark
	var x = 0;
	var y = 0;
	var squareSize = 80;
	var piece;

	for (p = 0; p<8; p++) {
		for(q = 0; q<8; q++) {
			if( (p+q) % 2 == 0) {
				Square[p][q].defaultColor = 'darkSquare';
				Square[p][q].x = x;
				Square[p][q].y = y;
				Square[p][q].name = game.add.sprite(x,y, Square[p][q].defaultColor);
			}
			else {
				Square[p][q].x = x;
				Square[p][q].y = y;
				Square[p][q].name = game.add.sprite(x,y, Square[p][q].defaultColor);
			}
			piece = displayPiece(Square[p][q].pieceNumber);
			if(Square[p][q].pieceNumber) {
				Square[p][q].pieceName = game.add.sprite(x, y, piece);
			}
			x = x + squareSize;
		}
		y = y + squareSize;
		x = 0;
	}

	stateText = game.add.text(game.world.width/2, game.world.height/2, "x", textStyle);
	stateText.anchor.setTo(0.5, 0.5);
	stateText.visible = false;
	game.input.mouse.capture = true;

}


//update front end board on each move
function update() {
	if(game.input.activePointer.leftButton.isDown) {
		var row = Math.floor(this.input.activePointer.y/80);
		var col = Math.floor(this.input.activePointer.x/80);
		var tempSq = Square[row][col];
		displayCaptures();

		// piece is selected and moving to a spot other than another white piece
		if(turn == 1 && tempSq.pieceNumber <= 0 && pieceSelected) {
			rowToo = row;
			colToo = col;
			if(validMoveForPiece(Square[rowFrom][colFrom].pieceNumber, rowFrom, colFrom, rowToo, colToo)) {
				if(moveIntoCheck(rowFrom, colFrom, rowToo, colToo)) { //check p1
					console.log(moveIntoCheck(rowFrom, colFrom, rowToo, colToo))
						makeMove(rowFrom, colFrom, rowToo, colToo);
					if (checkPromotion(1)) {
						pawnPromotion(1);
					}
					checkGameState(1);
					checkGameState(2);

					turn = 2;
				}
			}

		}
		// piece is selected and moving to a spot other than another black piece
		else if(turn == 2 && tempSq.pieceNumber >= 0 && pieceSelected) {
			rowToo = row;
			colToo = col;
			if(validMoveForPiece(Square[rowFrom][colFrom].pieceNumber, rowFrom, colFrom, rowToo, colToo)) {
				if(moveIntoCheck(rowFrom, colFrom, rowToo, colToo)) {
					makeMove(rowFrom, colFrom, rowToo, colToo);
					if (checkPromotion(2)) {
						pawnPromotion(2);
					}
					checkGameState(1);
					checkGameState(2);
					//if gameState == 'MB' or gameState == 'MW' or !kingAlive(2) or !kingAlive(1)  ... game over text
					turn = 1;
				}
			}


		}

		//selecting row and col from for white
		else if(turn == 1 && tempSq.pieceNumber > 0) {
			unselectSquare();
			tempSq.name.loadTexture('selectedSquare', 0);
			pieceSelected = true;
			rowFrom = row;
			colFrom = col;
		}

		//selecting row and col from for black
		else if(turn == 2 && tempSq.pieceNumber < 0) {
			unselectSquare();
			tempSq.name.loadTexture('selectedSquare', 0);
			pieceSelected = true;
			rowFrom = row;
			colFrom = col;
		}
		//console.log('Col:' + Math.floor(this.input.activePointer.x/80));
		//console.log('Row:' + Math.floor(this.input.activePointer.y/80));
	}

}



function displayPiece(num) {
	switch (num) {
		case 0:
			break;
		case 1: return 'whitePawn';
						break;
		case 2: return 'whiteRook';
						break;
		case 3: return 'whiteKnight';
						break;
		case 4: return 'whiteBishop';
						break;
		case 8: return 'whiteQueen';
						break;
		case 9: return 'whiteKing';
						break;

		case -1: return 'blackPawn';
						 break;
		case -2: return 'blackRook';
						 break;
		case -3: return 'blackKnight';
						 break;
		case -4: return 'blackBishop';
						 break;
		case -8: return 'blackQueen';
						 break;
		case -9: return 'blackKing';
						 break;
	}
}

//remove green highlighting from a selected square
function unselectSquare() {
	for (p = 0; p<8; p++) {
		for (q = 0; q < 8; q++) {
			Square[p][q].name.loadTexture(Square[p][q].defaultColor);
		}
	}
}



//checks if player is in check/checkmate
function checkGameState(playerCheck) {

	var kingPlayer;
	if (playerCheck == 1)
		kingPlayer = 9;
	else
		kingPlayer = -9;

	var kingRow = -1;
	var kingCol = -1;
	//find king position for player
	for (var i = 0; i < 8; i++) {
		for(var j=0; j<8; j++) {
			if(Square[i][j].pieceNumber == kingPlayer) {
				kingCol = j;
				kingRow = i;
			}
		}
	}

	//iterate through all valid moves for black player to see if any pieces could get king on next move
	var checkPossible = false;
	for (var i = 0; i < 8; i++) {
		for(var j=0; j<8; j++) {
			if(playerCheck == 1) {
				if(Square[i][j].pieceNumber < 0) { //only check moves of black pieces
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow, kingCol)) {
						checkPossible = true;
					}
				}
			}
			else if(playerCheck == 2) {
				if(Square[i][j].pieceNumber > 0) { //only check moves of white pieces
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow, kingCol)) {
						checkPossible = true;
					}
				}
			}

		}
	}

	if(!checkPossible){
		return;
	}


	//at this point check is possible, now we will check for check mate.

	//check if all positions around king are available or could also kill king if moved to
	var spot1 = false; //see if statements below for corresponding spots
	var spot2 = false;
	var spot3 = false;
	var spot4 = false;
	var spot5 = false;
	var spot6 = false;
	var spot7 = false;
	var spot8 = false;



	//check for possible moves, set corresponding spot to true if that's not a position the king could move to (off board)
	if(kingRow-1 < 0 || kingCol-1 < 0)
		spot1 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow-1, kingCol-1))) {
		spot1 = true;
	}
	if(kingRow-1 < 0)
		spot2 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow-1, kingCol))) {
		spot2 = true;
	}
	if(kingRow-1 < 0 || kingCol + 1 > 7 )
		spot3 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow-1, kingCol+1))) {
		spot3 = true;
	}
	if(kingCol - 1 < 0)
		spot4 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow, kingCol-1))) {
		spot4 = true;
	}
	if(kingCol +1 > 7)
		spot5 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow, kingCol+1))) {
		spot5 = true;
	}
	if(kingRow+1 > 7 || kingCol-1 < 0)
		spot6 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow+1, kingCol-1))) {
		spot6 = true;
	}
	if(kingRow+1 > 7)
		spot7 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow+1, kingCol))) {
		spot7 = true;
	}
	if(kingRow+1 > 7 || kingCol +1 > 7)
		spot8 = true;
	else if(!(validMoveForPiece(Square[kingRow][kingCol].pieceNumber, kingRow, kingCol, kingRow+1, kingCol+1))) {
		spot8 = true;
	}


	// iterate through each piece and see if each spot is possible for each piece
	// if spot is still false, check each game piece to see if they could move to that spot
	if(playerCheck == 1) {
		//function to check each negative piece
		for (var i = 0; i < 8; i++) {
			for(var j=0; j<8; j++) {
				if(Square[i][j].pieceNumber < 0) {
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow-1, kingCol-1)) {
						spot1 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow-1, kingCol)) {
						spot2 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow-1, kingCol+1)) {
						spot3 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow, kingCol-1)) {
						spot4 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow, kingCol+1)) {
						spot5 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow+1, kingCol-1)) {
						spot6 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow+1, kingCol)) {
						spot7 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow+1, kingCol+1)) {
						spot8 = true;

					}

				}
			}
		}

		if(spot1 == true && spot2 == true && spot3 == true && spot4 == true && spot5 == true && spot6 == true && spot7 == true && spot8 == true) {
			alert("Check Mate!  Black team wins!");
			location.reload();
		}
	}


	if(playerCheck == 2) {
		//function to check each negative piece
		for (var i = 0; i < 8; i++) {
			for(var j=0; j<8; j++) {
				if(Square[i][j].pieceNumber > 0) {
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow-1, kingCol-1)) {
						spot1 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow-1, kingCol)) {
						spot2 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow-1, kingCol+1)) {
						spot3 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow, kingCol-1)) {
						spot4 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow, kingCol+1)) {
						spot5 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow+1, kingCol-1)) {
						spot6 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow+1, kingCol)) {
						spot7 = true;

					}
					if(validMoveForPiece(Square[i][j].pieceNumber, i, j, kingRow+1, kingCol+1)) {
						spot8 = true;

					}

				}
			}
		}

		if(spot1 == true && spot2 == true && spot3 == true && spot4 == true && spot5 == true && spot6 == true && spot7 == true && spot8 == true) {
			alert("Check Mate!  White team wins!");
			location.reload();
		}

	}


	if(playerCheck == 1)
		displayText("White team you are in check!");
	else
		displayText("Black team you are in check!");




}



//move player piece
function makeMove(rowFrom, colFrom, rowToo, colToo) {
	// if space moving to == 0, switch array numbers
	// else remove space moving to from board, then switch array numbers
	// check if opposite team king is in check, if in check, see if check mate
	// else cout check statement
	unselectSquare();
	pieceSelected = false;

	//if there is a piece in square moving to, capture and then destroy from board
	if(Square[rowToo][colToo].pieceNumber != 0) {
		var pieceNum = Square[rowToo][colToo].pieceNumber;
		capture(displayPiece(pieceNum), turn);
		Square[rowToo][colToo].pieceName.destroy();
	}


	var piece = displayPiece(Square[rowFrom][colFrom].pieceNumber); //store piece you are moving NAME
	Square[rowFrom][colFrom].pieceName.destroy();  // destroy front end piece you are moving
	//var piece = displayPiece(Square[rowFrom][colFrom].pieceNumber);
	//Square[rowToo][colToo].pieceName = game.add.sprite(Square[rowToo][colToo].x, Square[rowToo][colToo].y, piece);
	Square[rowToo][colToo].pieceNumber = Square[rowFrom][colFrom].pieceNumber;
	Square[rowFrom][colFrom].pieceNumber = 0;


	//Square[rowToo][colToo].pieceName.destroy();
	Square[rowToo][colToo].pieceName = game.add.sprite(Square[rowToo][colToo].x, Square[rowToo][colToo].y, piece);

}




//add piece to player's captured vector
function capture(piece, player) {

	if(player == 1)
	{
		whiteCaptures.push(piece);
	}
	else
	{
		blackCaptures.push(piece);
	}
}



//checks if king is still alive
function kingAlive(player) {
	//returns false if player's king is dead
	var checkKingState = false;
	var king;
	if(player == 1) {
		king = 9;
	}
	else
		king = -9;

	for (var i = 0; i < 8; i++) {
		for(var j=0; j<8; j++) {
			if(Square[i][j].pieceNumber == king) {
				checkKingState = true;
			}

		}
	}

	return checkKingState;

}



// move validation for piece
function validMoveForPiece(piece, rowFrom, colFrom, rowToo, colToo) {

	if(piece == 1) // white pawn
	{
		if(rowFrom == 1)  // check if still in starting position
		{
			if( (rowFrom + 1 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber == 0) )
				return true;
			else if( (rowFrom + 2 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber == 0) && (Square[rowToo-1][colToo].pieceNumber == 0)  )
				return true;
			else if( (rowFrom + 1 == rowToo) && (colFrom + 1 == colToo) && ( Square[rowToo][colToo].pieceNumber < 0)  )
				return true;
			else if( (rowFrom + 1 == rowToo) && (colFrom - 1 == colToo) && ( Square[rowToo][colToo].pieceNumber < 0)  )
				return true;
			else
				return false;
		}
		else
		{
			if( (rowFrom + 1 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber == 0) )
				return true;
			else if( (rowFrom + 1 == rowToo) && (colFrom + 1 == colToo) && ( Square[rowToo][colToo].pieceNumber < 0)  )
				return true;
			else if( (rowFrom + 1 == rowToo) && (colFrom - 1 == colToo) && ( Square[rowToo][colToo].pieceNumber < 0)  )
				return true;
			else
				return false;
		}

	}
	else if(piece == 2) // white rook
	{
		if((rowFrom == rowToo) && (colToo != colFrom) )  // check horizontal move
		{
			if(colToo < colFrom)  // if move is to the left
			{
				var testObstructions = colFrom - 1;  // set to 1 column left of current
				while(testObstructions > colToo)  // while column to left of current > column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to left have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(colFrom < colToo)  // if move is to the right
			{

				var testObstructions = colFrom + 1;  // set to 1 column right of current
				while(testObstructions < colToo)  // while column to right of current < column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to right have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}



		}
		else if( (rowFrom != rowToo) && (colToo == colFrom))  // check vertical move
		{



			if(rowToo < rowFrom)  // if move is up
			{
				var testObstructions = rowFrom - 1;  // set to 1 row up of current
				while(testObstructions > rowToo)  // while row up from current > row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions up from current have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(rowFrom < rowToo)  // if move is down
			{

				var testObstructions = rowFrom + 1;  // set to 1 row down of current
				while(testObstructions < rowToo)  // while row down from current < row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions down have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}

		}


		else
			return false;


	}


	else if(piece == 3) // white knight
	{
		if( (rowFrom - 1 == rowToo) && (colFrom + 2  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom - 2 == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom - 2 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom - 2  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom + 2  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom + 2 == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom + 2 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom - 2  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else
			return false;
	}

	else if(piece == 4) // white bishop
	{


		if(rowFrom - rowToo == colFrom - colToo)  // SE or NW
		{

			if(rowFrom - rowToo > 0)  // check NW obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol--;
				}

				return true;

			}
			else if(rowFrom - rowToo < 0) // check SE obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol++;
				}

				return true;

			}

		}

		else if(colFrom + rowFrom == rowToo + colToo) //SW or NE
		{

			if(rowFrom - rowToo > 0)  // check NE obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol++;
				}

				return true;

			}

			else if(rowFrom - rowToo < 0) // check SW obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol--;
				}

				return true;

			}



		}


		else
			return false;
	}

	else if(piece == 8) // white queen
	{

		if((rowFrom == rowToo) && (colToo != colFrom) )  // check horizontal move
		{
			if(colToo < colFrom)  // if move is to the left
			{
				var testObstructions = colFrom - 1;  // set to 1 column left of current
				while(testObstructions > colToo)  // while column to left of current > column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to left have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(colFrom < colToo)  // if move is to the right
			{

				var testObstructions = colFrom + 1;  // set to 1 column right of current
				while(testObstructions < colToo)  // while column to right of current < column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to right have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}



		}
		else if( (rowFrom != rowToo) && (colToo == colFrom))  // check vertical move
		{



			if(rowToo < rowFrom)  // if move is up
			{
				var testObstructions = rowFrom - 1;  // set to 1 row up of current
				while(testObstructions > rowToo)  // while row up from current > row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions up from current have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(rowFrom < rowToo)  // if move is down
			{

				var testObstructions = rowFrom + 1;  // set to 1 row down of current
				while(testObstructions < rowToo)  // while row down from current < row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions down have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}

		}

		else if(rowFrom - rowToo == colFrom - colToo)  // SE or NW
		{

			if(rowFrom - rowToo > 0)  // check NW obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol--;
				}

				return true;

			}
			else if(rowFrom - rowToo < 0) // check SE obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol++;
				}

				return true;

			}

		}

		else if(colFrom + rowFrom == rowToo + colToo) //SW or NE
		{

			if(rowFrom - rowToo > 0)  // check NE obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol++;
				}

				return true;

			}

			else if(rowFrom - rowToo < 0) // check SW obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol--;
				}

				return true;

			}



		}


		else
			return false;






	}

	else if(piece == 9) // white king
	{
		/*
			 if(moveIntoCheck(1, rowToo, colToo)) {
			 return false;
			 }
			 */
		if( (rowFrom + 1 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber <= 0)  )
			return true;
		else if( (rowFrom == rowToo) && (colFrom + 1  == colToo)&& (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom  == colToo)&& (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom + 1  == colToo)&& (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom + 1  == colToo)&& (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom - 1  == colToo)&& (Square[rowToo][colToo].pieceNumber <= 0) )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber <= 0))
			return true;
		else
			return false;
	}


	else if(piece == -1)  // black pawn
	{
		if(rowFrom == 6)  // check if still in starting position
		{
			if( (rowFrom - 1 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber == 0)  )
				return true;
			else if( (rowFrom - 2 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber == 0) && (Square[rowToo+1][colToo].pieceNumber == 0))
				return true;
			else if( (rowFrom - 1 == rowToo) && (colFrom - 1 == colToo) && ( Square[rowToo][colToo].pieceNumber > 0)  )
				return true;
			else if( (rowFrom - 1 == rowToo) && (colFrom + 1 == colToo) && ( Square[rowToo][colToo].pieceNumber > 0)  )
				return true;
			else
				return false;
		}
		else
		{
			if( (rowFrom - 1 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber == 0) )
				return true;
			else if( (rowFrom - 1 == rowToo) && (colFrom - 1 == colToo) && ( Square[rowToo][colToo].pieceNumber > 0)  )
				return true;
			else if( (rowFrom - 1 == rowToo) && (colFrom + 1 == colToo) && ( Square[rowToo][colToo].pieceNumber > 0)  )
				return true;
			else
				return false;
		}
	}


	else if(piece == -2) // black rook
	{
		if((rowFrom == rowToo) && (colToo != colFrom) )  // check horizontal move
		{
			if(colToo < colFrom)  // if move is to the left
			{
				var testObstructions = colFrom - 1;  // set to 1 column left of current
				while(testObstructions > colToo)  // while column to left of current > column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to left have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(colFrom < colToo)  // if move is to the right
			{

				var testObstructions = colFrom + 1;  // set to 1 column right of current
				while(testObstructions < colToo)  // while column to right of current < column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to right have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}



		}
		else if( (rowFrom != rowToo) && (colToo == colFrom))  // check vertical move
		{



			if(rowToo < rowFrom)  // if move is up
			{
				var testObstructions = rowFrom - 1;  // set to 1 row up of current
				while(testObstructions > rowToo)  // while row up from current > row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions up from current have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(rowFrom < rowToo)  // if move is down
			{

				var testObstructions = rowFrom + 1;  // set to 1 row down of current
				while(testObstructions < rowToo)  // while row down from current < row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions down have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}

		}


		else
			return false;



	}
	else if(piece == -3) // black knight
	{
		if( (rowFrom - 1 == rowToo) && (colFrom + 2  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom - 2 == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else if( (rowFrom - 2 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom - 2  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom + 2  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else if( (rowFrom + 2 == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else if( (rowFrom + 2 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom - 2  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0))
			return true;
		else
			return false;

	}
	else if(piece == -4)  // black bishop
	{
		if(rowFrom - rowToo == colFrom - colToo)  // SE or NW
		{

			if(rowFrom - rowToo > 0)  // check NW obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol--;
				}

				return true;

			}
			else if(rowFrom - rowToo < 0) // check SE obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol++;
				}

				return true;

			}

		}

		else if(colFrom + rowFrom == rowToo + colToo) //SW or NE
		{

			if(rowFrom - rowToo > 0)  // check NE obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol++;
				}

				return true;

			}

			else if(rowFrom - rowToo < 0) // check SW obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol--;
				}

				return true;

			}



		}


		else
			return false;
	}
	else if(piece == -8) // black queen
	{
		if((rowFrom == rowToo) && (colToo != colFrom) )  // check horizontal move
		{
			if(colToo < colFrom)  // if move is to the left
			{
				var testObstructions = colFrom - 1;  // set to 1 column left of current
				while(testObstructions > colToo)  // while column to left of current > column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to left have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(colFrom < colToo)  // if move is to the right
			{

				var testObstructions = colFrom + 1;  // set to 1 column right of current
				while(testObstructions < colToo)  // while column to right of current < column going to
				{
					if(Square[rowFrom][testObstructions].pieceNumber != 0)
						return false;   // if positions to right have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}



		}
		else if( (rowFrom != rowToo) && (colToo == colFrom))  // check vertical move
		{



			if(rowToo < rowFrom)  // if move is up
			{
				var testObstructions = rowFrom - 1;  // set to 1 row up of current
				while(testObstructions > rowToo)  // while row up from current > row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions up from current have a piece in them return false
					testObstructions--;
				}

				return true;  // if no obstructions, return true
			}

			else if(rowFrom < rowToo)  // if move is down
			{

				var testObstructions = rowFrom + 1;  // set to 1 row down of current
				while(testObstructions < rowToo)  // while row down from current < row going to
				{
					if(Square[testObstructions][colFrom].pieceNumber != 0)
						return false;   // if positions down have a piece in them return false
					testObstructions++;
				}


				return true;  // if no obstructions, return true
			}

		}

		else if(rowFrom - rowToo == colFrom - colToo)  // SE or NW
		{

			if(rowFrom - rowToo > 0)  // check NW obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol--;
				}

				return true;

			}
			else if(rowFrom - rowToo < 0) // check SE obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol++;
				}

				return true;

			}

		}

		else if(colFrom + rowFrom == rowToo + colToo) //SW or NE
		{

			if(rowFrom - rowToo > 0)  // check NE obstructions
			{
				var testObstructionRow = rowFrom - 1;
				var testObstructionCol = colFrom + 1;

				while (testObstructionRow > rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow--;
					testObstructionCol++;
				}

				return true;

			}

			else if(rowFrom - rowToo < 0) // check SW obstructions
			{

				var testObstructionRow = rowFrom + 1;
				var testObstructionCol = colFrom - 1;

				while (testObstructionRow < rowToo )
				{
					if(Square[testObstructionRow][testObstructionCol].pieceNumber != 0)
						return false;
					testObstructionRow++;
					testObstructionCol--;
				}

				return true;

			}



		}


		else
			return false;





	}
	else if(piece == -9) // black king
	{

		/*
			 if(moveIntoCheck(2, rowToo, colToo)) {
			 return false;
			 }
			 */
		if( (rowFrom + 1 == rowToo) && (colFrom == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom  == colToo)&&  (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom + 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom + 1 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else if( (rowFrom - 1 == rowToo) && (colFrom - 1  == colToo) && (Square[rowToo][colToo].pieceNumber >= 0) )
			return true;
		else
			return false;
	}


	// if somehow it gets here which it shouldn't :)
	return false;


}



// checks if a pawn has reached opposite side of board
function checkPromotion(player) {

	if(player == 1) {
		for(var i=0; i<8; i++) {
			if(Square[7][i].pieceNumber == 1)
				return true;
		}
	}

	if(player == 2) {
		for(var i=0; i<8; i++) {
			if(Square[0][i].pieceNumber == -1)
				return true;
		}
	}

	return false;


}



//promotes pawn to queen
function pawnPromotion(player) {

	if (player == 1) {
		for (var i = 0; i < 8; i++) {
			if (Square[7][i].pieceNumber == 1) {
				Square[7][i].pieceNumber = 8;
				Square[7][i].pieceName.destroy();
				Square[7][i].pieceName = game.add.sprite(Square[7][i].x, Square[7][i].y, 'whiteQueen');
				displayText("Pawn promoted!");
			}
		}
	}

	if (player == 2) {
		for (var i = 0; i < 8; i++) {
			if (Square[0][i].pieceNumber == -1) {
				Square[0][i].pieceNumber = -8;
				Square[0][i].pieceName.destroy();
				Square[0][i].pieceName = game.add.sprite(Square[0][i].x, Square[0][i].y, 'blackQueen');
				displayText("Pawn promoted!");
			}
		}
	}


}




// shows text on screen
function displayText(text) {
	stateText.setText(text);
	stateText.visible = true;
	game.input.onDown.addOnce(function() {
		stateText.visible = false;
	}, this);
}


/*
	 function gameOver() {
	 if(!kingAlive(2)) {
	 alert('White team wins!');
	 location.reload();
	 }
	 else {
	 alert('Black team wins!');
	 location.reload();
	 }


	 }
	 */

// dissallow moving a player into check
function moveIntoCheck(rowFrom, colFrom, rowToo, colToo) {

	//we know its a valid move at this point
	var kingRow;
	var kingCol;
	var kingPiece;


	if (turn == 1)
		kingPiece = 9;
	else
		kingPiece = -9;

	//create temp array for future state of board
	var tempBoardArray = [];
	for (i = 0; i < 8; i++) {
		tempBoardArray[i] = [];
		for (j = 0; j < 8; j++) {
			tempBoardArray[i][j] = 0;
			tempBoardArray[i][j] = Square[i][j].pieceNumber;
		}
	}


	//console.log("tempBoard " + tempBoardArray[rowToo][colToo]);
	//console.log("main " + Square[rowToo][colToo].pieceNumber);
	//future state of board if move is executed
	tempBoardArray[rowToo][colToo] = tempBoardArray[rowFrom][colFrom];
	tempBoardArray[rowFrom][colFrom] = 0;

	//console.log("tempBoard " + tempBoardArray[rowToo][colToo]);
	//console.log("main " + Square[rowToo][colToo].pieceNumber);

	//locate king position for current player turn
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			if (tempBoardArray[i][j] == kingPiece) {
				kingRow = i;
				kingCol = j;

			}
		}
	}


	//return false if current player move could result in check for current player
	//iterate through future state of board to see if any enemy piece could get king
	if (turn == 1) {
		for (i = 0; i < 8; i++) {
			for (j = 0; j < 8; j++) {
				if (tempBoardArray[i][j]< 0) {
					if (validMoveForPiece(tempBoardArray[i][j], i, j, kingRow, kingCol)) {
						return false;
					}
				}
			}
		}
	}

	else if(turn == 2){
		for (i = 0; i < 8; i++) {
			for (j = 0; j < 8; j++) {
				if (tempBoardArray[i][j] > 0) {
					if (validMoveForPiece(tempBoardArray[i][j], i, j, kingRow, kingCol)) {
						return false;
					}
				}
			}
		}
	}


	return true;
}




// display captured pieces on side of board
function displayCaptures() {
	var whiteX = 660;
	var whiteY = 20;
	var blackX = 660;
	var blackY = game.world.height / 2;
	var scale = 0.5;

	for(x in whiteCaptures) {
		var cap = game.add.image(whiteX, whiteY, whiteCaptures[x]);
		cap.scale.set(scale, scale);
		whiteX += 40;
		if (x == 3 || x == 7 || x == 11) {
			whiteX = 660;
			whiteY += 40;
		}
	}

	for(x in blackCaptures) {
		var cap = game.add.image(blackX, blackY, blackCaptures[x]);
		cap.scale.set(scale, scale);
		blackX += 40;
		if(x == 3|| x == 7 || x == 11) {
			blackX = 660;
			blackY += 40;

		}
	}
}



