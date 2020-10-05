var Game = {
  canvas: undefined,
  canvasContext: undefined,
  gameTable: undefined,
};

var playing;
var playerMove = true;
var playerSign = 1;
var opponentSign = 2;
var two = false;

var p1 = "Player";
var p2 = "Computer";

var text;

Game.start = function(){
  Game.canvas = document.getElementById("gameCanvas");
  Game.canvasContext = Game.canvas.getContext("2d");
  Game.gameTable = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];
  Game.canvas.addEventListener("click", function(evt) {
    var mousePos = getMousePos(Game.canvas, evt);
    let i = parseInt(3*mousePos.y / Game.canvas.width);
    let j = parseInt(3*mousePos.x / Game.canvas.width);

    if(playerMove && playing > 0) {
      if(Game.gameTable[i][j] == 0)
      {
        Game.gameTable[i][j] = playerSign;
        playerMove = false;
        text.innerHTML = p2 + "'s Move";
      }
    }
    else if(playing == 1) {
      if(Game.gameTable[i][j] == 0)
      {
        Game.gameTable[i][j] = opponentSign;
        playerMove = true;
        text.innerHTML = p1 + "'s Move";
      }
    }
  });
  text = document.getElementById("text");
  playing = 2;
  window.setTimeout(Game.mainLoop, 500);
};

document.addEventListener('DOMContentLoaded',Game.start);

Game.update = function (){
  if(Game.evaluate() == 10) {
    playing = 0;
    text.innerHTML = p1 + " is Winner!";
    document.getElementById('btn').disabled = false;
  }
  else if(Game.evaluate() == -10) {
    playing = 0;
    text.innerHTML = p2 + " is Winner!";
    document.getElementById('btn').disabled = false;
  }

  if(!Game.isMovesLeft()) {
    playing = 0;
    text.innerHTML = "Draw!";
    document.getElementById('btn').disabled = false;
  }

  if(playing == 2 && !playerMove){
    let m = Game.findBestMove();

    Game.gameTable[m.r][m.c] = opponentSign;
    playerMove = true;
    text.innerHTML = p1 + "'s Move";
  }
};

Game.draw = function (){
	for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(Game.gameTable[i][j] == 1){
        Game.drawX(i,j);
      }
      if(Game.gameTable[i][j] == 2){
        Game.drawO(i,j);
      }
    }
  }
};

Game.mainLoop = function (){
	Game.clearCanvas();
	Game.update();
	Game.draw();
	window.setTimeout(Game.mainLoop, 1000/60);
};

Game.clearCanvas = function(){
	Game.canvasContext.clearRect(0,0,Game.canvas.width,Game.canvas.height);
};

Game.drawX = function(x,y) {
  var spr = new Image();
  spr.style.width = Game.canvas.width/4;
  spr.style.height = Game.canvas.height/4;
  spr.src = "Images/iks.png";
  Game.canvasContext.save();
	//Game.canvasContext.translate(x*50, y*50);
	Game.canvasContext.drawImage(spr,Game.canvas.width*(y + 1/8)/3,Game.canvas.width*(x + 1/8)/3,Game.canvas.width/4,Game.canvas.height/4);
	Game.canvasContext.restore();
};

Game.drawO = function(x,y) {
  var spr = new Image();
  spr.style.width = Game.canvas.width/4;
  spr.style.height = Game.canvas.height/4;
  spr.src = "Images/oks.png";
  Game.canvasContext.save();
	//Game.canvasContext.translate(x*50, y*50);
	Game.canvasContext.drawImage(spr,Game.canvas.width*(y + 1/8)/3,Game.canvas.width*(x + 1/8)/3,Game.canvas.width/4,Game.canvas.height/4);
	Game.canvasContext.restore();
};

function getMousePos(canvas,evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

Game.evaluate = function() {
  // Check Rows
  for (let i = 0; i < 3; i++) {
    if(Game.gameTable[i][0] == Game.gameTable[i][1] && Game.gameTable[i][1] == Game.gameTable[i][2]) {
      if(Game.gameTable[i][0] == playerSign) {
        return 10;
      }
      else if(Game.gameTable[i][0] == opponentSign) {
        return -10;
      }
    }
  }

  // Check Cols
  for (let i = 0; i < 3; i++) {
    if(Game.gameTable[0][i] == Game.gameTable[1][i] && Game.gameTable[1][i] == Game.gameTable[2][i]) {
      if(Game.gameTable[0][i] == playerSign) {
        return 10;
      }
      else if(Game.gameTable[0][i] == opponentSign) {
        return -10;
      }
    }
  }

  // Diagonal
  if(Game.gameTable[0][0] == Game.gameTable[1][1] && Game.gameTable[1][1] == Game.gameTable[2][2]) {
    if(Game.gameTable[0][0] == playerSign) {
      return 10;
    }
    else if(Game.gameTable[0][0] == opponentSign) {
      return -10;
    }
  }

  if(Game.gameTable[0][2] == Game.gameTable[1][1] && Game.gameTable[1][1] == Game.gameTable[2][0]) {
    if(Game.gameTable[0][2] == playerSign) {
      return 10;
    }
    else if(Game.gameTable[0][2] == opponentSign) {
      return -10;
    }
  }

  return 0;
}

Game.isMovesLeft = function() {
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(Game.gameTable[i][j] == 0) return true;
    }
  }
  return false;
}

Game.minimax = function(isMax) {
  let score = Game.evaluate();

  if(score == 10 || score == -10) return score;

  if(!Game.isMovesLeft()) return 0;

  let best;
  if(isMax) {
    best = -1000;
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        if (Game.gameTable[i][j] == 0) {
          Game.gameTable[i][j] = playerSign;

          best = Math.max(best, Game.minimax(false));

          Game.gameTable[i][j] = 0;
        }
      }
    }
  }
  else {
    best = 1000;
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        if (Game.gameTable[i][j] == 0) {
          Game.gameTable[i][j] = opponentSign;

          best = Math.min(best, Game.minimax(true));

          Game.gameTable[i][j] = 0;
        }
      }
    }
  }
  return best;
}

Game.findBestMove = function() {
  let bestVal = 1000;
  let bestMove = {
    r: -1,
    c: -1
  };
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if (Game.gameTable[i][j] == 0) {
        Game.gameTable[i][j] = opponentSign;

        let moveVal = Game.minimax(true);

        Game.gameTable[i][j] = 0;

        if(moveVal < bestVal){
          bestMove.r = i;
          bestMove.c = j;
          bestVal = moveVal;
        }
      }
    }
  }
  return bestMove;
}

function checkBoxC() {
  let cb = document.getElementById("mycheck");
  if(cb.checked){
    p1 = "Player1";
    p2 = "Player2";
    two = true;
    if(playing > 0) {
      playing = 1;
      if(playerMove) text.innerHTML = p1 + "'s Move";
    }
  }
  else{
    p1 = "Player";
    p2 = "Computer";
    two = false;
    if(playing > 0) {
      playing = 2;
      if(playerMove) text.innerHTML = p1 + "'s Move";
    }
  }
}

function replay() {
  Game.gameTable = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];
  playerSign = 3 - playerSign;
  opponentSign = 3 - opponentSign;
  if(playerSign == 1) playerMove = true;
  else playerMove = false;
  if(two) playing = 1;
  else playing = 2;
  if(playerMove) text.innerHTML = p1 + "'s Move";
  else text.innerHTML = p2 + "'s Move";
  document.getElementById('btn').disabled = true;
}
