const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Elementos del DOM
const pokemonsContainer = document.getElementById('pokemons-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const limit = 20;
let offset = 0; // Guardamos en que grupo de 20 estamos
let totalPokemons = 0; 


async function getPokemons(offsetValue = 0) {
  try {
    const response = await fetch(`${BASE_URL}?offset=${offsetValue}&limit=${limit}`);

    if (!response.ok)
      throw new Error(
        `No se pudo obtener la lista de Pokemons. Status Code ${response.status}`
      );

    const data = await response.json();

    if (totalPokemons === 0) {
      totalPokemons = data.count; // Total de pokemones existentes
    }

    const detailedPokemons = [];

    // Peticiones secuenciales, una por una
    for (const pokemon of data.results) {
      const res = await fetch(pokemon.url);
      if (!res.ok)
        throw new Error(
          `No se pudo obtener la información del Pokemon "${pokemon.name}". Status Code: ${res.status}`
        );

      const details = await res.json();

      detailedPokemons.push({
        id: details.id,
        name: details.name,
        types: details.types.map((typeInfo) => typeInfo.type.name),
        image: details.sprites.front_default,
        abilities: details.abilities.map(
          (abilityInfo) => abilityInfo.ability.name
        ),
        stats: details.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      });
    }


    console.log(detailedPokemons);

    renderPokemons(detailedPokemons);

    updatePaginationButtons(); // Actualizamos botones después de renderizar


  } catch (error) {
    console.error('Ocurrió un problema al cargar los datos de los Pokemon:', error.message);
  }
}

function renderPokemons(pokemons) {
  pokemonsContainer.innerHTML = '';

  pokemons.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const types = pokemon.types.join(', ');
    const abilities = pokemon.abilities.join(', ');

    const hpStat = pokemon.stats.find(stat => stat.name === 'hp');
    const attackStat = pokemon.stats.find(stat => stat.name === 'attack');
    const defenseStat = pokemon.stats.find(stat => stat.name === 'defense');

    card.innerHTML = `
    <div class="pokemon-img">
        <img src="${pokemon.image}" alt="${pokemon.name}">
    </div>
    <div class="pokemon-content">
    <h3>${pokemon.name} (#${pokemon.id})</h3>
      <p><strong>Tipo:</strong> ${types}</p>
      <p><strong>Habilidades:</strong> ${abilities}</p>
      <p><strong>HP:</strong> ${hpStat ? hpStat.value : 'N/A'}</p>
      <p><strong>Ataque:</strong> ${attackStat ? attackStat.value : 'N/A'}</p>
      <p><strong>Defensa:</strong> ${defenseStat ? defenseStat.value : 'N/A'}</p>
    </div>
      
    `;

    pokemonsContainer.appendChild(card);
  });
}


// Controla el estado de los botones según el offset actual
function updatePaginationButtons() {
  prevBtn.disabled = offset === 0;
  nextBtn.disabled = offset >= totalPokemons - limit;
}

prevBtn.addEventListener('click', () => {
  if (offset >= limit) {
    offset -= limit;
    getPokemons(offset);
  }
});

nextBtn.addEventListener('click', () => {
  if (offset + limit < totalPokemons) {
    offset += limit;
    getPokemons(offset);
  }
});

getPokemons();