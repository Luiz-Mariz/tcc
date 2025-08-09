document.addEventListener('DOMContentLoaded', () => {

    // updateHeaderProfile(); // Se você tiver uma função de atualização do cabeçalho

});


// Script para preenchimento de CEP

document.getElementById('cep').addEventListener('blur', async (event) => {
    const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            } else {
                Swal.fire('CEP não encontrado', 'Por favor, verifique o CEP digitado.', 'error');
            }
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível buscar o CEP. Tente novamente.', 'error');
        }
    }
});

// Função para enviar os dados do usuário
async function adicionarUsuario(usuario) {
    const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario)
    });

    if (!response.ok) {
        throw new Error('Erro ao adicionar usuário');
    }

    return await response.json();
}

// Função para enviar os dados do endereço
async function adicionarEndereco(endereco) {
    const response = await fetch('http://localhost:8080/api/endereco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(endereco)
    });

    if (!response.ok) {
        throw new Error('Erro ao adicionar endereço');
    }

    return await response.json();
}

// Função para enviar os dados da ONG
async function adicionarONG(ong) {
    const response = await fetch('http://localhost:8080/api/ong', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ong)
    });

    if (!response.ok) {
        throw new Error('Erro ao adicionar ONG');
    }

    return await response.json();
}

// Função para capturar os dados do formulário e enviar as requisições em sequência
document.getElementById('form-ong').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário usando os IDs do seu HTML
    const nome = document.getElementById('nome').value;
    const nomeResponsavel = document.getElementById('nome_responsavel').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cnpj = document.getElementById('cnpj').value;
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const instagram = document.getElementById('facebook').value; // Usando 'facebook' como Instagram, como no seu código original.
    const tipoParceria = document.getElementById('tipo_parceria').value;
    const senha = document.getElementById('senha').value;
    const confirmeSenha = document.getElementById('confirme_senha').value;
    const mensagem = document.getElementById('mensagem').value;

    // --- Validações de Frontend ---
    if (senha !== confirmeSenha) {
        Swal.fire({
            icon: 'error',
            title: 'Erro de Senha',
            text: 'As senhas não coincidem. Por favor, verifique.',
        });
        return;
    }

    if (senha.length < 6) {
        Swal.fire({
            icon: 'warning',
            title: 'Senha Curta',
            text: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
    }

    try {
        // Objeto de dados para o endereço
        const dadosEndereco = {
            cep: cep,
            logradouro: logradouro,
            numero: numero,
            complemento: complemento || null,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
        };

        // Adiciona o endereço e pega o ID
        const enderecoResposta = await adicionarEndereco(dadosEndereco);
        console.log('Endereço adicionado:', enderecoResposta);

        // Objeto de dados para o usuário
        const dadosUsuario = {
            nome: nome,
            email: email,
            senha_hash: senha, // A senha em texto puro, que o backend irá hashear
            tipoUsuario: 'ONG',
            foto_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdGIriHwMYbjKJI76jDDK8KzXXSZhiNKGs9g&s',
            ativo: true
        };

        // Adiciona o usuário e pega o ID do usuário
        const usuarioResposta = await adicionarUsuario(dadosUsuario);
        console.log('Usuário adicionado:', usuarioResposta);

        // Agora que temos os IDs do endereço e do usuário, adiciona a ONG
       const dadosONG = {
    nome: nome,
    cnpj: cnpj || null,
    telefone: telefone || null,
    instagram: instagram || null,
    responsavel_nome: nomeResponsavel,
    tipo_parceria: tipoParceria,
    mensagem: mensagem,
    // Adaptação para o formato de objeto aninhado
    usuario: { id: usuarioResposta.id },
    endereco: { id: enderecoResposta.id }
};

        const ongResposta = await adicionarONG(dadosONG);
        console.log('ONG adicionada:', ongResposta);

        // Limpa o formulário após sucesso
        document.getElementById('form-ong').reset();

        Swal.fire({
            icon: 'success',
            title: 'Proposta enviada com sucesso!',
            text: 'Sua proposta foi registrada e será analisada em breve.',
            confirmButtonText: 'Ok'
        });

    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao enviar os dados. Tente novamente.',
        });
    }
});

document.getElementById('cnpj').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (valor.length > 14) valor = valor.slice(0, 14); // Limita a 14 dígitos

    // Aplica a máscara: 00.000.000/0000-00
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');

    e.target.value = valor;
});

// Máscara para CEP
document.getElementById('cep').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, ''); // Remove não numéricos
    if (valor.length > 8) valor = valor.slice(0, 8); // Limita a 8 dígitos

    // Aplica a máscara: 00000-000
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');

    e.target.value = valor;
    
});

const telEl = document.getElementById('telefone');
if (telEl) {
  telEl.addEventListener('input', e => {
    let valor = e.target.value.replace(/\D/g, '').slice(0, 11); // só números, máx 11 dígitos
    if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    if (valor.length > 10) {
      valor = valor.slice(0, 10) + ' ' + valor.slice(10);
    }
    e.target.value = valor;
  });
}
