
// Espera o DOM carregar completamente antes de executar o código

document.addEventListener('DOMContentLoaded', function() {
    // Obtém referências aos elementos do DOM
    const inputNome = document.getElementById('inputNome');
    const btnBuscar = document.getElementById('btnBuscar');
    const infoUsuario = document.getElementById('infoUsuario');

    // Função para buscar dados do Pokémon na API
    async function fetchPokemon(pokemonName) {
        try {
            // Faz a requisição para a API
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            
            // Se a resposta não for OK (status 200-299), lança um erro
            if (!response.ok) {
                throw new Error('Pokémon não encontrado!');
            }
            
            // Converte a resposta para JSON
            const data = await response.json();
            return data;
        } catch (error) {
            // Propaga o erro para ser tratado onde a função foi chamada
            throw error;
        }
    }

    // Função para exibir as informações do Pokémon na tela
    function displayPokemonInfo(pokemon) {
        // Mapeia as habilidades para um array de nomes
        const abilities = pokemon.abilities.map(ability => ability.ability.name);
        
        // Cria o HTML para exibir as informações
        infoUsuario.innerHTML = `
            <p class="pokemon-name">${pokemon.name}</p>
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Habilidades:</p>
            <div class="pokemon-abilities">
                ${abilities.map(ability => `<span class="ability">${ability}</span>`).join('')}
            </div>
        `;
    }

    // Função para exibir mensagens de erro
    function displayError(message) {
        infoUsuario.innerHTML = `<p class="error-message">${message}</p>`;
    }

    // Adiciona evento de clique no botão de busca
    btnBuscar.addEventListener('click', async function() {
        // Obtém o nome do Pokémon digitado, removendo espaços em branco
        const pokemonName = inputNome.value.trim();
        
        // Verifica se o campo não está vazio
        if (!pokemonName) {
            displayError('Por favor, digite o nome de um Pokémon!');
            return;
        }

        // Exibe mensagem de carregamento
        infoUsuario.innerHTML = '<p>Procurando Pokémon...</p>';
        
        try {
            // Busca os dados do Pokémon
            const pokemon = await fetchPokemon(pokemonName);
            // Exibe as informações na tela
            displayPokemonInfo(pokemon);
        } catch (error) {
            // Exibe mensagem de erro se algo der errado
            displayError(error.message);
        }
    });

    // Adiciona evento para buscar ao pressionar Enter no input
    inputNome.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            btnBuscar.click();
        }
    });
});