async function loadPokemon(name) {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
  const pokemon = await response.json();

  document.getElementById('imgPokemon').src = pokemon.sprites.front_default;
  document.getElementById('namePokemon').textContent = pokemon.name;
  document.getElementById('statPokemon').innerHTML =
    pokemon.stats.map((s) => '<p>' + s.stat.name + ': ' + s.base_stat + '</p>').join('');
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