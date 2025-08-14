const sidebar = document.getElementById('sidebar');
const sidebarOpenButton = document.getElementById('sidebar-open-button');
const sidebarCloseButton = document.getElementById('sidebar-close-button');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const fileUploadInput = document.getElementById('file-upload');
const filePreviewContainer = document.getElementById('file-preview');

const userProfileInfo = document.getElementById('user-profile-info');
const API_BASE_URL = 'http://localhost:8080/api';

// --- SIDEBAR ---
function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
sidebarOpenButton.addEventListener('click', openSidebar);
sidebarCloseButton.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
if (window.innerWidth >= 768) {
    sidebar.classList.remove('-translate-x-full');
}
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        if (!sidebar.classList.contains('translate-x-0')) {
            sidebar.classList.add('-translate-x-full');
        }
    }
});

// --- PERFIL DO USUÁRIO ---
function updateHeaderProfile() {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    displayUserProfile(storedUser);
}
function displayUserProfile(user) {
    if (!userProfileInfo) return;
    const userName = user.ong.nome || 'Usuário';
    const userPhoto = user.foto_url || 'https://placehold.co/40x40';
    const profileLink = user.nome ? '/front/paginas/perfil.html' : '/front/paginas/TelaLogin.html';

    userProfileInfo.innerHTML = `
        <a id="profile-link" href="${profileLink}" class="flex items-center space-x-2">
            <img src="${userPhoto}" alt="Foto de perfil do usuário" class="w-10 h-10 rounded-full object-cover border-2 border-purple-300" />
            <div>
                <strong class="block text-gray-900 text-lg">${userName}</strong>
            </div>
        </a>
    `;
}

// --- PREENCHE ESPÉCIES ---
async function fetchEspecies() {
    const selectEspecie = document.getElementById('especie');
    selectEspecie.innerHTML = '<option value="">Selecione a Espécie</option>';
    try {
        const response = await fetch(`${API_BASE_URL}/tipoAnimal`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const especies = await response.json();
        especies.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = e.especie;
            selectEspecie.appendChild(option);
        });
    } catch (err) {
        console.error("Erro ao carregar espécies:", err);
        const option = document.createElement('option');
        option.textContent = 'Erro ao carregar';
        selectEspecie.appendChild(option);
    }
}

// --- PREVIEW DE IMAGEM ---
function handleFiles(files) {
    filePreviewContainer.innerHTML = ''; // limpa preview

    if (files.length === 0) return;

    const file = files[0]; // pega só a primeira imagem

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Pré-visualização da imagem do pet';
            img.className = 'w-full h-full object-cover';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 transition';
            removeBtn.innerHTML = '<i class="las la-times"></i>';
            removeBtn.onclick = (ev) => {
                ev.stopPropagation();
                imgWrapper.remove();
                fileUploadInput.value = ''; // limpa input
            };

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
            filePreviewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    }
}
fileUploadInput.addEventListener('change', e => handleFiles(e.target.files));

// --- FUNÇÃO PARA CADASTRAR ANIMAL ---
async function cadastrarAnimal(animalData) {
    const inputFoto = document.getElementById('file-upload');
    const fotoFile = inputFoto.files[0];

    const formData = new FormData();
    formData.append("animal", new Blob([JSON.stringify(animalData)], { type: "application/json" }));
    if (fotoFile) formData.append("foto", fotoFile);

    const response = await fetch(`${API_BASE_URL}/animal`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar animal');
    }

    return await response.json();
}

// --- FUNÇÃO QUE COLETA OS DADOS DO FORM ---
function coletarDadosDoFormulario() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.ong || !storedUser.ong.id) {
        throw new Error("ID da ONG não encontrado no localStorage.");
    }
    const idOng = storedUser.ong.id;

    const form = document.querySelector('form');
    const formData = new FormData(form);

    const id_tipo_animal = parseInt(formData.get('especie'));
    if (isNaN(id_tipo_animal)) {
        throw new Error("Selecione uma espécie válida.");
    }

    const porteValue = formData.get('porte');
    if (!porteValue) throw new Error("O porte do animal é obrigatório.");
    const sexoValue = formData.get('sexo');
    if (!sexoValue) throw new Error("O sexo do animal é obrigatório.");

    return {
        nome: formData.get('nome') || null,
        idade: parseInt(formData.get('idade')) || null,
        porte: porteValue.toUpperCase(),
        sexo: sexoValue.toUpperCase(),
        descricao: formData.get('descricao') || null,
        foto_url: null, // você pode tratar isso no backend (pois a foto é enviada separada)
        status: 'DISPONIVEL',
        tipoAniaml: { id: id_tipo_animal },
        ong: { id: idOng }
    };
}

// --- SUBMIT DO FORMULÁRIO ---
document.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Cadastrando...';

    try {
        const animalData = coletarDadosDoFormulario();
        const resultado = await cadastrarAnimal(animalData);
        alert('Pet cadastrado com sucesso! 🎉');
        console.log('Animal cadastrado:', resultado);
        event.target.reset();
        filePreviewContainer.innerHTML = '';
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert(`Erro ao cadastrar pet: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="las la-paw mr-2"></i> Cadastrar Pet';
    }
});

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderProfile();
    fetchEspecies();
});
