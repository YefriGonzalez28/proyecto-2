// script.js
document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'Amazonas', img: 'images/Amazonas-yacumamay.png' },
        { name: 'Antioquia', img: 'images/Antioquia-kafeira.png' },
        { name: 'Arauca', img: 'images/Arauca-kaimama.png' },
        { name: 'Atlantico', img: 'images/Atlantico-kalindra.png' },
        { name: 'Bolivar', img: 'images/Bolivar-cartagenia.png' },
        { name: 'Boyaca', img: 'images/Boyaca-tunjue.png' },
        { name: 'Caldas', img: 'images/Caldas-ursamagna.png' },
        { name: 'Caqueta', img: 'images/Caqueta-korakue.png' }
    ];

    let playerName;
    let level;
    let timeElapsed = 0;
    let timerInterval;
    let lives = 8;
    let pairsFound = 0;
    let pairsLeft = cardArray.length;

    // Duplica las cartas para tener parejas y las baraja
    let gameArray = cardArray.concat(cardArray).sort(() => 0.5 - Math.random());

    const grid = document.querySelector('.grid');
    const resultDisplay = document.querySelector('#result');
    const timerDisplay = document.querySelector('#timer');
    const pairsFoundDisplay = document.querySelector('#pairsFound');
    const pairsLeftDisplay = document.querySelector('#pairsLeft');
    const livesDisplay = document.querySelector('#lives');
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Definir startGame en el contexto global
    window.startGame = function startGame() {
        playerName = document.getElementById('name').value;
        level = document.getElementById('level').value;

        if (!playerName) {
            alert('Por favor, introduce tu nombre');
            return;
        }

        document.getElementById('setup').style.display = 'none';
        document.getElementById('game').style.display = 'flex';
        resetGame();
        createBoard();
        startTimer();
    };

    function createBoard() {
        grid.innerHTML = ''; // Limpia el grid antes de crear uno nuevo
        gameArray.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-id', index);

            const cardImg = document.createElement('img');
            cardImg.setAttribute('src', 'images/Espalda.png');
            cardElement.appendChild(cardImg);

            cardElement.addEventListener('click', flipCard);
            grid.appendChild(cardElement);
        });
        pairsLeftDisplay.textContent = pairsLeft;
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.card img');
        const [optionOneId, optionTwoId] = cardsChosenId;

        if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].parentElement.removeEventListener('click', flipCard);
            cards[optionTwoId].parentElement.removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
            pairsFound++;
            pairsLeft--;
        } else {
            cards[optionOneId].setAttribute('src', 'images/Espalda.png');
            cards[optionTwoId].setAttribute('src', 'images/Espalda.png');
            lives--;
            if (lives === 0) {
                alert('Juego terminado. Te quedastes sin vidas. ¡Inténtalo de nuevo!');
                resetGame(true);  // Indicar que el juego terminó por vidas agotadas
                return;
            }
        }

        cardsChosen = []; 
        cardsChosenId = []; 
        resultDisplay.textContent = cardsWon.length; 
        pairsFoundDisplay.textContent = pairsFound; 
        pairsLeftDisplay.textContent = pairsLeft; 
        livesDisplay.textContent = lives; 
        if (cardsWon.length === cardArray.length) { 
            clearInterval(timerInterval); 
            alert(`¡Felicidades ${playerName}! Juego terminado en ${timerDisplay.textContent}`); 
            leaderboard.push({ name: playerName, score: timeElapsed }); 
            leaderboard.sort((a, b) => a.score - b.score); 
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard)); 
            resetGame(true); // Regresar al inicio 
            } 
        }

    function flipCard() {
        let cardId = this.getAttribute('data-id');
        cardsChosen.push(gameArray[cardId].name);
        cardsChosenId.push(cardId);
        this.children[0].setAttribute('src', gameArray[cardId].img);

        if (cardsChosen.length === 2) {
            setTimeout(checkForMatch, 500);
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeElapsed = 0;
        timerInterval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    function resetGame(gameOver = false) {
        clearInterval(timerInterval);
        timeElapsed = 0;
        timerDisplay.textContent = '00:00';
        grid.innerHTML = '';
        lives = 8;
        pairsFound = 0;
        pairsLeft = cardArray.length;
        cardsWon = [];
        cardsChosen = [];
        cardsChosenId = [];
        gameArray = cardArray.concat(cardArray).sort(() => 0.5 - Math.random());
        resultDisplay.textContent = '0';
        pairsFoundDisplay.textContent = '0';
        pairsLeftDisplay.textContent = `${cardArray.length}`;
        livesDisplay.textContent = '8';

        if (gameOver) {
            document.getElementById('setup').style.display = 'flex';
            document.getElementById('game').style.display = 'none';
        }
    }

    // Inicializa el juego al cargar la página
    resetGame();
});
