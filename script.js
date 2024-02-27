let currentPageUrl = 'https://swapi.dev/api/people/'

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl)
        function hideLoading() {
            const loading = document.getElementById('loading_bg');
            loading.style.visibility = 'hidden';
        }
        hideLoading();

    } catch (erro) {
        console.log(erro);
        alert('Erro ao carregar os cards')
    }

    const botaoAvancar = document.getElementById('botao_avancar');
    const botaoVoltar = document.getElementById('botao_voltar');

    botaoAvancar.addEventListener('click', carragarProximaPagina);
    botaoVoltar.addEventListener('click', carragarUltimaPagina);
}

async function loadCharacters(url) {
    const mainContent = document.getElementById('main_content');
    mainContent.innerHTML = '';
    
    function showLoading() {
        const loading = document.getElementById('loading_bg');
        loading.style.visibility = 'visible';
    }
    showLoading();

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement('div');
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
            card.className = "cards";

            const characterNameBg = document.createElement('div');
            characterNameBg.className = "character_name_bg";
            
            const characterName = document.createElement('span');
            characterName.className = "character_name";
            characterName.innerText = `${character.name}`;

            characterNameBg.appendChild(characterName);
            card.appendChild(characterNameBg);

            card.onclick = () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = 'visible';

                const modalContent = document.getElementById('modal_content');
                modalContent.innerHTML = '';

                const characterImage = document.createElement('div');
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = 'character_image';

                const characterName = document.createElement('span');
                characterName.className = 'details';
                characterName.innerText = `Nome: ${character.name}`;

                const characterHeight = document.createElement('span');
                characterHeight.className = 'details';
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`;

                const characterMass = document.createElement('span');
                characterMass.className = 'details';
                characterMass.innerText = `Peso: ${convertMass(character.mass)}`;

                const characterEye = document.createElement('span');
                characterEye.className = 'details';
                characterEye.innerText = `Olhos: ${convertEyeColor(character.eye_color)}`;
                
                const characterBirth = document.createElement('span');
                characterBirth.className = 'details';
                characterBirth.innerText = `Nascimento: ${convertBirth(character.birth_year)}`

                modalContent.appendChild(characterImage);
                modalContent.appendChild(characterName);
                modalContent.appendChild(characterHeight);
                modalContent.appendChild(characterMass);
                modalContent.appendChild(characterEye);
                modalContent.appendChild(characterBirth);
            }

            mainContent.appendChild(card);
        });

        const botaoAvancar = document.getElementById('botao_avancar');
        const botaoVoltar = document.getElementById('botao_voltar');

        botaoAvancar.disabled = !responseJson.next;
        botaoVoltar.disabled = !responseJson.previous;

        botaoVoltar.style.visibility = responseJson.previous? 'visible' : 'hidden' ;
        botaoAvancar.style.visibility = responseJson.next? 'visible' : 'hidden' ;

        currentPageUrl = url

    } catch (erro) {
        alert('Erro ao carregar os personagens');
        console.log(erro);
    }

    function hideLoading() {
        const loading = document.getElementById('loading_bg');
        loading.style.visibility = 'hidden';
    }
    hideLoading();
}

async function carragarProximaPagina () {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        await loadCharacters(responseJson.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página')
    }
}

async function carragarUltimaPagina () {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        await loadCharacters(responseJson.previous);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página')
    }
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = 'hidden';
}

const modal = document.getElementById('modal');
modal.addEventListener('click', hideModal)

function convertEyeColor(eyeColor) {
    const cores = {
        blue: 'azuis',
        brown: 'castanhos',
        green: 'verdes',
        yellow: 'amarelos',
        black: 'pretos',
        pink: 'rosas',
        red: 'vermelhos',
        orange: 'laranjas',
        hazel: 'avela',
        unknow: 'desconhecido',
    };

    return cores[eyeColor] || eyeColor;
}

function convertHeight(height) {
    if (height === 'unknown') {
        return 'desconhecida';
    }

    return (height / 100).toFixed(2);
}

function convertMass(mass) {
    if (mass === 'unknown') {
        return 'desconhecido';
    }

    return `${mass} Kg`
}

function convertBirth(birth) {
    if (birth === 'unknown') {
        return 'desconhecido';
    }

    return birth;
}