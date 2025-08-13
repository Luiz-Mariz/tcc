const sidebar = document.getElementById('sidebar');
const sidebarOpenButton = document.getElementById('sidebar-open-button');
const sidebarCloseButton = document.getElementById('sidebar-close-button');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const userProfileInfo = document.getElementById('user-profile-info');
const profileForm = document.getElementById('profile-form');
const editButton = document.getElementById('edit-button');
const saveButton = document.getElementById('save-button');
const formInputs = profileForm.querySelectorAll('input, select, textarea');

// URL base da sua API
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
function displayUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.ong) {
        userProfileInfo.innerHTML = `
            <div class="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <img src="${user.foto_url}" alt="Foto de Perfil" class="w-10 h-10 rounded-full object-cover border-2 border-purple-400" />
                <div>
                    <strong class="block text-gray-900 text-lg">${user.ong.nome}</strong>
                </div>
            </div>
        `;
    } else {
        userProfileInfo.innerHTML = `
            <div class="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div>
                    <strong class="block text-gray-900 text-lg">Carregando...</strong>
                </div>
            </div>
        `;
    }
}

// --- LÓGICA DA TELA MEU PERFIL ---
// Função para buscar os dados da ONG e preencher o formulário
function fetchAndFillONGData() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.ong && user.ong.endereco) {
        // Preenche os campos do formulário com os dados do localStorage
        document.getElementById('nome').value = user.ong.nome || '';
        document.getElementById('cnpj').value = user.ong.cnpj || '';
        document.getElementById('responsavel_nome').value = user.ong.responsavel_nome || '';
        document.getElementById('telefone').value = user.ong.telefone || '';
        document.getElementById('instagram').value = user.ong.instagram || '';
        document.getElementById('email').value = user.email || ''; 

        // Preenche os campos de endereço
        document.getElementById('cep').value = user.ong.endereco.cep || '';
        document.getElementById('logradouro').value = user.ong.endereco.logradouro || '';
        document.getElementById('numero').value = user.ong.endereco.numero || '';
        document.getElementById('complemento').value = user.ong.endereco.complemento || '';
        document.getElementById('bairro').value = user.ong.endereco.bairro || '';
        document.getElementById('cidade').value = user.ong.endereco.cidade || '';
        document.getElementById('estado').value = user.ong.endereco.estado || '';
    } else {
        console.error('Dados da ONG ou Endereço não encontrados no localStorage.');
    }
}

// Habilita a edição dos campos
function enableEditing() {
    formInputs.forEach(input => {
        // CNPJ e e-mail não devem ser editáveis
        if (input.id !== 'cnpj' && input.id !== 'email') { 
            input.disabled = false;
            input.classList.remove('bg-gray-100');
        }
    });
    editButton.classList.add('hidden');
    saveButton.classList.remove('hidden');
}

// Lida com o envio do formulário de atualização
profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.ong || !user.ong.id) {
        console.error('ID da ONG não encontrado no localStorage.');
        return;
    }

    // Coleta os dados atualizados do formulário
    const updatedOngData = {
        nome: document.getElementById('nome').value,
        responsavel_nome: document.getElementById('responsavel_nome').value,
        telefone: document.getElementById('telefone').value,
        instagram: document.getElementById('instagram').value,
        // Mantém CNPJ e outros dados do objeto original
        cnpj: user.ong.cnpj, 
        // id_usuario e id_endereco não são alterados no formulário
        id_usuario: user.id,
        id_endereco: user.ong.endereco.id
    };

    const updatedEnderecoData = {
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
    };

    try {
        // Requisição para atualizar o endereço
        const enderecoResponse = await fetch(`${API_BASE_URL}/endereco/${user.ong.endereco.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEnderecoData)
        });

        if (!enderecoResponse.ok) {
            throw new Error('Falha ao atualizar o endereço.');
        }

        // Requisição para atualizar a ONG
        const ongResponse = await fetch(`${API_BASE_URL}/ong/${user.ong.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOngData)
        });

        if (ongResponse.ok) {
            // Atualiza o objeto do usuário no localStorage com os novos dados
            const updatedUser = {
                ...user,
                ong: {
                    ...user.ong,
                    ...updatedOngData,
                    endereco: updatedEnderecoData
                }
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            alert('Perfil atualizado com sucesso!');
            disableEditing();
            displayUserProfile(); // Atualiza o nome no menu lateral
        } else {
            alert('Erro ao atualizar o perfil. Tente novamente.');
            disableEditing();
        }
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        alert('Erro ao conectar com o servidor.');
        disableEditing();
    }
});

// Desabilita a edição dos campos e exibe o botão de editar novamente
function disableEditing() {
    formInputs.forEach(input => {
        input.disabled = true;
        if (input.id !== 'cnpj' && input.id !== 'email') {
            input.classList.add('bg-gray-100');
        }
    });
    editButton.classList.remove('hidden');
    saveButton.classList.add('hidden');
}

// Event Listeners
editButton.addEventListener('click', enableEditing);

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    displayUserProfile();
    fetchAndFillONGData();
    disableEditing();
});