const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Elementos del DOM
const pokemonsContainer = document.getElementById('pokemons-container');

const limit = 20;

async function getPokemons(offset = 0) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok)
      throw new Error(
        `No se pudo obtener la lista de Pokemons. Status Code ${response.status}`
      );

    const data = await response.json();

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

    renderPokemons(detailedPokemons);

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
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <h3>${pokemon.name} (#${pokemon.id})</h3>
      <p><strong>Tipo:</strong> ${types}</p>
      <p><strong>Habilidades:</strong> ${abilities}</p>
      <p><strong>HP:</strong> ${hpStat ? hpStat.value : 'N/A'}</p>
      <p><strong>Ataque:</strong> ${attackStat ? attackStat.value : 'N/A'}</p>
      <p><strong>Defensa:</strong> ${defenseStat ? defenseStat.value : 'N/A'}</p>
    `;

    pokemonsContainer.appendChild(card);
  });
}



getPokemons();