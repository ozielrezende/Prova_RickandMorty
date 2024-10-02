const characterList = document.getElementById('characterList');
const filterInput = document.getElementById('filterInput');
const favoriteList = document.getElementById('favoriteList');
const details = document.getElementById('details');
let characters = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Função para buscar dados da API
async function fetchCharacters() {
    const response = await fetch('https://rickandmortyapi.com/api/character/?page=1');
    const data = await response.json();
    characters = data.results.map(character => ({
        id: character.id,
        name: character.name,
        image: character.image,
        status: character.status,
        species: character.species
    }));
    renderCharacters(characters);
}

// Função para renderizar os personagens
function renderCharacters(characters) {
    characterList.innerHTML = '';
    characters.forEach(character => {
        const characterItem = document.createElement('div');
        characterItem.className = 'character-item';
        characterItem.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <p>${character.name}</p>
            <p>Status: ${character.status}</p>
            <p>Espécie: ${character.species}</p>
        `;

        characterItem.addEventListener('click', () => showDetails(character));

        if (favorites.includes(character.id)) {
            characterItem.classList.add('favorite');
        }

        characterItem.addEventListener('click', () => toggleFavorite(character.id));
        characterList.appendChild(characterItem);
    });
    renderFavorites();
}

// Função para renderizar favoritos
function renderFavorites() {
    favoriteList.innerHTML = '';
    favorites.forEach(fav => {
        const favItem = document.createElement('div');
        const character = characters.find(char => char.id === fav);
        if (character) {
            favItem.innerText = character.name;
            favoriteList.appendChild(favItem);
        }
    });
}

// Função para exibir detalhes
function showDetails(character) {
    details.innerHTML = `
        <h2>Detalhes do Personagem</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Nome: ${character.name}</p>
        <p>Status: ${character.status}</p>
        <p>Espécie: ${character.species}</p>
    `;
}

// Função para alternar favoritos
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderCharacters(characters);
}

// Filtragem
filterInput.addEventListener('input', () => {
    const filterText = filterInput.value.toLowerCase();
    const filteredCharacters = characters.filter(character => character.name.toLowerCase().includes(filterText));
    renderCharacters(filteredCharacters);
});

// Scroll infinito
let page = 2;

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        fetchMoreCharacters();
    }
});

async function fetchMoreCharacters() {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
    const data = await response.json();
    if (data.results.length > 0) {
        const newCharacters = data.results.map(character => ({
            id: character.id,
            name: character.name,
            image: character.image,
            status: character.status,
            species: character.species
        }));
        characters = [...characters, ...newCharacters];
        renderCharacters(characters);
        page++;
    }
}

// Inicialização
fetchCharacters();