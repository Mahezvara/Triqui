const board = document.getElementById("board");
const turnText = document.getElementById("turn");
const cpuToggle = document.getElementById("cpuToggle");

let currentPlayer = "X";
let gameActive = true;
let cells = Array(9).fill(null);
let scoreX = 0, scoreO = 0, scoreDraw = 0;

function createBoard() {
  board.innerHTML = "";
  cells = Array(9).fill(null);
  gameActive = true;
  currentPlayer = "X";
  turnText.textContent = "Turno: X";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} gana`);
    updateScore(currentPlayer);
    return;
  }

  if (!cells.includes(null)) {
    endGame("Empate");
    scoreDraw++;
    document.getElementById("scoreDraw").textContent = `Empates: ${scoreDraw}`;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnText.textContent = `Turno: ${currentPlayer}`;

  if (cpuToggle.checked && currentPlayer === "O") {
    setTimeout(cpuMove, 500);
  }
}

function cpuMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (cells[i] === null) {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  document.querySelector(`[data-index='${move}']`).click();
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (!boardState.includes(null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWin(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // filas
    [0,3,6],[1,4,7],[2,5,8], // columnas
    [0,4,8],[2,4,6]          // diagonales
  ];
  return wins.some(comb => comb.every(i => cells[i] === player));
}

function endGame(message) {
  showGameMessage(message);
  gameActive = false;
}

function showGameMessage(message) {
  const msgDiv = document.getElementById("gameMessage");
  msgDiv.textContent = message;
  msgDiv.classList.add("show");
  setTimeout(() => {
    msgDiv.classList.remove("show");
    resetGame();
  }, 2000); // 2 segundos antes de reiniciar
}

function updateScore(player) {
  if (player === "X") {
    scoreX++;
    document.getElementById("scoreX").textContent = `X: ${scoreX}`;
  } else {
    scoreO++;
    document.getElementById("scoreO").textContent = `O: ${scoreO}`;
  }
}

function resetGame() {
  createBoard();
}

createBoard();

