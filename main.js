/*----- constants -----*/



const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/*----- app's state (variables) -----*/
let board;
let turn = 'X';
let win;
let totalGames = 0;
let xWins = 0;
let oWins = 0;

/*----- cached element references -----*/
const squares = Array.from(document.querySelectorAll('#board div'));
const totalGamesElement = document.getElementById('totalGames');
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleTurn);
const messages = document.querySelector('h2');
document.getElementById('reset-button').addEventListener('click', init);

/*----- functions -----*/

function getWinner() {
    let winner = null;
    winningCombos.forEach(function (combo, index) {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) winner = board[combo[0]];
    });
    return winner ? winner : board.includes('') ? null : 'T';
}

function handleTurn() {
    let idx = squares.findIndex(function (square) {
        return square === event.target;
    });

   
    if (board[idx] !== '' || win) {
        return;
    }

    board[idx] = turn;
    turn = turn === 'X' ? 'O' : 'X';
    win = getWinner();
    render();

    if (win) {
        updateStats();
        setTimeout(init, 1500); 
        totalGames--;
    }
}

function init() {
   
    board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];
    turn = 'X';
    win = null;
    
    render();
    updateStats();
}




//calculer les stats
function updateStats() {
   
    totalGames++;
   
    if (win === 'X') {
        xWins++;
    } else if (win === 'O') {
        oWins++;
    }

  
    totalGamesElement.textContent = totalGames;
    xWinsElement.textContent = xWins;
    oWinsElement.textContent = oWins;

   
    saveStatsToLocalStorage();
}


//sauvegarder in local storage
function saveStatsToLocalStorage() {
    const stats = { totalGames, xWins, oWins };
    localStorage.setItem('tictactoe_stats', JSON.stringify(stats));   // <-- google
}

function loadStatsFromLocalStorage() {
    const stats = JSON.parse(localStorage.getItem('tictactoe_stats')) || { totalGames: 0, xWins: 0, oWins: 0 };
    totalGames = stats.totalGames;
    xWins = stats.xWins;
    oWins = stats.oWins;
}

//annonce la victoire, egalite ou defaite
function render() {
    board.forEach(function (mark, index) {
        squares[index].textContent = mark;
    });

    if (win === 'T') {
        messages.textContent = 'Egalite';
    } else {
        messages.textContent = win ? `${win} gagne la partie !` : `C'est le tour de ${turn}`;
    }
}


//bouton reset des stats
function resetGame() {
    totalGames = 0;
    xWins = 0;
    oWins = 0;

    totalGamesElement.textContent = '0';
    xWinsElement.textContent = '0';
    oWinsElement.textContent = '0';

    saveStatsToLocalStorage();
}

document.getElementById('reset-button').addEventListener('click', resetGame);





init();                                
loadStatsFromLocalStorage();
