function addSearchHTML() {
    const contentId = document.getElementById('content');
    contentId.innerHTML += /*HTML*/`
    <div id="search-input-container">
        <input id="search-input" placeholder="Search for Pokemons ID/NAME">
        <button onclick="searchPokemon()">SEARCH</button>
    </div>`;
    addSearchHTMLExists = true;
}


function addFooterHTML() {
    const contentId = document.getElementById('content');
    contentId.innerHTML += /*HTML*/`
    <div id="button-add-container">
        <button id="add-btn" onclick="addPokemon()">LOAD ${counterLimit} MORE</button>
    </div>
    <div id="button-footer-container">
        <a id="footer-link" href="#end">
            <img src="./assets/icons/right-arrow-icon.svg" id="arrow-icon">
        </a>
    </div>`;
    addPokemonHTMLExists = true;
}


function pokemonHTML(URL, pokemon) {
    const contentId = document.getElementById('content');
    let cardHTML = /*HTML*/`
    <div class="card" id="${URL}" onclick="openPokemonGeneral('${URL}')">
        <div class="card-top">
            <span class="pokemon-name">${pokemon.name}</span>
            <span class="pokemon-id">ID: ${pokemon.id}</span>
        </div>
        <div class="card-middle">`;
        chooseBackgroundColor(URL);
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        cardHTML += /*HTML*/`
            <span class="pokemon-type">${pokemon.types[typeIndex].type.name}</span>`;
            
    }
    cardHTML += /*HTML*/`
        </div>
        <div class="pokemon-image-container">
        <img class="pokemon-img" src="${pokemon.sprites.other['official-artwork'].front_default}">
        </div>`;
    contentId.innerHTML += cardHTML;
    
}


function pokemonGeneralHTML(URL, pokemon, text) {
    const contentId = document.getElementById('content');
    let pokemonText = "";
    clearContent();
    for (let lanIndex = 0; lanIndex < text.flavor_text_entries.length; lanIndex++){
        if (text.flavor_text_entries[lanIndex].language.name === "en") {
            pokemonText = text.flavor_text_entries[lanIndex].flavor_text;
        }
    }
    contentId.innerHTML = /*HTML*/`
    <div id="pokemon-big-container">
        <div id="card-top-id" onclick="getData(), clearContent(), clearStorage()">
            <span id="pokemon-name-id">${pokemon.name}</span>
            <span id="pokemon-id-id">ID: ${pokemon.id}</span>
        </div>
        <div id="${URL}" class="width-100 d-flex pokemon-container">
            <img id="pokemon-img-id" src="${pokemon.sprites.other['official-artwork'].front_default}">
            <span id="pokemon-text">${pokemonText.replace(/\u000c/g, ' ')}</span>
        </div>
        <div id="pokemon-weight-height">
                <span class="phys-info" id="pokemon-weight">HEIGHT: ${pokemon.height*10}cm</span>
                <span class="phys-info" id="pokemon-height">WEIGHT: ${pokemon.weight/10}kg</span>
            </div>
        <div id="card-bottom-id">
            <span class="pokemon-info" id="general" onclick="openPokemonGeneral('${URL}')">General</span>
            <span class="pokemon-info"id="stats" onclick="openPokemonStats('${URL}')">Stats</span>
            <span class="pokemon-info" id="evolution" onclick="openPokemonEvolution('${URL}')">Evolution</span>
        </div>
    </div>`;
    chooseBackgroundColor(URL);
    addPokemonHTMLExists = false;
    addSearchHTMLExists = false;
    
    let localStorageCounterVar = localStorage.getItem("counterVar");
        localStorageCounterVar = parseInt(localStorageCounterVar);
        counterLimit = localStorageCounterVar + counterLimit;
        counterOffset = 0;
}


function pokemonStatsHTML(URL, pokemon) {
    const contentId = document.getElementById('content');
    clearContent();
    contentId.innerHTML = /*HTML*/`
        <div id="pokemon-big-container">
            <div id="card-top-id" onclick="getData(), clearContent(), clearStorage()">
                <span id="pokemon-name-id">${pokemon.name}</span>
                <span id="pokemon-id-id">ID: ${pokemon.id}</span>
            </div>
            
            <div id="pokemon-stats-container-id">
                <h2>BASE STATS</h2>
                ${generateStatBar('HP', pokemon.stats[0].base_stat)}
                ${generateStatBar('Attack', pokemon.stats[1].base_stat)}
                ${generateStatBar('Defense', pokemon.stats[2].base_stat)}
                ${generateStatBar('Sp. Atk', pokemon.stats[3].base_stat)}
                ${generateStatBar('Sp. Def', pokemon.stats[4].base_stat)}
                ${generateStatBar('Speed', pokemon.stats[5].base_stat)}
            </div>
            <div id="card-bottom-id">
                <span class="pokemon-info" id="general" onclick="openPokemonGeneral('${URL}')">General</span>
                <span class="pokemon-info" id="stats" onclick="openPokemonStats('${URL}')">Stats</span>
                <span class="pokemon-info" id="evolution" onclick="openPokemonEvolution('${URL}')">Evolution</span>
            </div>
        </div>`;
}


function generateStatBar(statName, statValue) {
    const maxStat = 255; 
    const statPercentage = (statValue / maxStat) * 100;
    return /*HTML*/`
        <div class="pokemon-stat-container">
            <span class="stat-label">${statName}: ${statValue}</span>
            <div class="progress-bar">
                <div class="progress" style="width: ${statPercentage}%;"></div>
            </div>
        </div>
    `;
}


function pokemonEvolutionHTML(URL, pokemon, first, second, third) {
    const contentId = document.getElementById('content');
    clearContent();
    let secondEvoHTML = second ? `<img class="evo-pok" src="${second.sprites.other['official-artwork'].front_default}" onclick="openPokemonGeneral('${BASE_URL}/${second.id}')">` : '';
    let thirdEvoHTML = third ? `<img class="evo-pok" src="${third.sprites.other['official-artwork'].front_default}" onclick="openPokemonGeneral('${BASE_URL}/${third.id}')">` : '';
    contentId.innerHTML = /*HTML*/`
    <div id="pokemon-big-container">
        <div id="card-top-id" onclick="getData(), clearContent(), clearStorage()">
            <span id="pokemon-name-id">${pokemon.name}</span>
            <span id="pokemon-id-id">ID: ${pokemon.id}</span>
        </div>
        <div id="pokemon-evo-container-id">
            <img class="evo-pok" src="${first.sprites.other['official-artwork'].front_default}" onclick="openPokemonGeneral('${BASE_URL}/${first.id}')">
            ${secondEvoHTML}
            ${thirdEvoHTML}
        </div>
        <div id="card-bottom-id">
            <span class="pokemon-info" id="general" onclick="openPokemonGeneral('${URL}')">General</span>
            <span class="pokemon-info" id="stats" onclick="openPokemonStats('${URL}')">Stats</span>
            <span class="pokemon-info" id="evolution" onclick="openPokemonEvolution('${URL}')">Evolution</span>
        </div>
    </div>`;
}



