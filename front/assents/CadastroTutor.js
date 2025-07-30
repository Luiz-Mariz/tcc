async function cadastro(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // 1. Coletar todos os dados do formulário
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value; // Senha em texto puro do formulário
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // --- Validações de Frontend ---
    if (senha !== confirmarSenha) {
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

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        Swal.fire({
            icon: 'warning',
            title: 'CPF Inválido',
            text: 'O CPF deve conter 11 dígitos.',
        });
        return;
    }

    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo && (telefoneLimpo.length < 10 || telefoneLimpo.length > 11)) {
        Swal.fire({
            icon: 'warning',
            title: 'Telefone Inválido',
            text: 'O telefone deve ter 10 ou 11 dígitos (incluindo DDD).',
        });
        return;
    }

    let idUsuarioCriado = null; // Para armazenar o ID do usuário criado

    // --- PRIMEIRO PASSO: Cadastrar na tabela Usuario via /api/usuarios ---
    try {
        // Crie o objeto de dados EXATAMENTE como você enviaria no Postman/Insomnia para /api/usuarios
        const usuarioPayload = {
            nome: nome,
            email: email,
            senha_hash: senha, // A senha em texto puro, que o backend irá hashear
            tipoUsuario: 'TUTOR', // Garanta que 'TUTOR' está exatamente como o enum espera
            ativo: true // Definir o usuário como ativo
        };

        // Debug: Log o JSON que está prestes a ser enviado
        console.log("JSON para /api/usuarios:", JSON.stringify(usuarioPayload));

        const responseUsuario = await fetch('http://localhost:8080/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Boa prática incluir Accept
            },
            body: JSON.stringify(usuarioPayload),
        });

        // Verifique se a resposta foi bem-sucedida (status 2xx)
        if (!responseUsuario.ok) {
            const errorText = await responseUsuario.text();
            console.error("Erro bruto do backend (/api/usuarios):", errorText);
            let errorMessage = 'Erro desconhecido ao cadastrar usuário principal.';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = errorText;
            }
            throw new Error(`Status: ${responseUsuario.status} - ${errorMessage}`);
        }

        const usuarioData = await responseUsuario.json();
        idUsuarioCriado = usuarioData.id; // Assume que o backend retorna o ID do usuário criado

        if (!idUsuarioCriado) {
            throw new Error('ID do usuário não retornado pelo servidor após cadastro principal.');
        }

        console.log('Usuário principal cadastrado com ID:', idUsuarioCriado);

    } catch (error) {
        console.error('Erro geral na etapa de cadastro de usuário principal:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro no Cadastro de Usuário',
            text: error.message || 'Não foi possível completar o cadastro principal. Verifique o console para mais detalhes.',
        });
        return; // Interrompe a execução se o primeiro passo falhar
    }

    // --- SEGUNDO PASSO: Cadastrar na tabela Tutor via /api/tutor ---
    try {
        // Crie o objeto de dados EXATAMENTE como você enviaria no Postman/Insomnia para /api/tutor
        const tutorPayload = {
    nome: nome,
    cpf: cpfLimpo,
    telefone: telefoneLimpo,
    usuario: { id: idUsuarioCriado }  // Enviando o ID como parte do objeto 'usuario'
};

        // Debug: Log o JSON que está prestes a ser enviado
        console.log("JSON para /api/tutor:", JSON.stringify(tutorPayload));

        const responseTutor = await fetch('http://localhost:8080/api/tutor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(tutorPayload),
        });

        // Verifique se a resposta foi bem-sucedida (status 2xx)
        if (!responseTutor.ok) {
            const errorText = await responseTutor.text();
            console.error("Erro bruto do backend (/api/tutor):", errorText);
            let errorMessage = 'Erro desconhecido ao cadastrar informações do tutor.';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = errorText;
            }
            throw new Error(`Status: ${responseTutor.status} - ${errorMessage}`);
        }

        const tutorData = await responseTutor.json();
        console.log('Informações do Tutor cadastradas:', tutorData);

        // Se ambos os cadastros foram bem-sucedidos
        Swal.fire({
            icon: 'success',
            title: 'Cadastro Realizado!',
            text: 'Seu cadastro de tutor foi concluído com sucesso.',
            confirmButtonText: 'Entrar'
        }).then(() => {
            window.location.href = 'TelaLogin.html'; // Redireciona
        });

    } catch (error) {
        console.error('Erro geral na etapa de cadastro de tutor:', error);
        // Em um cenário real, você consideraria reverter o cadastro de usuário principal aqui
        Swal.fire({
            icon: 'error',
            title: 'Erro no Cadastro de Tutor',
            text: error.message || 'Não foi possível completar as informações do tutor. Verifique o console para mais detalhes.',
        });
    }
}

// Adiciona o event listener ao formulário
document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', cadastro);
    }
});
