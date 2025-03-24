function addSearchHTML() {
  const contentId = document.getElementById("content");
  contentId.innerHTML += /*HTML*/ `
    <div id="search-input-container">
        <input id="search-input" placeholder="Search for Pokemons ID/NAME">
        <button id="search-btn" onclick="searchPokemon()">SEARCH</button>
    </div>`;
  addSearchHTMLExists = true;
}


function addFooterHTML() {
  const contentId = document.getElementById("content");
  contentId.innerHTML += /*HTML*/ `
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
  const contentId = document.getElementById("content");
  let mainType = pokemon.types[0].type.name;
  let cardHTML = /*HTML*/ `
    <div class="card ${mainType}" id="${URL}" onclick="openPokemonGeneral(${pokemon.id})">
        <div class="card-top">
            <span class="pokemon-name">${pokemon.name}</span>
            <span class="pokemon-id">ID: ${pokemon.id}</span>
        </div>
        <div class="card-middle">`;
  for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
    cardHTML += /*HTML*/ `
            <span class="pokemon-type">${pokemon.types[typeIndex].type.name}</span>`;
  }
  cardHTML += /*HTML*/ `
        </div >
        <div class="pokemon-image-container">
        <img class="pokemon-img" src="${pokemon.sprites.other["official-artwork"].front_default}">
        </div>`;
  contentId.innerHTML += cardHTML;
  saveHTML(URL, pokemon);
}


function searchErrorHTML() {
        document.getElementById("content").innerHTML = /*html*/`
      <div class="error-container">
      <p id="search-error-message">Pokémon not found</p>
      <button id="back-btn-error" onclick="loadExistedContent()">BACK</button>
      </div>`;
}


function pokemonGeneralHTML(pokemon, text) {
  clearContent();  
  const contentId = document.getElementById("content");
  const pokemonText = addEnglishText(text).replace(/\u000c/g, "");
  let mainType = pokemon.types[0].type.name;
  contentId.innerHTML = /*HTML*/ `
    <div id="pokemon-big-container">
        <div id="card-top-id" onclick="getData(), clearContent(), clearStorage()">
            <span id="pokemon-name-id">${pokemon.name}</span>
            <span id="pokemon-id-id">ID: ${pokemon.id}</span>
        </div>
        <div id="${URL}" class="width-100 d-flex pokemon-container ${mainType}">
          <div id="pokemon-navigation">
            <img id="pokemon-last-button" onclick="openPokemonGeneral(${parseInt(pokemon.id) - 1})" src="./assets/icons/arrow-right-solid.svg">
            <img id="pokemon-next-button" onclick="openPokemonGeneral(${parseInt(pokemon.id) + 1})" src="./assets/icons/arrow-right-solid.svg">
          </div>
            <img id="pokemon-img-id" src="${pokemon.sprites.other["official-artwork"].front_default}">
            <span id="pokemon-text">${pokemonText}</span>
        </div>
        <div id="pokemon-weight-height">
                <span class="phys-info" id="pokemon-weight">HEIGHT: ${pokemon.height * 10}cm</span>
                <span class="phys-info" id="pokemon-height">WEIGHT: ${pokemon.weight / 10}kg</span>
        </div>
        <div id="card-bottom-id">
            <span class="pokemon-info" id="general" onclick="openPokemonGeneral(${pokemon.id})">General</span>
            <span class="pokemon-info" id="stats" onclick="openPokemonStats(${pokemon.id})">Stats</span>
            <span class="pokemon-info" id="evolution" onclick="openPokemonEvolution(${pokemon.id})">Evolution</span>
        </div>
        <div id="back-btn-container-big-pokemon">
            <span id="back-btn-big-pokemon" onclick="loadExistedContent()">BACK TO ALL</span>
        </div>
    </div>`;
}


function pokemonStatsHTML(pokemon) {
  const contentId = document.getElementById("content");
  clearContent();
  contentId.innerHTML = /*HTML*/ `
        <div id="pokemon-big-container">
            <div id="card-top-id" onclick="getData(), clearContent(), clearStorage()">
                <span id="pokemon-name-id">${pokemon.name}</span>
                <span id="pokemon-id-id">ID: ${pokemon.id}</span>
            </div>
            <div id="pokemon-stats-container-id">
                <h2>BASE STATS</h2>
                ${generateStatBar("HP", pokemon.stats[0].base_stat)}
                ${generateStatBar("Attack", pokemon.stats[1].base_stat)}
                ${generateStatBar("Defense", pokemon.stats[2].base_stat)}
                ${generateStatBar("Sp. Atk", pokemon.stats[3].base_stat)}
                ${generateStatBar("Sp. Def", pokemon.stats[4].base_stat)}
                ${generateStatBar("Speed", pokemon.stats[5].base_stat)}
            </div>
            <div id="card-bottom-id">
                <span class="pokemon-info" id="general" onclick="openPokemonGeneral(${pokemon.id})">General</span>
                <span class="pokemon-info" id="stats" onclick="openPokemonStats(${pokemon.id})">Stats</span>
                <span class="pokemon-info" id="evolution" onclick="openPokemonEvolution(${pokemon.id})">Evolution</span>
            </div>
            <div id="back-btn-container-big-pokemon">
            <button id="back-btn-big-pokemon" onclick="loadExistedContent()">BACK TO ALL</button>
            </div>
        </div>`;
        
}


function generateStatBar(statName, statValue) {
  const maxStat = 255;
  const statPercentage = (statValue / maxStat) * 100;
  return /*HTML*/ `
        <div class="pokemon-stat-container">
            <span class="stat-label">${statName}: ${statValue}</span>
            <div class="progress-bar">
                <div class="progress" style="width: ${statPercentage}%;"></div>
            </div>
        </div>
    `;
}


function pokemonEvolutionHTML(pokemon, first, second, third) {
  const contentId = document.getElementById("content");
  clearContent();
  let secondEvoHTML = second ? 
                        `<div class="pokemon-evo-single-container">
                            <span class="pokemon-evo-name" id="second-evo-name">${second.name}</span>
                            <img class="evo-pok" src="${second.sprites.other["official-artwork"].front_default}" onclick="openPokemonGeneral(${second.id})">
                        </div>`
                            : "";
  let thirdEvoHTML = third  ? 
                        `<div class="pokemon-evo-single-container">
                            <span class="pokemon-evo-name" id="third-evo-name">${third.name}</span>
                            <img class="evo-pok" src="${third.sprites.other["official-artwork"].front_default}" onclick="openPokemonGeneral(${third.id})">
                        </div>`
                            : "";
  contentId.innerHTML = /*HTML*/ `
    <div id="pokemon-big-container">
        <div id="card-top-id" onclick="getData(), clearContent(), clearStorage()">
            <span id="pokemon-name-id">${pokemon.name}</span>
            <span id="pokemon-id-id">ID: ${pokemon.id}</span>
        </div>
        <div id="pokemon-evo-container-id">
            <div class="pokemon-evo-single-container">
                <span class="pokemon-evo-name">${first.name}</span>
                <img class="evo-pok" src="${first.sprites.other["official-artwork"].front_default}" onclick="openPokemonGeneral(${first.id})">
                </div>
                ${secondEvoHTML}
                ${thirdEvoHTML}
        </div>
        <div id="card-bottom-id">
            <span class="pokemon-info" id="general" onclick="openPokemonGeneral(${pokemon.id})">General</span>
            <span class="pokemon-info" id="stats" onclick="openPokemonStats(${pokemon.id})">Stats</span>
            <span class="pokemon-info" id="evolution" onclick="openPokemonEvolution(${pokemon.id})">Evolution</span>
        </div>
        <div id="back-btn-container-big-pokemon">
            <button id="back-btn-big-pokemon" onclick="loadExistedContent()">BACK TO ALL</button>
        </div>
    </div>`;
}
