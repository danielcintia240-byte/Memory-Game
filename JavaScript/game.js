/* =========================================
   GAME.JS - JOGO DA MEMÓRIA POKÉMON
========================================= */


/* =========================================
   CARREGAMENTO DO JOGADOR
========================================= */

/*
   Ao carregar a página, busca o nome salvo
   no localStorage e exibe na tela
*/
window.onload = () => {
    const playerName = localStorage.getItem('player');

    if (playerName) {
        const playerDisplay = document.querySelector('.player-name');

        if (playerDisplay) {
            playerDisplay.innerHTML = `Jogador: ${playerName}`;
        }

        console.log(`Bem-vindo ao jogo, ${playerName}!`);
    } else {
        console.log('Nenhum nome encontrado. Volte para a página de login.');
    }
}


/* =========================================
   CONFIGURAÇÕES DAS CARTAS
========================================= */

// Imagem padrão (verso da carta)
const CARD_BACK_IMAGE = "./cards/pokelogo.png";

// Lista de imagens dos Pokémon
const CARDS_IMGS = [
    "./cards/pok.png",
    "./cards/pok2.png",
    "./cards/pok3.png",
    "./cards/pok4.png",
    "./cards/pok5.png",
    "./cards/pok6.png",
    "./cards/pok7.png",
    "./cards/pok8.png",
    "./cards/pok9.png",
    "./cards/pok10.png"
];

// Tempo base (1 segundo)
const ONE_SECOND = 1000;


/* =========================================
   VARIÁVEIS DE CONTROLE DO JOGO
========================================= */

let firstCard = null;      // Primeira carta clicada
let secondCard = null;     // Segunda carta clicada

let plays = 0;             // Total de jogadas
let hits = 0;              // Total de acertos

let lockBoard = false;     // Bloqueia cliques durante animações

let timerInterval = null;  // Intervalo do cronômetro
let timerSeconds = 0;      // Tempo total em segundos

// Controle de áudio
let backgroundAudio = null;


/* =========================================
   ELEMENTOS DO DOM
========================================= */

const boardElement = document.querySelector(".board");
const playsElement = document.getElementById('plays');
const hitsElement = document.getElementById('hits');
const timerElement = document.getElementById('timer');
const totalElement = document.getElementById('total');


/* =========================================
   INICIALIZAÇÃO DO JOGO
========================================= */

/*
   Função principal:
   - Define total de pares
   - Inicia cronômetro
   - Embaralha cartas
   - Insere no tabuleiro
*/
function loadGame() {
    totalElement.textContent = CARDS_IMGS.length;
    startTimer();

    const cards = sortCardsDisposal();
    insertCardsIntoBoard(cards);

    updateStats();
}


/* =========================================
   CRONÔMETRO
========================================= */

// Inicia o contador de tempo
function startTimer() {
    timerSeconds = 0;
    timerElement.textContent = "0";

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timerSeconds++;
        timerElement.textContent = timerSeconds;
    }, 1000);
}

// Para o cronômetro
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


/* =========================================
   EMBARALHAMENTO DAS CARTAS
========================================= */

/*
   Duplica cada carta (pares)
   e embaralha aleatoriamente
*/
function sortCardsDisposal() {
    const cardsDisposal = [];

    CARDS_IMGS.forEach(cardIMG => {
        cardsDisposal.push(cardIMG);
        cardsDisposal.push(cardIMG);
    });

    return cardsDisposal.sort(() => Math.random() - 0.5);
}


/* =========================================
   CRIAÇÃO DO TABULEIRO
========================================= */

/*
   Insere as cartas no HTML
   e adiciona evento de clique
*/
function insertCardsIntoBoard(cards) {
    boardElement.innerHTML = "";

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        cardElement.innerHTML = `
            <div class="card-front">
                <img src="${CARD_BACK_IMAGE}" alt="Pokebola">
            </div>
            <div class="card-back">
                <img src="${card}" alt="Pokémon">
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement));
        boardElement.appendChild(cardElement);
    });
}


/* =========================================
   MECÂNICA DE JOGO (CLIQUE)
========================================= */

/*
   Controla o comportamento ao clicar na carta
*/
function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("is-flipped")) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("is-flipped");

    if (!firstCard) {
        firstCard = card;
    } else if (!secondCard) {
        secondCard = card;

        plays++;
        updateStats();

        checkMatch();
    }
}


/* =========================================
   VERIFICAÇÃO DE PAR
========================================= */

function checkMatch() {
    const firstCardImage = firstCard.querySelector('.card-back img').src;
    const secondCardImage = secondCard.querySelector('.card-back img').src;

    if (firstCardImage === secondCardImage) {

        // Acerto
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');

            hits++;
            updateStats();

            resetPlay();
            checkEndOfGame();
        }, 200);

    } else {

        // Erro
        lockBoard = true;
        setTimeout(unflipCards, ONE_SECOND);
    }
}


/* =========================================
   ERRO (DESVIRAR CARTAS)
========================================= */

function unflipCards() {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");

    resetPlay();
    lockBoard = false;
}


/* =========================================
   RESET DE JOGADA
========================================= */

function resetPlay() {
    firstCard = null;
    secondCard = null;
}


/* =========================================
   ATUALIZAÇÃO DE ESTATÍSTICAS
========================================= */

function updateStats() {
    playsElement.textContent = plays;
    hitsElement.textContent = hits;
}


/* =========================================
   CONTROLE DE ÁUDIO
========================================= */

/*
   Para todos os sons da página
*/
function stopAllSounds() {
    if (backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        backgroundAudio = null;
    }

    const allAudios = document.querySelectorAll('audio');

    allAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}


/*
   Som de vitória
*/
function playVictorySound() {
    const audio = new Audio('../Audio/POkevictory.mp3');

    audio.volume = 0.7;

    audio.play().catch(error => {
        console.log('Erro ao tocar o som de vitória:', error);
    });
}


/* =========================================
   FINAL DO JOGO
========================================= */

/*
   Verifica se todos os pares foram encontrados
*/
function checkEndOfGame() {
    if (hits === CARDS_IMGS.length) {

        stopTimer();

        // Para sons atuais
        stopAllSounds();

        // Toca vitória
        playVictorySound();

        setTimeout(() => {
            alert(`🎉 PARABÉNS! Você completou o jogo em ${plays} jogadas!\n⏱️ Tempo total: ${timerSeconds} segundos!`);
        }, ONE_SECOND / 2);
    }
}


/* =========================================
   MÚSICA DE FUNDO
========================================= */

/*
   Inicia música em loop
*/
function startBackgroundSound(musicPath) {
    backgroundAudio = new Audio(musicPath);

    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.3;

    backgroundAudio.play().catch(error => {
        console.log('Erro ao tocar música de fundo:', error);
    });
}


/* =========================================
   INICIALIZAÇÃO AUTOMÁTICA
========================================= */

// Inicia o jogo ao carregar a pagina
document.addEventListener('DOMContentLoaded', loadGame);