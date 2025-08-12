// --- Configurações da API ---
const API_BASE_URL = 'http://localhost:8080';
const PETS_API_URL = `${API_BASE_URL}/api/animal`;
const ADOPT_API_URL = `${API_BASE_URL}/api/adocao`;

// --- Funções de interação do usuário (opcional, apenas para o menu) ---
document.getElementById('mobile-menu-button').onclick = function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
};

// --- Funções para carregar e exibir os dados do pet ---
document.addEventListener('DOMContentLoaded', () => {
    loadPetDetails();
});

async function loadPetDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    if (!petId) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('not-found').classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch(`${PETS_API_URL}/${petId}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar pet: ${response.status} ${response.statusText}`);
        }
        const pet = await response.json();

        renderPetDetails(pet);
    } catch (error) {
        console.error('Erro ao carregar detalhes do pet:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('not-found').classList.remove('hidden');
        Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível carregar os detalhes do pet. Verifique sua conexão ou tente novamente.',
            icon: 'error',
            confirmButtonColor: '#8B5CF6'
        });
    }
}

function renderPetDetails(pet) {
    document.title = `Detalhes do Pet - ${pet.nome} - AdoteBH`;
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('pet-details-section').classList.remove('hidden');

    // Carregar imagem usando o endpoint correto que retorna a foto como blob
    const imageUrl = `${PETS_API_URL}/${pet.id}/foto`;
    document.getElementById('pet-image').src = imageUrl;
    document.getElementById('pet-image').alt = `Foto do pet ${pet.nome}`;

    // O resto do código permanece igual
    document.getElementById('pet-name-and-breed').innerHTML = `${pet.nome} <span class="text-gray-500 text-lg font-normal">- ${pet.raca || 'Raça não informada'}</span>`;
    document.getElementById('pet-description').textContent = pet.descricao || 'Este pet está em busca de um lar amoroso.';
    document.getElementById('pet-ideal-home').textContent = pet.lar_ideal || 'O pet busca um lar amoroso e acolhedor.';

    // Preenche os badges de informações gerais
    const infoBadgesContainer = document.getElementById('pet-info-badges');
    infoBadgesContainer.innerHTML = `
        <span class="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
            <i class="fas fa-dog mr-2"></i> ${pet.especie || 'Não informada'}
        </span>
        <span class="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
            <i class="fas fa-calendar-alt mr-2"></i> ${pet.idade ? `${pet.idade} Ano${pet.idade > 1 ? 's' : ''}` : 'Idade não informada'}
        </span>
        <span class="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
            <i class="fas fa-ruler-horizontal mr-2"></i> ${pet.porte || 'Não informado'}
        </span>
        <span class="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
            <i class="fas fa-venus-mars mr-2"></i> ${pet.sexo || 'Não informado'}
        </span>
    `;

    // Preenche os badges de saúde
    const healthBadgesContainer = document.getElementById('pet-health-badges');
    healthBadgesContainer.innerHTML = '';
    if (pet.vacinado) {
        healthBadgesContainer.innerHTML += `
            <span class="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
                <i class="fas fa-syringe mr-2"></i> Vacinado
            </span>
        `;
    }
    if (pet.castrado) {
        healthBadgesContainer.innerHTML += `
            <span class="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
                <i class="fas fa-cut mr-2"></i> Castrado
            </span>
        `;
    }
    if (pet.vermifugado) {
        healthBadgesContainer.innerHTML += `
            <span class="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center">
                <i class="fas fa-capsules mr-2"></i> Vermifugado
            </span>
        `;
    }

    // Preenche informações de saúde detalhadas (se existirem)
    const healthInfoList = document.getElementById('pet-health-info');
    healthInfoList.innerHTML = `
        <li class="flex items-center">
            <i class="fas fa-calendar-check text-purple-500 mr-3 text-lg"></i> <strong>Último Check-up:</strong> ${pet.saude?.checkup || 'Não informado'}
        </li>
        <li class="flex items-center">
            <i class="fas fa-lightbulb text-yellow-500 mr-3 text-lg"></i> <strong>Observações:</strong> ${pet.saude?.observacoes || 'Nenhuma condição de saúde especial conhecida.'}
        </li>
    `;

    // Renderiza informações da ONG (usa pet.ong se existir, senão tenta buscar por id_ong)
    renderOngFromPet(pet);

    // --- NOVO: Botão Adotar ---
    const adotarBtnContainer = document.getElementById('adotar-button-container');
    if (adotarBtnContainer) {
        adotarBtnContainer.innerHTML = `<button id="btn-adotar" class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">Adotar</button>`;

        document.getElementById('btn-adotar').onclick = async () => {
            const usuarioLogado = localStorage.getItem('usuarioLogado'); // Ajuste o nome da chave conforme seu localStorage

            if (!usuarioLogado) {
                // Usuário não está logado, redireciona para login
                window.location.href = 'TelaLogin.html';
                return;
            }

            try {
                // Cria o objeto adoção para enviar
                const adocao = {
                    status: "aguardando contato",
                    pessoa: { id: Number(usuarioLogado) },
                    animal: { id: pet.id }
                    // data_peticao é preenchida automaticamente pelo backend
                };

                const response = await fetch(ADOPT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(adocao)
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Pedido de adoção registrado com sucesso.',
                        confirmButtonColor: '#8B5CF6'
                    });
                } else {
                    throw new Error('Erro ao registrar adoção');
                }
            } catch (error) {
                console.error('Erro ao registrar adoção:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Não foi possível registrar o pedido de adoção. Tente novamente mais tarde.',
                    confirmButtonColor: '#8B5CF6'
                });
            }
        };
    }
}

async function renderOngFromPet(pet) {
    const ongInfoContainer = document.getElementById('ong-info');

    // Função auxiliar para montar o HTML da ONG
    function montarHtmlOng(ong, endereco) {
        // endereco pode ser um objeto com campos (cep, logradouro, numero, bairro, cidade, estado, complemento)
        let enderecoTexto = '';
        if (endereco) {
            enderecoTexto = `${endereco.logradouro || ''}${endereco.numero ? ', ' + endereco.numero : ''}${endereco.bairro ? ' - ' + endereco.bairro : ''}${endereco.cidade ? ' / ' + endereco.cidade : ''}${endereco.estado ? ' - ' + endereco.estado : ''}${endereco.complemento ? ' (' + endereco.complemento + ')' : ''}`;
        } else if (ong.endereco) {
            // caso o backend retorne um objeto endereco dentro da ONG
            const e = ong.endereco;
            enderecoTexto = `${e?.logradouro || ''}${e?.numero ? ', ' + e.numero : ''}${e?.bairro ? ' - ' + e.bairro : ''}${e?.cidade ? ' / ' + e.cidade : ''}${e?.estado ? ' - ' + e.estado : ''}`;
        }

        return `
            <h3 class="text-2xl font-bold text-gray-700 mb-4 flex items-center">
                <i class="fas fa-building text-blue-500 mr-2"></i> ONG Responsável
            </h3>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p class="mb-2"><strong>Nome:</strong> ${ong.nome || 'Não informado'}</p>
                ${ong.responsavel_nome ? `<p class="mb-2"><strong>Responsável:</strong> ${ong.responsavel_nome}</p>` : ''}
                ${ong.telefone ? `<p class="mb-2"><strong>Telefone:</strong> ${ong.telefone}</p>` : ''}
                ${ong.email ? `<p class="mb-2"><strong>Email:</strong> ${ong.email}</p>` : ''}
                ${ong.instagram ? `<p class="mb-2"><strong>Instagram:</strong> <a href="https://instagram.com/${ong.instagram.replace('@','')}" target="_blank" class="text-purple-600 hover:underline">${ong.instagram}</a></p>` : ''}
                ${enderecoTexto ? `<p class="mb-0"><strong>Endereço:</strong> ${enderecoTexto}</p>` : ''}
            </div>
        `;
    }

    // Se já veio a ONG dentro do objeto pet
    if (pet.ong) {
        // pode vir ong completo ou apenas id; se for objeto, renderiza direto
        if (typeof pet.ong === 'object') {
            // se a ONG trouxer um campo endereco (objeto), passa para montarHtmlOng
            const endereco = pet.ong.endereco || null;
            ongInfoContainer.innerHTML = montarHtmlOng(pet.ong, endereco);
            return;
        }
    }

    // Tenta encontrar id da ong em propriedades comuns
    const possibleOngId = pet.id_ong || pet.idOng || pet.ongId || (pet.ong && typeof pet.ong === 'number' ? pet.ong : null);

    if (!possibleOngId) {
        // Se não encontrou nada, apenas esconde o bloco ou mostra mensagem
        ongInfoContainer.innerHTML = `<div class="text-sm text-gray-600">Informações da ONG não disponíveis.</div>`;
        return;
    }

    // Busca a ONG pelo endpoint /api/ong/{id}
    try {
        const resp = await fetch(`${API_BASE_URL}/api/ong/${possibleOngId}`);
        if (!resp.ok) {
            ongInfoContainer.innerHTML = `<div class="text-sm text-gray-600">Informações da ONG não encontradas.</div>`;
            return;
        }
        const ong = await resp.json();

        // Caso a ONG possua referência a endereço por id (id_endereco), podemos tentar buscar /api/endereco/{id} (se seu backend tiver esse endpoint)
        let enderecoObj = null;
        if (ong.id_endereco) {
            try {
                const r2 = await fetch(`${API_BASE_URL}/api/endereco/${ong.id_endereco}`);
                if (r2.ok) {
                    enderecoObj = await r2.json();
                }
            } catch (e) {
                // falha ao buscar endereco -> ignora
            }
        }

        ongInfoContainer.innerHTML = montarHtmlOng(ong, enderecoObj);
    } catch (error) {
        console.error('Erro ao buscar ONG:', error);
        ongInfoContainer.innerHTML = `<div class="text-sm text-gray-600">Informações da ONG não disponíveis.</div>`;
    }
}
