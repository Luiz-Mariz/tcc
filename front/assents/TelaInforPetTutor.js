// --- Configurações da API ---
const API_BASE_URL = 'http://localhost:8080';
const PETS_API_URL = `${API_BASE_URL}/api/animal`;
const ADOPT_API_URL = `${API_BASE_URL}/api/adocao`;

// --- Menu mobile ---
document.getElementById('mobile-menu-button').onclick = function () {
    document.getElementById('mobile-menu').classList.toggle('hidden');
};

// --- Carregar dados do pet ---
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
        if (!response.ok) throw new Error(`Erro ao buscar pet: ${response.status}`);
        const pet = await response.json();
        console.log("Pet carregado:", pet);
        renderPetDetails(pet);
    } catch (error) {
        console.error('Erro ao carregar detalhes do pet:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('not-found').classList.remove('hidden');
        Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível carregar os detalhes do pet.',
            icon: 'error',
            confirmButtonColor: '#8B5CF6'
        });
    }
}

function renderPetDetails(pet) {
    document.title = `Detalhes do Pet - ${pet.nome} - AdoteBH`;
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('pet-details-section').classList.remove('hidden');

    const imageUrl = `${PETS_API_URL}/${pet.id}/foto`;
    document.getElementById('pet-image').src = imageUrl;
    document.getElementById('pet-image').alt = `Foto do pet ${pet.nome}`;

    document.getElementById('pet-name-and-breed').innerHTML =
        `${pet.nome} <span class="text-gray-500 text-lg font-normal">- ${pet.raca || 'Raça não informada'}</span>`;
    document.getElementById('pet-description').textContent = pet.descricao || 'Este pet está em busca de um lar amoroso.';
    document.getElementById('pet-ideal-home').textContent = pet.lar_ideal || 'O pet busca um lar amoroso e acolhedor.';

    document.getElementById('pet-info-badges').innerHTML = `
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

    const healthBadgesContainer = document.getElementById('pet-health-badges');
    healthBadgesContainer.innerHTML = '';
    if (pet.vacinado) healthBadgesContainer.innerHTML += `<span class="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center"><i class="fas fa-syringe mr-2"></i> Vacinado</span>`;
    if (pet.castrado) healthBadgesContainer.innerHTML += `<span class="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center"><i class="fas fa-cut mr-2"></i> Castrado</span>`;
    if (pet.vermifugado) healthBadgesContainer.innerHTML += `<span class="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full flex items-center"><i class="fas fa-capsules mr-2"></i> Vermifugado</span>`;

    document.getElementById('pet-health-info').innerHTML = `
        <li class="flex items-center"><i class="fas fa-calendar-check text-purple-500 mr-3 text-lg"></i> <strong>Último Check-up:</strong> ${pet.saude?.checkup || 'Não informado'}</li>
        <li class="flex items-center"><i class="fas fa-lightbulb text-yellow-500 mr-3 text-lg"></i> <strong>Observações:</strong> ${pet.saude?.observacoes || 'Nenhuma condição de saúde especial conhecida.'}</li>
    `;

    renderOngFromPet(pet);

    const adotarBtnContainer = document.getElementById('adotar-button-container');
    adotarBtnContainer.innerHTML = `<button id="btn-adotar" class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">Adotar</button>`;
    document.getElementById('btn-adotar').onclick = () => abrirTermoAdocao(pet);
}

function abrirTermoAdocao(pet) {
    const usuarioLogado = JSON.parse(localStorage.getItem('user'));

    if (!usuarioLogado) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Você precisa estar logado para adotar um pet.',
            confirmButtonColor: '#8B5CF6'
        });
        return;
    }

    Swal.fire({
        title: 'Termo de Adoção',
        html: `
            <div style="text-align:left; max-height:200px; overflow-y:auto; margin-bottom:15px;">
                <p>Ao prosseguir, você confirma que se compromete a cuidar do animal adotado,
                garantindo bem-estar, alimentação adequada, higiene e assistência veterinária.</p>
                <p>O AdoteBH atua apenas como intermediador da adoção, não sendo responsável
                por questões posteriores ao processo.</p>
            </div>
            <label style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" id="aceite-termos" />
                <span>Li e aceito os termos de adoção.</span>
            </label>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar Adoção',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8B5CF6',
        preConfirm: () => {
            if (!document.getElementById('aceite-termos').checked) {
                Swal.showValidationMessage('Você precisa aceitar os termos para prosseguir.');
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            registrarAdocao(pet, usuarioLogado);
        }
    });
}

function registrarAdocao(pet) {
    const usuarioLogado = JSON.parse(localStorage.getItem('user'));

    if (!pet || !usuarioLogado?.tutor) {
        console.error("Pet ou tutor indefinido!", { pet, usuarioLogado });
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível registrar a adoção. Pet ou tutor não foram carregados.'
        });
        return;
    }

    const hoje = new Date().toISOString().split('T')[0];

    const novaAdocao = {
        status: "AGUARDANDO_CONTATO",
        tutor: { id: usuarioLogado.tutor.id }, // pega do localStorage
        ong: { id: pet.ong?.id || pet.id_ong },
        animal: { id: pet.id },
         dataPeticao: hoje
    };

    console.log("Enviando adoção:", novaAdocao);

    fetch(ADOPT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaAdocao)
    })
    .then(async res => {
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(JSON.stringify(errorData));
        }
        return res.json();
    })
    .then(data => {
        console.log("Adoção registrada:", data);
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Adoção registrada com sucesso.'
        });
    })
    .catch(err => {
        console.error("Erro ao registrar adoção:", err);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível registrar a adoção. Confira os dados e tente novamente.'
        });
    });
}


// --- Render ONG ---
async function renderOngFromPet(pet) {
    const ongInfoContainer = document.getElementById('ong-info');

    function montarHtmlOng(ong, endereco) {
        let enderecoTexto = '';
        if (endereco) {
            enderecoTexto = `${endereco.logradouro || ''}${endereco.numero ? ', ' + endereco.numero : ''}${endereco.bairro ? ' - ' + endereco.bairro : ''}${endereco.cidade ? ' / ' + endereco.cidade : ''}${endereco.estado ? ' - ' + endereco.estado : ''}${endereco.complemento ? ' (' + endereco.complemento + ')' : ''}`;
        } else if (ong.endereco) {
            const e = ong.endereco;
            enderecoTexto = `${e?.logradouro || ''}${e?.numero ? ', ' + e.numero : ''}${e?.bairro ? ' - ' + e.bairro : ''}${e?.cidade ? ' / ' + e.cidade : ''}${e?.estado ? ' - ' + e.estado : ''}`;
        }

        return `
            <h3 class="text-2xl font-bold text-gray-700 mb-4 flex items-center">
                <i class="fas fa-building text-blue-500 mr-2"></i> ONG Responsável
            </h3>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p class="mb-2"><strong>Nome:</strong> ${ong.nome}</p>
                <p><strong>Endereço:</strong> ${enderecoTexto}</p>
            </div>
        `;
    }

    if (pet.ong) {
        ongInfoContainer.innerHTML = montarHtmlOng(pet.ong, pet.ong.endereco);
    } else if (pet.id_ong) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/ong/${pet.id_ong}`);
            if (res.ok) {
                const ong = await res.json();
                ongInfoContainer.innerHTML = montarHtmlOng(ong, ong.endereco);
            }
        } catch (err) {
            console.error("Erro ao carregar ONG:", err);
        }
    }
}
