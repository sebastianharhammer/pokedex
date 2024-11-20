const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const EVOLUTION_URL = "https://pokeapi.co/api/v2/evolution-chain/";
let counterOffset = 0;
let counterLimit = 10;
let addPokemonHTMLExists = false;
let addSearchHTMLExists = false;
let savedPokemon = [];
let localStorageCounterVar = localStorage.setItem("counterVar", 0);

counterOffset = localStorage.getItem("counterVar") ? parseInt(localStorage.getItem("counterVar")) : 0;
let pokemonList = [];

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


function hideSecondEvo() {
  let secondEvo = document.getElementById('second-evo-name');
  secondEvo.classList.add(d-none);
}


function hideThirdEvo() {
  let thirdEvo = document.getElementById('third-evo-name');
  thirdEvo.classList.add('d-none');
}


async function searchPokemon() {
  const searchInput = document.getElementById("search-input");
  const search = searchInput.value.toLowerCase().trim();
  if (search === "") {
    alert("Please enter a Name or ID");
    return;
  }
  const searchParam = isNaN(search) ? search : parseInt(search);
  if (isPokemonSaved(searchParam)) {
    openPokemonGeneral(searchParam);
  } else {
    await fetchSearchData(searchParam);
  }
  searchInput.value = "";
}


async function fetchSearchData(searchParam) {
  try {
    const response = await fetch(BASE_URL + "/" + searchParam);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Wie bekomme ich diese obrige Fehlermeldung weg?");
      }
      searchErrorHTML();
      return;
    }
    openPokemonGeneral(searchParam);
  } catch (error) {
    console.error("Network error or fetch failed:", error);
    searchErrorHTML();
  }
}




function setOverlay() {
  addPokemonHTMLExists = true;
  addSearchHTMLExists = true;
}


function loadExistedContent() {
  let contentId = document.getElementById('content');
  let loadedContent = localStorage.getItem("loadedContent");
  clearPokemonStorage();
  if (loadedContent) {
    contentId.innerHTML = JSON.parse(loadedContent);
    setOverlay();
  }
  else {
    clearContent();
    clearStorage();
    getData();
  }
}


function loadOtherPokemon(id) {
  console.table(id);
  localStorage.removeItem("bigPokemonLocalStorage");
  localStorage.removeItem("bigPokemonLocalStorageText");
  openPokemonGeneral(BASE_URL + "/" + id);
}


function clearPokemonStorage() {
  localStorage.removeItem("bigPokemonLocalStorage");
  localStorage.removeItem("bigPokemonLocalStorageText");
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
    pokemonList = json.results;
    loadOverlay();
    getPokemonForLoop(json);
  } catch (error) {
    console.error(error.message);
    hideLoadingSymbol();
  }
}


async function loadOverlay() {
  if (!addSearchHTMLExists) {
    addSearchHTML();
  }
  if (!addPokemonHTMLExists) {
    addFooterHTML();
  }
}

function showLoadingSymbol() {
  document.getElementById('loadingOverlay').classList.remove('d-none');
}

function hideLoadingSymbol() {
  document.getElementById('loadingOverlay').classList.add('d-none');
}


async function getPokemonForLoop(json) {
  let allPokemonData = await fetchPokemonData(json);
  processPokemonData(allPokemonData);
}


async function fetchPokemonData(json) {
  const allPokemonData = await Promise.all(json.results.map(async (pokemonData) => {
    const response = await fetch(pokemonData.url);
    const pokemon = await response.json();
    const textResponse = await fetch(pokemon.species.url);
    const textJson = await textResponse.json();
    return {
      url: pokemonData.url,
      data: pokemon,
      text: textJson.flavor_text_entries
    };
  }));
  return allPokemonData;
}



function processPokemonData(allPokemonData) {
  for (let z = 0; z < allPokemonData.length; z++) {
    let pokemonObject = allPokemonData[z];
    savedPokemon.push({
      data: pokemonObject.data,
      text: pokemonObject.text
    });
    pokemonHTML(pokemonObject.url, pokemonObject.data);
  }
  hideLoadingSymbol();
}


function setCounter() {
  if (addPokemonHTMLExists === true) {
    let localStorageCounterVar = localStorage.getItem("counterVar");
        localStorageCounterVar = parseInt(localStorageCounterVar);
        counterLimit = localStorageCounterVar + counterLimit; 
        counterOffset = 0;
  }
}


function saveHTML() {
  let contentId = document.getElementById('content');
  localStorage.setItem("loadedContent", JSON.stringify(contentId.innerHTML));
}


function isPokemonSaved(IDorName) {
  for (let i = 0; i < savedPokemon.length; i++) {
    if (savedPokemon[i]) {
      const savedId = savedPokemon[i].data.id;
      const savedName = savedPokemon[i].data.name.toLowerCase();

      if (IDorName === savedId || IDorName === savedName) {
        return true;
      }
    }
  }
  return false;
}


async function openPokemonGeneral(idOrName) {
  if (idOrName === 0) {
    alert("You reached the first pokemon!")
    idOrName = 1;
  }
  const cachedPokemon = getCachedPokemon(idOrName);
  if (cachedPokemon) {
    renderPokemonData(cachedPokemon.data, cachedPokemon.text);
    return;
  }
  const { 
    data: pokemonData,
    text: pokemonText } = await fetchPokemonForGeneral(idOrName);
  savedPokemon.push({
    data: pokemonData,
    text: pokemonText
  });
  sortSavedPokemonById();
  renderPokemonData(pokemonData, pokemonText);
}


function getCachedPokemon(idOrName) {
  return savedPokemon.find(pokemon =>
    pokemon && (pokemon.data.id === idOrName || pokemon.data.name.toLowerCase() === idOrName)
  );
}


async function fetchPokemonForGeneral(idOrName) {
  const urlAPI = `${BASE_URL}/${idOrName}`;
  const response = await fetch(urlAPI);
  const pokemonData = await response.json();
  const pokemonTextUrl = pokemonData.species.url;
  const responsePokemonText = await fetch(pokemonTextUrl);
  const pokemonTextAPI = await responsePokemonText.json();
  const text = pokemonTextAPI.flavor_text_entries;
  return { data: pokemonData, text: text };
}

function renderPokemonData(pokemonData, pokemonText) {
  pokemonGeneralHTML(pokemonData, pokemonText);
}


function sortSavedPokemonById() {
  savedPokemon.sort((a, b) => a && b ? a.data.id - b.data.id : 0);
}


function addEnglishText(text) {
  for (let lanIndex = 0; lanIndex < text.length; lanIndex++) {
    if (text[lanIndex].language.name === "en") {
      return text[lanIndex].flavor_text;
    }
  }
  return "";
}


function openPokemonStats(ID) {
  for (let i=0; i < savedPokemon.length; i++) {
    if (ID === savedPokemon[i].data.id) {
      pokemonStatsHTML(savedPokemon[i].data);
    }
  }
}


async function openPokemonEvolution(ID) {
  for (let i=0; i < savedPokemon.length; i++) {
    if (ID === savedPokemon[i].data.id) {
      getEvolutionChain(savedPokemon[i].data);
    }
  }
}


async function addPokemon() {
  counterOffset += 10;
  showLoadingSymbol();
  await getData();
}


async function getEvolutionChain(pokemon) {
  showLoadingSymbol();
  try { let speciesResponse = await fetch(`${BASE_URL}-species/${pokemon.name}`);
        if (!speciesResponse.ok) throw new Error(`Species data not found (Status: ${speciesResponse.status})`);
        let speciesData = await speciesResponse.json();
        let evolutionChainUrl = speciesData.evolution_chain.url;
        let chainResponse = await fetch(evolutionChainUrl);
        if (!chainResponse.ok) throw new Error(`Evolution chain data not found (Status: ${chainResponse.status})`);
        let chainData = await chainResponse.json();
        await processEvolutionChain(chainData, pokemon);
  } catch (error) {
    console.error("Error, fetching evolution chain:", error);
  }
}


async function processEvolutionChain(chainData, pokemon) {
  let firstEvo = chainData.chain.species;
  let secondEvo = chainData.chain.evolves_to[0]?.species || null;
  let thirdEvo = chainData.chain.evolves_to[0]?.evolves_to[0]?.species || null;
  if (firstEvo.name === pokemon.name  || (secondEvo && secondEvo.name === pokemon.name) 
                                      || (thirdEvo && thirdEvo.name === pokemon.name)) {
    const promises = [fetchPokemonDetails(firstEvo.name)];
    if (secondEvo) promises.push(fetchPokemonDetails(secondEvo.name));
    if (thirdEvo) promises.push(fetchPokemonDetails(thirdEvo.name));
    const [first, second, third] = await Promise.all(promises);
    pokemonEvolutionHTML(pokemon, first, second, third);
    hideLoadingSymbol();
  }
}


async function fetchPokemonDetails(name) {
  let response = await fetch(`${BASE_URL}/${name}`);
  if (!response.ok) throw new Error(`Data for ${name} not found (Status: ${response.status})`);
  return await response.json();
}
