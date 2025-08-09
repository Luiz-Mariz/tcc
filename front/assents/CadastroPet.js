const sidebar = document.getElementById('sidebar');
const sidebarOpenButton = document.getElementById('sidebar-open-button');
const sidebarCloseButton = document.getElementById('sidebar-close-button');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const fileUploadInput = document.getElementById('file-upload');
const filePreviewContainer = document.getElementById('file-preview');

// Elementos de perfil
const userProfileInfo = document.getElementById('user-profile-info');

// ** Importante: Configure a URL base da sua API aqui! **
const API_BASE_URL = 'http://localhost:8080/api';

// --- FUNÇÕES DE CONTROLE DA SIDEBAR ---
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

// Event Listeners para a Sidebar
sidebarOpenButton.addEventListener('click', openSidebar);
sidebarCloseButton.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Garante que a sidebar esteja visível em desktop ao carregar a página
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

// --- FUNÇÕES PARA O PERFIL DO USUÁRIO ---
/**
 * Função para buscar o perfil do usuário do localStorage e atualizar o cabeçalho.
 */
function updateHeaderProfile() {
    // Pega o usuário do localStorage.
    // É importante garantir que o usuário seja salvo no localStorage ao fazer login.
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const user = storedUser || {}; // Se não encontrar, usa um objeto vazio para evitar erros

    // Chama a função que exibe o perfil.
    displayUserProfile(user);
}

/**
 * Função auxiliar para exibir o perfil no elemento especificado.
 * @param {object} user - O objeto do usuário.
 */
function displayUserProfile(user) {
    if (!userProfileInfo) return; // Garante que o elemento do perfil existe

    // Define o nome e a URL da foto, usando um fallback se não existirem
    const userName = user.nome || 'Usuário';
    // Se a foto_url estiver vazia ou nula, usa uma imagem de placeholder
    const userPhoto = user.foto_url || 'https://placehold.co/40x40';

    // Define o link do perfil. Se o usuário estiver logado, vai para a página de perfil.
    // Caso contrário, vai para a página de login.
    const profileLink = user.nome ? '/front/paginas/perfil.html' : '/front/paginas/TelaLogin.html';
    
    userProfileInfo.innerHTML = `
        <a id="profile-link" href="${profileLink}" class="flex items-center space-x-2">
            <img src="${userPhoto}"
                alt="Foto de perfil do usuário"
                class="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
            />
            <div>
                <strong class="block text-gray-900 text-lg">${userName}</strong>
            </div>
        </a>
    `;
}

// --- FUNÇÕES PARA PREENCHIMENTO DE DADOS DO FORMULÁRIO ---
/**
 * Busca as espécies de animais na API e preenche o campo select.
 */
async function fetchEspecies() {
    const selectEspecie = document.getElementById('especie');
    
    selectEspecie.innerHTML = '<option value="">Selecione a Espécie</option>';

    try {
        const response = await fetch(`${API_BASE_URL}/tipoAnimal`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar espécies: ${response.status} ${response.statusText}`);
        }
        
        const especies = await response.json();
        
        especies.forEach(especie => {
            const option = document.createElement('option');
            option.value = especie.id;
            option.textContent = especie.especie;
            selectEspecie.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar as espécies:", error);
        const errorOption = document.createElement('option');
        errorOption.textContent = 'Erro ao carregar';
        selectEspecie.appendChild(errorOption);
    }
}

// Image Preview Functionality
function handleFiles(files) {
    filePreviewContainer.innerHTML = '';
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
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
                removeBtn.className = 'absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none opacity-80 hover:opacity-100 transition';
                removeBtn.innerHTML = '<i class="las la-times"></i>';
                removeBtn.onclick = (event) => {
                    event.stopPropagation();
                    imgWrapper.remove();
                };

                imgWrapper.appendChild(img);
                imgWrapper.appendChild(removeBtn);
                filePreviewContainer.appendChild(imgWrapper);
            };
            reader.readAsDataURL(file);
        }
    });
}

// --- FUNÇÕES PARA O CADASTRO DO ANIMAL ---
function setupFormSubmission() {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Cadastrando...';

        try {
            const animalData = coletarDadosDoFormulario();
            await cadastrarAnimal(animalData);
            alert('Pet cadastrado com sucesso! 🎉');
            form.reset();
            filePreviewContainer.innerHTML = '';
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert(`Erro ao cadastrar pet: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="las la-paw mr-2"></i> Cadastrar Pet';
        }
    });
}

function coletarDadosDoFormulario() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.ong || !storedUser.ong.id) {
        throw new Error("Não foi possível encontrar o ID da ONG no localStorage.");
    }
    const idOng = storedUser.ong.id; // ou storedUser.id_ong

    const form = document.querySelector('form');
    const formData = new FormData(form);

    const especieValue = formData.get('especie');
    const id_tipo_animal = parseInt(especieValue);

    if (isNaN(id_tipo_animal)) {
        throw new Error("Por favor, selecione uma espécie válida para o animal.");
    }

    const porteValue = formData.get('porte');
    if (!porteValue) {
        throw new Error("O porte do animal é obrigatório.");
    }
    const sexoValue = formData.get('sexo');
    if (!sexoValue) {
        throw new Error("O sexo do animal é obrigatório.");
    }

    const animal = {
        nome: formData.get('nome') || null,
        idade: parseInt(formData.get('idade')) || null,
        porte: porteValue.toUpperCase(),
        sexo: sexoValue.toUpperCase(),
        descricao: formData.get('descricao') || null,
        foto_url: formData.get('foto_url') || null,
        status: 'DISPONIVEL',
        tipoAniaml: {
            id: id_tipo_animal
        },
        ong: {
            id: idOng
        }
    };

    return animal;
}


// Supondo que o form tem id="form-pet"
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Pegando valores simples
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value; // vai ser string tipo 'filhote'
  const porte = document.getElementById('porte').value;
  const sexo = document.getElementById('sexo').value;
  const descricao = document.getElementById('descricao').value;

  // Pegando a foto (só a primeira, caso tenha múltiplas)
  const inputFoto = document.getElementById('file-upload');
  const fotoFile = inputFoto.files[0]; // pode ser undefined se não selecionar

  // Montar o objeto animal conforme esperado pelo backend
  const animal = {
    nome: nome,
    idade: idade || null,  // cuidado: se backend quer número, pode precisar converter
    porte: porte.toUpperCase(), // se o backend espera em maiúsculas
    sexo: sexo.toUpperCase(),   // idem
    descricao: descricao,
    status: "DISPONIVEL",
    tipoAniaml: { id: 1 },  // ajustar conforme sua regra
    ong: { id: 2 }          // ajustar conforme contexto real
  };

  // Montar FormData
  const formData = new FormData();
  formData.append("animal", new Blob([JSON.stringify(animal)], { type: "application/json" }));
  if (fotoFile) {
    formData.append("foto", fotoFile);
  }

  try {
    const response = await fetch("http://localhost:8080/api/animal", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const result = await response.json();
    console.log("Animal cadastrado:", result);
  } catch (err) {
    console.error("Erro no cadastro:", err);
  }
});




// --- FUNÇÃO DE INICIALIZAÇÃO GERAL ---
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderProfile(); 
    fetchEspecies();
    setupFormSubmission();
});