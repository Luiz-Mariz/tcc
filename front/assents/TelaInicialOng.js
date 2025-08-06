document.addEventListener('DOMContentLoaded', () => {
    // --- Constantes para controle da paginação e elementos HTML ---
    const itemsPerPage = 6;
    let currentPage = 1;
    let allPets = [];
    let filteredPets = [];

    const galeriaPetsDiv = document.getElementById('galeria-pets');
    const loadingMessage = document.getElementById('loading-message');
    const noPetsMessage = document.getElementById('no-pets-message');
    const searchInput = document.getElementById('search-input');
    const speciesFilter = document.getElementById('species-filter');
    const sizeFilter = document.getElementById('size-filter');

    const paginationControls = document.getElementById('pagination-controls');
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('previous-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    // Elementos de perfil corrigidos
    const userProfileInfoDesktop = document.getElementById('user-profile-info-desktop');
    const userProfileInfoMobile = document.getElementById('user-profile-info-mobile');

    // --- FUNÇÕES PRINCIPAIS ---

    // Função para buscar os pets da API
    async function fetchPets() {
        showLoading();
        try {
            const response = await fetch('http://localhost:8080/animais');
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            allPets = await response.json();
            filteredPets = allPets;
            displayPets();
            updatePaginationControls();
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
            showError('Não foi possível carregar os pets. Tente novamente mais tarde.');
        }
    }

    // Função para renderizar os pets na galeria
    function displayPets() {
        galeriaPetsDiv.innerHTML = '';
        hideMessages();

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const petsToDisplay = filteredPets.slice(startIndex, endIndex);

        if (petsToDisplay.length === 0) {
            showNoPetsMessage();
            return;
        }

        petsToDisplay.forEach(pet => {
            const petCard = createPetCard(pet);
            galeriaPetsDiv.appendChild(petCard);
        });

        galeriaPetsDiv.classList.add('grid');
    }

    // Função auxiliar para criar o card do pet
    function createPetCard(pet) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden';
        card.innerHTML = `
            <img src="${pet.foto_url}" alt="Foto de ${pet.nome}" class="w-full h-48 object-cover img-zoom-hover">
            <div class="p-6">
                <h3 class="text-xl font-bold text-purple-800 mb-2">${pet.nome}</h3>
                <p class="text-gray-700 text-sm mb-1">
                    <span class="font-semibold">Espécie:</span> ${pet.especie}
                </p>
                <p class="text-gray-700 text-sm mb-1">
                    <span class="font-semibold">Raça:</span> ${pet.raca}
                </p>
                <p class="text-gray-700 text-sm mb-4">
                    <span class="font-semibold">Porte:</span> ${pet.porte}
                </p>
                <a href="/front/paginas/DetalhesPet.html?id=${pet.id}"
                    class="bg-orange-400 text-purple-900 font-semibold px-4 py-2 rounded-full text-center block w-full hover:bg-orange-500 transition duration-300">
                    Ver Detalhes
                </a>
            </div>
        `;
        return card;
    }

    // Função para atualizar o perfil do cabeçalho
    // ** CORRIGIDO **
    async function updateHeaderProfile() {
        // Pega o usuário do localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const user = storedUser || {}; // Se não encontrar, usa um objeto vazio

        // Passa o objeto do usuário para a função que exibe o perfil
        displayUserProfile(user, userProfileInfoDesktop);
        displayUserProfile(user, userProfileInfoMobile);
    }

    // Função auxiliar para exibir o perfil na barra lateral
    // ** CORRIGIDO **
    function displayUserProfile(user, element) {
        if (!element) return; // Garante que o elemento existe

        // Define o nome e a URL da foto, usando um fallback se não existirem
        const userName = user.nome || 'Usuário';
        const userPhoto = user.foto_url || 'https://placehold.co/40x40'; 

        // Define o link do perfil. Se o usuário estiver logado, vai para a página de perfil. Caso contrário, para o login.
        const profileLink = user.nome ? 'perfil.html' : 'TelaLogin.html';
        
        element.innerHTML = `
            <a id="profile-link" href="${profileLink}" class="flex items-center space-x-2">
                <img src="${userPhoto}"
                    alt="Foto de perfil do usuário"
                    class="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
                />
                <div class="hidden lg:block">
                    <strong class="block text-gray-900 text-lg">${userName}</strong>
                </div>
            </a>
        `;
    }

    // Funções de manipulação de mensagens
    function showLoading() {
        loadingMessage.classList.remove('hidden');
        noPetsMessage.classList.add('hidden');
        galeriaPetsDiv.classList.remove('grid');
    }

    function hideMessages() {
        loadingMessage.classList.add('hidden');
        noPetsMessage.classList.add('hidden');
    }

    function showNoPetsMessage() {
        loadingMessage.classList.add('hidden');
        noPetsMessage.classList.remove('hidden');
    }

    function showError(message) {
        console.error(message);
        hideMessages();
    }

    // --- FILTROS E PESQUISA ---
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSpecies = speciesFilter.value;
        const selectedSize = sizeFilter.value;

        filteredPets = allPets.filter(pet => {
            const matchesSearch = pet.nome.toLowerCase().includes(searchTerm) || pet.raca.toLowerCase().includes(searchTerm);
            const matchesSpecies = selectedSpecies === '' || pet.especie === selectedSpecies;
            const matchesSize = selectedSize === '' || pet.porte === selectedSize;
            return matchesSearch && matchesSpecies && matchesSize;
        });

        currentPage = 1;
        displayPets();
        updatePaginationControls();
    }

    // --- PAGINAÇÃO ---
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

        if (totalPages <= 1) {
            paginationControls.classList.add('hidden');
            return;
        }

        paginationControls.classList.remove('hidden');
        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.href = '#';
            pageButton.textContent = i;
            pageButton.className = `px-3 py-1 rounded-lg text-sm font-medium ${
                i === currentPage ? 'bg-purple-800 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                displayPets();
                updatePaginationControls();
            });
            pageNumbersContainer.appendChild(pageButton);
        }

        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.toggle('opacity-50 cursor-not-allowed', prevBtn.disabled);
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.classList.toggle('opacity-50 cursor-not-allowed', nextBtn.disabled);
    }

    function handlePaginationClick(event) {
        event.preventDefault();
        if (event.target.id === 'previous-page-btn' && currentPage > 1) {
            currentPage--;
            displayPets();
            updatePaginationControls();
        } else if (event.target.id === 'next-page-btn' && currentPage < Math.ceil(filteredPets.length / itemsPerPage)) {
            currentPage++;
            displayPets();
            updatePaginationControls();
        }
    }
    
    // --- FUNÇÕES DE INICIALIZAÇÃO ---
    function setupEventListeners() {
        searchInput.addEventListener('input', applyFilters);
        speciesFilter.addEventListener('change', applyFilters);
        sizeFilter.addEventListener('change', applyFilters);
        prevBtn.addEventListener('click', handlePaginationClick);
        nextBtn.addEventListener('click', handlePaginationClick);

        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
    }

    function init() {
        setupEventListeners();
        fetchPets();
        updateHeaderProfile();
    }
    
    init();

});