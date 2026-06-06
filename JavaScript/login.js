/* =========================
   SELEÇÃO DE ELEMENTOS
========================= */

// Campo de input do nome
const input = document.querySelector('.login__input');

// Botão de iniciar jogo
const button = document.querySelector('.login__button');

// Formulário de login
const form = document.querySelector('.login-form');


/* =========================
   VALIDAÇÃO DO INPUT
========================= */

/*
   Verifica se o nome tem pelo menos 3 caracteres.
   Habilita ou desabilita o botão com base nisso.
*/
const validateInput = ({ target }) => {
    if (target.value.length >= 3) {
        button.removeAttribute('disabled');
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    } else {
        button.setAttribute('disabled', '');
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    }
}


/* =========================
   ENVIO DO FORMULÁRIO
========================= */

/*
   Impede o reload da página,
   salva o nome do jogador
   e abre a tela do jogo.
*/
const handleSubmit = (event) => {
    event.preventDefault(); // Cancela comportamento padrão do form

    const playerName = input.value;

    // Verifica novamente se o nome é válido
    if (playerName.length >= 3) {

        // Salva o nome no navegador
        localStorage.setItem('player', playerName);

        // Abre o jogo em uma nova aba
        window.open('./game.html', '_blank');

        // Limpa o input após envio
        input.value = '';

        // Desativa botão novamente
        button.setAttribute('disabled', '');
    }
}


/* =========================
   EVENTOS
========================= */

// Validação em tempo real enquanto digita
input.addEventListener('input', validateInput);

// Envio do formulário
form.addEventListener('submit', handleSubmit);


/* =========================
   ESTADO INICIAL
========================= */

/*
   Define o botão como desabilitado
   ao carregar a página
*/
button.setAttribute('disabled', '');
button.style.opacity = '0.5';
button.style.cursor = 'not-allowed';