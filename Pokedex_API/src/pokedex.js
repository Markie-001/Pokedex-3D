// Pokemon and name
export function createPokedexScreen() {
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `
    <form class="search">
      <input class="name" placeholder="Pikachu"/>
    </form>
    <div class="info">Loading...</div>
  `;

  const info = el.querySelector('.info');
  let currentId = 25;

  async function loadPokemon(query) {
    info.textContent = 'Loading...';
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${String(query).toLowerCase().trim()}`
      );
      if (!res.ok) throw new Error('Not found');
      const p = await res.json();
      currentId = p.id;
      window.dispatchEvent(new CustomEvent('pokemon-loaded', { detail: p }));
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

// Stats
export function createStatScreen() {
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `<div class="info">Loading...</div>`;
  const info = el.querySelector('.info');

  window.addEventListener('pokemon-loaded', (e) => {
    const p = e.detail;
    info.innerHTML = `
      ${p.stats.map((s) => `<p>${s.stat.name}: ${s.base_stat}</p>`).join('')}
    `;
  });

  return el;
}