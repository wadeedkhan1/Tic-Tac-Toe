const cells = document.querySelectorAll('.cell');
const statusDiv = document.querySelector('.status');
const resetButton = document.getElementById('restart');

const updateDiv = (message) => {
    statusDiv.textContent = message;
};

const GameBoard = () => {
    let board = [ ['', '', ''], ['', '', ''], ['', '', ''] ];

    const displayBoard = () => {
        cells.forEach(cell => {
            const row = cell.getAttribute('data-row');
            const col = cell.getAttribute('data-col');
            cell.textContent = board[row][col];
        });
    };

    const updateBoard = (row, col, symbol) => {
        if (board[row][col] === '') {
            board[row][col] = symbol;
            return true;
        }
        return false;
    };

    const checkWin = () => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][0] === board[i][2] && board[i][0] !== '') {
                return board[i][0];
            }
        }
        // Check columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === board[1][j] && board[0][j] === board[2][j] && board[0][j] !== '') {
                return board[0][j];
            }
        }
        // Check diagonals
        if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== '') {
            return board[0][0];
        }
        if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] !== '') {
            return board[0][2];
        }
        return null;
    };

    const checkDraw = () => {
        return board.flat().every(cell => cell !== '');
    };

    const resetBoard = () => {
        board = [ ['', '', ''], ['', '', ''], ['', '', ''] ];
        displayBoard();
    };

    return { displayBoard, updateBoard, checkDraw, checkWin, resetBoard };
};

const Player = (name, symbol) => {
    return { name, symbol };
};  

const Game = (name1, name2) => {
    const board = GameBoard();
    const player1 = Player(name1, '✖');
    const player2 = Player(name2, '◯');
    let currentPlayer = player1; 
    let gameOver = false; 

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const makeMove = (row, col) => {
        if (gameOver) return false; 

        if (board.updateBoard(row, col, currentPlayer.symbol)) {
            board.displayBoard();
            const winner = board.checkWin();
            if (winner) {
                updateDiv(`${winner} wins!`);
                gameOver = true;
                return true;
            } else if (board.checkDraw()) {
                updateDiv('It\'s a Draw!');
                gameOver = true;
                return true;
            } else {
                switchPlayer();
                updateDiv(`${currentPlayer.name}'s turn`);
            }
            return false;
        } else {
            return false;
        }
    };

    const startGame = () => {
        board.resetBoard();
        currentPlayer = player1;
        gameOver = false; 
        updateDiv(`${currentPlayer.name}'s turn`);
        cells.forEach(cell => cell.classList.remove('disabled'));
    };

    return { startGame, makeMove, switchPlayer, currentPlayer, gameOver }; 
};

const game = Game('Player 1', 'Player 2');
game.startGame();

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        if (!game.makeMove(row, col)) {
            
        }
        if (game.gameOver) {
            cells.forEach(cell => cell.classList.add('disabled'));
        }
    });
});

resetButton.addEventListener('click', () => {
    game.startGame();
});
