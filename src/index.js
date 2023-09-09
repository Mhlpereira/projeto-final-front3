var paginaAtual = 1;

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results-container");
const suggestionsDiv = document.getElementById("suggestions");
const btnProximo = document.querySelector("#btnProximo");
const btnAnterior = document.querySelector("#btnAnterior");
const data = document.querySelector("#data");
const totalCharacters = document.querySelector("#personagem");
const totalLocations = document.querySelector("#local");
const totalEpisodes = document.querySelector("#eps");
dados();
contador();

searchInput.addEventListener("input", searchCharacters);

async function buscarNomeUltimoEpisodio(url) {
  try {
    const epsResponse = await axios.get(url);
    console.log(epsResponse);
    const epsData = epsResponse.data;
    return epsData.name;
  } catch (error) {
    console.error("Erro ao obter detalhes do último episódio:", error);
    return "Erro ao obter detalhes do episódio";
  }
}

async function dados() {
  try {
    const result = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${paginaAtual}`
    );
    const characters = result.data.results;

    data.innerHTML = "";

    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];

      const card = document.createElement("div");
      card.classList.add("col-md-6");
      card.classList.add("cartoes");

      card.innerHTML = `
        <div class="card bg-btn-br text-white mb-5" style="width: 19rem"
             data-bs-toggle="modal" data-bs-target="#staticBackdrop"
             onclick="modal(${character.id})">
          <figure>
            <img class="avatar" src="${character.image}" alt="${character.name}">
          </figure>
          <h2 class="cartoes-nome">${character.name}</h2>
        </div>
      `;

      data.appendChild(card);
    }

    verificarPagina(result.data.info.pages);
  } catch (error) {
    console.error("Erro ao carregar os personagens:", error);
  }
}

async function modal(id) {
  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    const character = response.data;
    const modalContent = document.getElementById("modal-content");
    const ultimoEpisodio = await buscarNomeUltimoEpisodio(
      character.episode[character.episode.length - 1]
    );
    let provaDeVida = "";

    if (character.status == "Alive") {
      provaDeVida = "alive";
    } else if (character.status == "Dead") {
      provaDeVida = "dead";
    } else {
      provaDeVida = "unknown";
    }

    modalContent.innerHTML = `
      <div class="modal-body">
        <img src="${character.image}" alt="" class="img-fluid rounded-circle">
        <div class="text-center">
          <h1 class="text-white">${character.name}</h1>
          <span class="status-indicator ${provaDeVida}"></span>
          <span class="text-white">${provaDeVida}</span>
          <h6 class="text-white">${character.species}</h6>
          <h6 class="text-white">${character.gender}</h6>
          <h6 class="text-white">${character.origin.name}</h6>
          <h6 class="text-white">${character.location.name}</h6>
        </div>
      </div>`;
  } catch (error) {
    console.error("Erro ao obter detalhes do personagem:", error);
  }
}

async function searchCharacters() {
  const searchText = searchInput.value.trim();

  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?name=${searchText}`
    );
    const characters = response.data.results;
    console.log(searchText);

    data.innerHTML = "";

    for (let x = 0; x < characters.length; x++) {
      const character = characters[x];

      console.log("entrou");
      const characterCard = document.createElement("div");
      characterCard.classList.add("col-md-6");
      characterCard.classList.add("cartoes");
      characterCard.innerHTML += `
      <div class="card bg-btn-br text-white mb-5" style="width: 19rem"
      data-bs-toggle="modal" data-bs-target="#staticBackdrop"
      onclick="modal(${character.id})">
          <figure>
            <img class="avatar" src="${character.image}" alt="${character.name}">
          </figure>
      <h2 class="cartoes-nome">${character.name}</h2>
      </div>
      `;
      data.appendChild(characterCard);
    }
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
}

async function contador() {
  try {
    const [charactersResponse, locationsResponse, episodesResponse] =
      await Promise.all([
        axios.get(`https://rickandmortyapi.com/api/character/`),
        axios.get(`https://rickandmortyapi.com/api/location`),
        axios.get(`https://rickandmortyapi.com/api/episode`),
      ]);

    const contadorP = charactersResponse.data.info.count;
    const contadorL = locationsResponse.data.info.count;
    const contadorE = episodesResponse.data.info.count;

    totalCharacters.innerHTML = `${contadorP}`;
    totalLocations.innerHTML = `${contadorL}`;
    totalEpisodes.innerHTML = `${contadorE}`;
  } catch (error) {
    console.error("Erro ao carregar contadores ", error);
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function verificarPagina(totalDePaginas) {
  if (paginaAtual == 1) {
    btnAnterior.disabled = true;
  } else {
    btnAnterior.disabled = false;
  }
  if (paginaAtual == totalDePaginas) {
    btnProximo.disabled = true;
  } else {
    btnProximo.disabled = false;
  }
}

async function proximo() {
  paginaAtual++;
  dados();
  scrollToTop();
}

async function anterior() {
  paginaAtual--;
  dados();
  scrollToTop();
}
