var paginaAtual = 1;
const pageSize = 8;
const btnProximo = document.querySelector("#btnProximo");
const btnAnterior = document.querySelector("#btnAnterior");
const data = document.querySelector("#data");
const totalCharacters = document.querySelector("#personagem");
const totalLocations = document.querySelector("#local");
const totalEpisodes = document.querySelector("#eps");
dados();
contador();

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
    axios
      .get(`https://rickandmortyapi.com/api/character/?page=${paginaAtual}`)
      .then(async (result) => {
        data.innerHTML = "";
        result.data.results.forEach(async (personagens) => {
          let provaDeVida = "";

          if (personagens.status == "Alive") {
            provaDeVida = "alive";
          } else if (personagens.status == "Dead") {
            provaDeVida = "dead";
          } else {
            provaDeVida = "unknown";
          }

          const ultimoEpisodio = await buscarNomeUltimoEpisodio(
            personagens.episode[personagens.episode.length - 1]
          );
          data.innerHTML += `<div class="card">
                <figure>
                <img class="avatar" src="${personagens.image}" alt="${personagens.name}">
                </figure>
                <aside class="bio">
                <span class="titulo-card">
                <h2>${personagens.name}</h2>
                </span>
                <div class="status">
                <p style="margin-top: 15px;">
                <span class="status-indicator ${provaDeVida}"></span>
                 ${personagens.status} - ${personagens.species}
                </p>
                </div>
                <p class="txt-cima"><span>Last Known Location:</span></p>
                <p class="txt-baixo">${personagens.location.name}</p>
                <p class="txt-cima"><span>Last seen:</span></p>
                <p class="txt-baixo">${ultimoEpisodio}</p>       
                </aside>
                <div>
            `;
        });

        
        verificarPagina(result.data.info.pages);
      });
  } catch (error) {
    console.error("Erro ao carregar os personagens:", error);
  }
}

async function contador() {
  try {
    const [charactersResponse, locationsResponse, episodesResponse] = await Promise.all([
      axios.get(`https://rickandmortyapi.com/api/character/`),
      axios.get(`https://rickandmortyapi.com/api/location`),
      axios.get(`https://rickandmortyapi.com/api/episode`)
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