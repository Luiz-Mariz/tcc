// --- Configurações da API e Constantes ---
const API_BASE_URL = 'http://localhost:8080';
const PETS_API_URL = `${API_BASE_URL}/api/animal`;
const USER_PROFILE_API_URL = `${API_BASE_URL}/api/usuarios`;
const AUTH_TOKEN_KEY = 'authToken';

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

    // Novos elementos do menu de perfil
    const profileMenuButtonDesktop = document.getElementById('profile-menu-button-desktop');
    const profileMenuDesktop = document.getElementById('profile-menu-desktop');
    const profileMenuButtonMobile = document.getElementById('profile-menu-button-mobile');
    const profileMenuMobile = document.getElementById('profile-menu-mobile');
    const mobileMenu = document.getElementById('mobile-menu');

// --- Funções da Lógica Principal ---

// Função de Perfil do Usuário
async function fetchUserData() {
    try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        // Verifica se o token existe e se não é o valor padrão
        if (!token || token === 'seu_token_de_autenticacao_aqui') {
            return null;
        }
        const response = await fetch(USER_PROFILE_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Sessão expirada, remove o token e redireciona
                Swal.fire({
                    title: 'Sessão expirada!',
                    text: 'Por favor, faça login novamente.',
                    icon: 'warning',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    window.location.href = '../TelaLogin.html';
                });
            }
            return null;
        }
        const userData = await response.json();
        return {
            name: userData.nome || userData.name,
            avatar: userData.foto_perfil || userData.profile_url || 'https://placehold.co/40x40'
        };
    } catch (error) {
        console.error('Erro na requisição da API de perfil:', error);
        return null;
    }
}

// **FUNÇÃO updateHeaderProfile() MELHORADA**
async function updateHeaderProfile() {
    const userData = await fetchUserData();
    
    const userProfileDesktop = document.getElementById('user-profile-desktop');
    const loginButtonDesktop = document.getElementById('login-button-desktop');
    const userAvatarDesktop = document.getElementById('user-avatar-desktop');

    const userProfileMobile = document.getElementById('user-profile-mobile');
    const loginButtonMobile = document.getElementById('login-button-mobile');
    const userAvatarMobile = document.getElementById('user-avatar-mobile');
    const userNameMobile = document.getElementById('user-name-mobile');

    if (userData && userData.name && userData.avatar) {
        // Usuário logado: mostrar perfil e esconder botão de login
        if (userProfileDesktop) userProfileDesktop.classList.remove('hidden');
        if (loginButtonDesktop) loginButtonDesktop.classList.add('hidden');
        if (userAvatarDesktop) userAvatarDesktop.src = userData.avatar;

        if (userProfileMobile) userProfileMobile.classList.remove('hidden');
        if (loginButtonMobile) loginButtonMobile.classList.add('hidden');
        if (userAvatarMobile) userAvatarMobile.src = userData.avatar;
        if (userNameMobile) userNameMobile.textContent = userData.name;
    } else {
        // Usuário não logado: esconder perfil e mostrar botão de login
        if (userProfileDesktop) userProfileDesktop.classList.add('hidden');
        if (loginButtonDesktop) loginButtonDesktop.classList.remove('hidden');

        if (userProfileMobile) userProfileMobile.classList.add('hidden');
        if (loginButtonMobile) loginButtonMobile.classList.remove('hidden');
    }
}

// Lógica de menu dropdown
function setupProfileMenu() {
    const desktopMenuButton = document.getElementById('profile-menu-button-desktop');
    const desktopMenu = document.getElementById('profile-menu-desktop');
    const mobileMenuButton = document.getElementById('profile-menu-button-mobile');
    const mobileMenu = document.getElementById('profile-menu-mobile');

    if (desktopMenuButton) {
        desktopMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            desktopMenu.classList.toggle('hidden');
        });
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
    }

    window.addEventListener('click', (event) => {
        if (desktopMenu && !desktopMenu.contains(event.target) && desktopMenuButton && !desktopMenuButton.contains(event.target)) {
            desktopMenu.classList.add('hidden');
        }
        if (mobileMenu && !mobileMenu.contains(event.target) && mobileMenuButton && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

function doLogout() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você será desconectado da sua conta.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#8B5CF6',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'Sim, sair!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            Swal.fire(
                'Desconectado!',
                'Você foi desconectado com sucesso.',
                'success'
            ).then(() => {
                window.location.href = '../TelaInicial.html';
            });
        }
    });
}

// Funções da Galeria de Pets, Filtros e Paginação

function createPetCard(pet) {
    const name = pet.nome || 'Nome Desconhecido';
    const species = (pet.tipoAnimal && pet.tipoAnimal.especie) || 'Não informada';
    const size = pet.porte || 'Não informado';
    const sex = pet.sexo
        ? (pet.sexo.toUpperCase() === 'MACHO' ? 'Macho' : (pet.sexo.toUpperCase() === 'FEMEA' ? 'Fêmea' : pet.sexo))
        : 'Sexo não informado';
    const age = pet.idade
        ? `${pet.idade} Ano${(parseInt(pet.idade) > 1) ? 's' : ''}`
        : 'Idade não informada';
    const description = pet.descricao || 'Este pet está em busca de um lar amoroso.';

    const imageUrl = pet.imagem_base64 || 'https://via.placeholder.com/400x300.png?text=Sem+Foto';

    return `
        <article class="bg-white border border-purple-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden">
            <img src="${imageUrl}" alt="Foto de ${name}" class="w-full h-64 object-cover object-center img-zoom-hover">
            <div class="p-6">
                <h3 class="text-2xl font-semibold text-purple-900 mb-1">${name}</h3>
                <p class="text-md text-gray-600 mb-2">${species} • ${size} • ${sex} • ${age}</p>
                <p class="text-gray-700 text-sm line-clamp-3 mb-4">${description}</p>
                <a href="TelaInforPetTutor.html?id=${pet.id}"
                    class="inline-block bg-purple-700 text-white px-5 py-2 rounded-full text-base font-medium hover:bg-purple-800 transition">Ver Detalhes</a>
            </div>
        </article>
    `;
}

function renderGallery() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const petsToRender = filteredPets.slice(startIndex, endIndex);

    galeriaPetsDiv.innerHTML = '';

    if (petsToRender.length === 0) {
        noPetsMessage.classList.remove('hidden');
        paginationControls.classList.add('hidden');
    } else {
        noPetsMessage.classList.add('hidden');
        petsToRender.forEach(pet => {
            galeriaPetsDiv.innerHTML += createPetCard(pet);
        });
        galeriaPetsDiv.classList.add('lg:grid-cols-3');
        paginationControls.classList.remove('hidden');
    }
}

function renderPagination() {
    pageNumbersContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#galeria-pets-section';
        pageLink.classList.add('relative', 'inline-flex', 'items-center', 'px-4', 'py-2', 'text-sm', 'font-medium', 'text-gray-700', 'bg-white', 'border', 'border-gray-300', 'rounded-lg', 'hover:bg-gray-50');
        pageLink.textContent = i;
        
        if (i === currentPage) {
            pageLink.classList.remove('bg-white', 'border-gray-300', 'text-gray-700', 'hover:bg-gray-50');
            pageLink.classList.add('bg-purple-100', 'border-purple-300', 'text-purple-800');
        }

        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderGallery();
            renderPagination();
        });

        pageNumbersContainer.appendChild(pageLink);
    }
    
    prevBtn.classList.toggle('opacity-50', currentPage === 1);
    prevBtn.classList.toggle('pointer-events-none', currentPage === 1);
    nextBtn.classList.toggle('opacity-50', currentPage === totalPages || totalPages === 0);
    nextBtn.classList.toggle('pointer-events-none', currentPage === totalPages || totalPages === 0);

    if (totalPages <= 1) {
        paginationControls.classList.add('hidden');
    }
}

async function fetchPetsData() {
    loadingMessage.classList.remove('hidden');
    noPetsMessage.classList.add('hidden');

    try {
        const response = await fetch(PETS_API_URL);

        if (!response.ok) {
            console.error(`Erro ao buscar pets: ${response.status} ${response.statusText}`);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os pets. Tente novamente mais tarde.',
                icon: 'error',
            });
            return;
        }

        allPets = await response.json();
        console.log('Pets recebidos:', allPets);
        filterAndSearchPets(); 
    } catch (error) {
        console.error('Erro na requisição da API de pets:', error);
        Swal.fire({
            title: 'Erro de conexão!',
            text: 'Não foi possível carregar os dados dos pets. Verifique sua conexão.',
            icon: 'error',
        });
    } finally {
        loadingMessage.classList.add('hidden');
    }
}

// Função para filtrar e pesquisar os pets
function filterAndSearchPets() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSpecies = speciesFilter.value;
    const selectedSize = sizeFilter.value;

    filteredPets = allPets.filter(pet => {
        const petSpecies = (pet.tipoAnimal && pet.tipoAnimal.especie) ? pet.tipoAnimal.especie.toLowerCase() : '';
        const matchesSearch = (pet.nome && pet.nome.toLowerCase().includes(searchTerm)) ||
                             (pet.raca && pet.raca.toLowerCase().includes(searchTerm)) ||
                             (pet.descricao && pet.descricao.toLowerCase().includes(searchTerm)) ||
                             (petSpecies && petSpecies.includes(searchTerm));

        const matchesSpecies = !selectedSpecies || petSpecies === selectedSpecies.toLowerCase();
        const matchesSize = !selectedSize || (pet.porte && pet.porte.toLowerCase()) === selectedSize.toLowerCase();

        return matchesSearch && matchesSpecies && matchesSize;
    });
    
    currentPage = 1;
    renderGallery();
    renderPagination();
}

// --- Event Listeners e Inicialização ---

document.getElementById('mobile-menu-button').onclick = function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
};

const logoutButtonDesktop = document.getElementById('logout-button-desktop');
if (logoutButtonDesktop) {
    logoutButtonDesktop.addEventListener('click', doLogout);
}

const logoutButtonMobile = document.getElementById('logout-button-mobile');
if (logoutButtonMobile) {
    logoutButtonMobile.addEventListener('click', doLogout);
}

searchInput.addEventListener('input', filterAndSearchPets);
speciesFilter.addEventListener('change', filterAndSearchPets);
sizeFilter.addEventListener('change', filterAndSearchPets);

prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        renderGallery();
        renderPagination();
    }
});

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderGallery();
        renderPagination();
    }
});

window.onload = () => {
    updateHeaderProfile();
    fetchPetsData();
    setupProfileMenu();
};
async function updateHeaderProfile() {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const user = storedUser || {};

        displayUserProfile(user, userProfileInfoDesktop, 'desktop');
        displayUserProfile(user, userProfileInfoMobile, 'mobile');
    }

    // Função auxiliar para exibir o perfil
    function displayUserProfile(user, element, type) {
        if (!element) return;

        const userName = user.nome || 'Usuário';
        const userPhoto = user.foto_url || 'https://placehold.co/40x40';

        if (type === 'desktop') {
            const photoEl = element.querySelector('img');
            photoEl.src = userPhoto;
            photoEl.alt = `Foto de perfil de ${userName}`;
        } else if (type === 'mobile') {
            const photoEl = element.querySelector('img');
            const nameEl = element.querySelector('strong');
            photoEl.src = userPhoto;
            photoEl.alt = `Foto de perfil de ${userName}`;
            nameEl.textContent = userName;
        }
    }

    // Função para deslogar
    function handleLogout() {
        localStorage.removeItem('user');
        window.location.href = 'TelaLogin.html'; // Redireciona para a tela de login
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