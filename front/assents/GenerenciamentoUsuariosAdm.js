const API_BASE_URL = 'http://localhost:8080/api/usuarios';
const userListBody = document.getElementById('user-list');
const userSearchInput = document.getElementById('user-search');

async function fetchUsers() {
    userListBody.innerHTML = `
        <tr>
            <td colspan="5" class="py-6 px-6 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin mr-2"></i> Carregando usuários...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários: ' + response.status);
        }
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error(error);
        userListBody.innerHTML = `
            <tr>
                <td colspan="5" class="py-6 px-6 text-center text-red-500">
                    <i class="fas fa-exclamation-triangle mr-2"></i> Erro ao carregar usuários. Tente novamente.
                </td>
            </tr>
        `;
    }
}

function renderUsers(users) {
    if (!users.length) {
        userListBody.innerHTML = `
            <tr>
                <td colspan="5" class="py-6 px-6 text-center text-gray-500">Nenhum usuário encontrado.</td>
            </tr>
        `;
        return;
    }

    userListBody.innerHTML = ''; // limpa tabela

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-50');

        // Status string e classe CSS
        const statusText = user.ativo ? 'Ativo' : 'Inativo';
        const statusClass = user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

        tr.innerHTML = `
            <td class="py-3 px-6">${user.nome || '-'}</td>
            <td class="py-3 px-6">${user.email}</td>
            <td class="py-3 px-6">${user.tipo_usuario || '-'}</td>
            <td class="py-3 px-6">
                <span class="px-2 py-1 font-semibold leading-tight rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center space-x-2">
                    <button class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                        title="Editar Usuário" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                        title="Excluir Usuário" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        userListBody.appendChild(tr);
    });
}

// Filtro de busca
userSearchInput.addEventListener('keyup', () => {
    const searchTerm = userSearchInput.value.toLowerCase();
    const rows = userListBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Placeholders para editar e deletar
function editUser(id) {
    alert('Editar usuário com ID: ' + id);
    // Aqui você pode redirecionar para outra página ou abrir modal etc.
}

function deleteUser(id) {
    if (confirm('Quer excluir o usuário com ID: ' + id + '?')) {
        alert('Usuário excluído! (simulação)');
        // Aqui você pode chamar o endpoint DELETE e depois recarregar a lista
    }
}

// Quando o documento carregar, faz a chamada
document.addEventListener('DOMContentLoaded', fetchUsers);
