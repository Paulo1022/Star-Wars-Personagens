let currentPageUrl = 'https://swapi.dev/api/planets/'

window.onload = async () => {
    try {
        await loadPlanetes(currentPageUrl);
        function hideLoading() {
            const loading = document.getElementById('loading_bg');
            loading.style.visibility = 'hidden';
        }
        hideLoading();

    } catch (erro) {
        console.log(erro);
        alert('Erro ao carregar planetas');
    }

    const botaoAvancar = document.getElementById('botao_avancar');
    const botaoVoltar = document.getElementById('botao_voltar');

    botaoAvancar.addEventListener('click', carragarProximaPagina);
    botaoVoltar.addEventListener('click', carragarUltimaPagina);
}

async function loadPlanetes(url) {
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

        responseJson.results.forEach((planet) => {
            const card = document.createElement('div');
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/planets/${planet.url.replace(/\D/g, "")}.jpg'), url('https://starwars-visualguide.com/assets/img/big-placeholder.jpg')`;
            card.className = "card_planeta";

            const planetNameBg = document.createElement('div');
            planetNameBg.className = "planet_bg";

            const planetName = document.createElement('span');
            planetName.className = "planet_name";
            planetName.innerText = `${planet.name}`;

            card.onclick = () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = 'visible';

                const modalContent = document.getElementById('modal_content');
                modalContent.innerHTML = '';

                const planetImage = document.createElement('div');
                planetImage.className = "planet_image";
                planetImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/planets/${planet.url.replace(/\D/g, "")}.jpg'), url('https://starwars-visualguide.com/assets/img/big-placeholder.jpg')`;

                const terrain = document.createElement('span');
                terrain.className = "details";
                terrain.innerText = `terreno: ${convertTerrain(planet.terrain)}`;
                
                const climate = document.createElement('span');
                climate.className = "details";
                climate.innerText = `clima: ${covertClimate(planet.climate)}`;

                const population = document.createElement('span');
                population.className = "details";
                population.innerText = `população: ${convertPopulation(planet.population)}`;

                const gravity = document.createElement('span');
                gravity.className = "details";
                gravity.innerText = `gravidade: ${planet.gravity}`;

                const rotationPeriod = document.createElement('span');
                rotationPeriod.className = "details";
                rotationPeriod.innerText = `rotação: ${planet.rotation_period} hora(s)`;

                const orbitalPeriod = document.createElement('span');
                orbitalPeriod.className = "details";
                orbitalPeriod.innerText = `orbita: ${planet.orbital_period} dia(s)`;

                const diameter = document.createElement('span');
                diameter.className = "details";
                diameter.innerText = `diametro: ${planet.diameter} Km`;

                const surfaceWater = document.createElement('span');
                surfaceWater.className = "details";
                surfaceWater.innerText = `porcentagem de agua: ${convertWater(planet.surface_water)}`;

                modalContent.appendChild(planetImage);
                modalContent.appendChild(terrain);
                modalContent.appendChild(climate);
                modalContent.appendChild(population);
                modalContent.appendChild(gravity);
                modalContent.appendChild(rotationPeriod);
                modalContent.appendChild(orbitalPeriod);
                modalContent.appendChild(diameter);
                modalContent.appendChild(surfaceWater);

            }

            mainContent.appendChild(card);
            card.appendChild(planetNameBg);
            planetNameBg.appendChild(planetName);
        });

        const botaoAvancar = document.getElementById('botao_avancar');
        const botaoVoltar = document.getElementById('botao_voltar');

        botaoAvancar.disabled = !responseJson.next;
        botaoVoltar.disabled = !responseJson.previous;

        botaoVoltar.style.visibility = responseJson.previous? 'visible' : 'hidden' ;
        botaoAvancar.style.visibility = responseJson.next? 'visible' : 'hidden' ;

        currentPageUrl = url

    } catch (erro) {
        console.log(erro);
        alert('Erro ao carregar os planetas')
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
        await loadPlanetes(responseJson.next);
    } catch (erro) {
        console.log(erro);
        alert('Erro ao carregar a próxima página');
    }
}

async function carragarUltimaPagina () {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();
        await loadPlanetes(responseJson.previous);
    } catch (erro) {
        console.log(erro);
        alert('Erro ao carregar a última página');
    }
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = 'hidden';
}

const modal = document.getElementById('modal');
modal.addEventListener('click', hideModal);

function convertTerrain(terrain) {
    const terreno = {
        desert: 'deserto',
        mountains: 'montanhas',
        grasslands: 'pradarias',
        jungle: 'selva',
        rainforests: 'florestas tropicais',
        swamp: 'pantano',
        forests: 'florestas',
        lakes: 'lagos',
        cityscape: 'urbano',
        ocean: 'oceano',
        rock: 'pedregoso',
        barren: 'esteril',
        scrublands: 'matagais',
        savanna: 'savana',
        canyons: 'canions',
        sinkholes: 'esburacados',
        volcanoes: 'vulcanico',
        caves: 'cavernas',
        rivers: 'rios',
        glaciers: 'geleiras',
        fields: 'campos',
        grass: 'gramado',
    };

    return terreno[terrain] || terrain;
}

function covertClimate(climate) {
    const climas = {
        arid: 'arido',
        temperate: 'temperado',
        frozen: 'gelido',
        murky: 'lugubre',
        windy: 'ventoso',
        hot: 'quente',
        frigid: 'glacial',
        humid: 'umido',
        moist: 'umido',
    };

    return climas[climate] || climate;
}

function convertPopulation(population) {
    if (population === 'unknown') {
        return 'desconhecida';
    }

    return `${population}`;
}

function convertWater(water) {
    if (water === 'unknown') {
        return 'desconhecida';
    }

    return `${water}%`
}