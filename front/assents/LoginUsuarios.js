const formLogin = document.getElementById('formLogin');
formLogin.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que o formulário recarregue a página

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Dados para enviar na requisição
    const loginData = {
        email: email,
        senha_hash: senha
    };

    // Faz a requisição ao backend
    fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            // Exibe erro se a resposta não for bem-sucedida
            throw new Error('Erro ao fazer login');
        }
        return response.json(); // Converte a resposta para JSON
    })
    .then(data => {
        // Verifica se a resposta contém a chave tipoUsuario
        if (data && data.tipoUsuario) {
            // Armazena os dados no localStorage
            localStorage.setItem('foto_url', data.foto_url)
            localStorage.setItem('tipoUsuario', data.tipoUsuario);
            localStorage.setItem('usuarioId', data.id);
            localStorage.setItem('usuarioEmail', data.email);

            // Redireciona com base no tipo de usuário
            if (data.tipoUsuario === 'tutor') {
                window.location.href = "telaTutor.html"; // Redireciona para a tela do tutor
            } else if (data.tipoUsuario === 'ong') {
                window.location.href = "telaOng.html"; // Redireciona para a tela da ONG
            } else if (data.tipoUsuario === 'admin') {
                window.location.href = "Adm/TelaInicialAdm.html"; // Redireciona para a tela do admin
            }
        } else {
            Swal.fire('Erro', 'Usuário ou senha inválidos.', 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao processar a requisição:', error);
        Swal.fire('Erro', 'Houve um problema ao tentar fazer login. Tente novamente.', 'error');
    });
});
