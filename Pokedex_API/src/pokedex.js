// Makes the green Pokédex screen as a normal HTML box, connected to PokeAPI.
export function createPokedexScreen() {
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `
    <form class="search">
      <input class="name" placeholder="Pikachu" autocomplete="off" />
    </form>
    <div class="info">Loading...</div>
  `;

  const info = el.querySelector('.info');
  let currentId = 25;

  async function loadPokemon(query) {
    info.textContent = 'Loading...';
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${String(query)}`
      );
      if (!res.ok) throw new Error('Not found');
      const p = await res.json();
      currentId = p.id;
      info.innerHTML = `
        <img src="${p.sprites.front_default}" alt="${p.name}">
        <h3>#${p.id} ${p.name}</h3>
      `;
    } catch {
      info.textContent = 'Pokémon not found';
    }
  }

  el.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    loadPokemon(el.querySelector('.name').value);
  });

  loadPokemon(currentId);
  return el;
}

export function createStatScreen() {
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `
    <form class="search">
      <input class="name" placeholder="Pikachu" autocomplete="off" />
    </form>
    <div class="info">Loading...</div>
  `;

  const info = el.querySelector('.info');
  let currentId = 25;

  async function loadPokemon(query) {
    info.textContent = 'Loading...';
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${String(query)}`
      );
      if (!res.ok) throw new Error('Not found');
      const p = await res.json();
      currentId = p.id;
      info.innerHTML = `
        <img src="${p.sprites.front_default}" alt="${p.name}">
        <h3>#${p.id} ${p.name}</h3>
      `;
    } catch {
      info.textContent = 'Pokémon not found';
    }
  }

  el.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    loadPokemon(el.querySelector('.name').value);
  });

  loadPokemon(currentId);
  return el;
}