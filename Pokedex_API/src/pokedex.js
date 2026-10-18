function waitPokemon(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2500);
  });
}

async function loadPokemon(name) {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
    const pokemon = await response.json();

    document.getElementById('namePokemon').textContent = 'Searching for Pokemon';
    document.getElementById('imgPokemon').removeAttribute('src');
    document.getElementById('statPokemon').innerHTML = '';
    await waitPokemon(10);
  
    document.getElementById('imgPokemon').src = pokemon.sprites.front_default;
    document.getElementById('namePokemon').textContent = pokemon.name;
    document.getElementById('statPokemon').innerHTML =
      pokemon.stats.map((s) => '<p>' + s.stat.name + ': ' + s.base_stat + '</p>').join('');
  } catch (error) {
    document.getElementById('namePokemon').textContent = 'Pokemon not found...';
    document.getElementById('imgPokemon').removeAttribute('src');
    document.getElementById('statPokemon').innerHTML = '';
  }
}

export function createPokedexScreen() {
  const screen = document.getElementById('pokemon');
  screen.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    loadPokemon(screen.querySelector('.name').value);
  });

  loadPokemon('pikachu');
  return screen;
}

export function createStatScreen() {
  return document.getElementById('stats');
}

export function pokemonDescription() {
  return document.getElementById('description');
}