const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const EVOLUTION_URL = "https://pokeapi.co/api/v2/evolution-chain/";
let counterOffset = 0;
let counterLimit = 10;
let addPokemonHTMLExists = false;
let addSearchHTMLExists = false;
let localStorageCounterVar = localStorage.setItem("counterVar", 0);



function clearContent() {
  contentId = document.getElementById("content");
  contentId.innerHTML = "";
  addPokemonHTMLExists = false;
  addSearchHTMLExists = false;
}

function clearStorage() {
  let localStorageCounterVar = localStorage.getItem("counterVar");
  localStorageCounterVar = parseInt(localStorageCounterVar);
  counterLimit -= localStorageCounterVar;
}



async function searchPokemon() {
  const query = document.getElementById("search-input").value.toLowerCase();
  if (query.length === 0) {
      clearContent();
      getData();
      return;   
  }
  try {
      const response = await fetch(`${BASE_URL}/${query}`);
      if (!response.ok) {
          throw new Error('Pokémon not found');
      }
      clearContent();
      openPokemonGeneral(response.url);

  }   catch (error) {
      console.error('Error fetching Pokémon:', error.message);
      document.getElementById("content").innerHTML = /*html*/`
      <div class="error-container">
      <p>Pokémon not found</p>
      <button id="backbtn" onclick="getData(), clearContent()">BACK</button>
      </div>`;
  }
}

async function getData() {
  try {
    const response = await fetch(
      BASE_URL + `?limit=${counterLimit}&offset=${counterOffset}`
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    loadOverlay(json);
  } catch (error) {
    console.error(error.message);
  }
}

async function loadOverlay(json) {
  if (!addSearchHTMLExists) {
    addSearchHTML();
  }
  getPokemonForLoop(json);
  if (!addPokemonHTMLExists) {
    addFooterHTML();
  }
}


async function getPokemonForLoop(json) {
  let allPokemonData = [];

  for (let i = 0; i < json.results.length; i++) {
    let pokemonData = json.results[i];
    let response = await fetch(pokemonData.url);
    let pokemon = await response.json();
    allPokemonData.push({
      url: pokemonData.url,
      data: pokemon
    });
  }

  for (let z = 0; z < allPokemonData.length; z++) {
    let pokemonObject = allPokemonData[z];
    pokemonHTML(pokemonObject.url, pokemonObject.data);
  }
}


async function getPokemon(POKEMON) {
  let response = await fetch(POKEMON);
  let responseUrl = response.url;
  let responseToJson = await response.json();
  pokemonHTML(responseUrl, responseToJson,);
}

async function openPokemonGeneral(pokemonUrl) {
  let response = await fetch(pokemonUrl);
  let responseToJson = await response.json();
  let pokemonTextUrl = responseToJson.species.url;
  let responsePokemonTextUrl = await fetch(pokemonTextUrl);
  let responsePokemonTextJson = await responsePokemonTextUrl.json(); 
  pokemonGeneralHTML(pokemonUrl, responseToJson, responsePokemonTextJson);
}

async function chooseBackgroundColor(URL) {
  try {
    let response = await fetch(URL);
    let responseToJson = await response.json();
    const typeColorMap = {
      grass: "rgb(119,204,85)",
      bug: "rgb(170,187,33)",
      fire: "rgb(255,68,34)",
      normal: "rgb(170,170,153)",
      water: "rgb(52,153,255)",
      electric: "rgb(254,204,51)",
      poison: "rgb(245, 12, 245)",
      ground: "rgb(222,187,85)",
      fighting: "rgb(187,85,68)",
      psychic: "rgb(255,85,153)",
      flying: "rgb(136,153,255)",
      ice: "rgb(102,204,255)",
      rock: "rgb(187,170,102)",
      ghost: "rgb(102,102,187)",
      dragon: "rgb(119,101,238)",
      dark: "rgb(119,85,68)",
      steel: "rgb(170,170,187)",
      fairy: "rgb(238,153,238)",
    };

    const pokemonId = document.getElementById(URL);
    const pokemonType = responseToJson.types[0].type.name;
    pokemonId.style.backgroundColor = typeColorMap[pokemonType];
  } catch (error) {
    console.error("Error fetching or applying background color:", error);
  }
}

async function openPokemonStats(pokemonUrl) {
  let response = await fetch(pokemonUrl);
  let responseToJson = await response.json();
  pokemonStatsHTML(pokemonUrl, responseToJson);
}

async function openPokemonEvolution(pokemonUrl) {
  let response = await fetch(pokemonUrl);
  let responseToJson = await response.json();
  getEvolutionChains(pokemonUrl, responseToJson);
}

function addPokemon() {
  let localStorageCounterVar = localStorage.getItem("counterVar");
  localStorageCounterVar = parseInt(localStorageCounterVar);
  counterLimit = parseInt(counterLimit);
  counterOffset = localStorageCounterVar;
  counterOffset += counterLimit;
  localStorageCounterVar += counterLimit;
  localStorage.setItem("counterVar", localStorageCounterVar);
  console.log(
    "CounterLimit ist:" + counterLimit,
    "CounterOffset ist:" + counterOffset
  );
  getData()
  window.scrollTo({
    top: document.body.scrollHeight,
      behavior: "smooth"}); 
}

async function getEvolutionChains(POKEMONURL, POKEMON) {
  let response = await fetch(EVOLUTION_URL + `?limit=540&offset=0`);
  let responseToJson = await response.json();
  for (let evolutionIndex = 0; evolutionIndex < responseToJson.results.length; evolutionIndex++) {
    let evolutionChain = responseToJson.results[evolutionIndex];
    getEvolution(POKEMONURL, POKEMON, evolutionChain.url);
  }
}

async function getEvolution(POKEMONURL, POKEMON, URL) {
  let response = await fetch(URL);
  if (!response.ok) { 
    throw new Error(`URL not found or invalid (Status: ${response.status})`);
  }
  let responseToJson = await response.json();
  let firstEvoPokemon = responseToJson.chain.species;
  let secondEvoPokemon = responseToJson.chain.evolves_to.length > 0 ? responseToJson.chain.evolves_to[0].species : null;
  let thirdEvoPokemon = (secondEvoPokemon && responseToJson.chain.evolves_to[0].evolves_to.length > 0) ? responseToJson.chain.evolves_to[0].evolves_to[0].species : null;
  if (firstEvoPokemon.name === POKEMON.name || (secondEvoPokemon && secondEvoPokemon.name === POKEMON.name) || (thirdEvoPokemon && thirdEvoPokemon.name === POKEMON.name)) {
      let firstEvoPokemonURL = await fetch(`${BASE_URL}/${firstEvoPokemon.name}`);
      let first = await firstEvoPokemonURL.json();
      let second = null;
      if (secondEvoPokemon) {
          let secondEvoPokemonURL = await fetch(`${BASE_URL}/${secondEvoPokemon.name}`);
          second = await secondEvoPokemonURL.json();
      }
      let third = null;
      if (thirdEvoPokemon) {
          let thirdEvoPokemonURL = await fetch(`${BASE_URL}/${thirdEvoPokemon.name}`);
          third = await thirdEvoPokemonURL.json();
      }
      pokemonEvolutionHTML(POKEMONURL, POKEMON, first, second, third);
  } 
}

