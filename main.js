const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

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

//getPokemons();