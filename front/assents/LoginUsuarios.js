// Adiciona um listener para o evento de 'submit' do formulário de login
const formLogin = document.getElementById('formLogin');
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que o formulário recarregue a página

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const loginData = {
        email: email,
        senha_hash: senha
    };

    try {
        // Passo 1: Faz a requisição de login do usuário
        const loginResponse = await fetch('http://localhost:8080/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        // Se o login falhar, exibe um erro
        if (!loginResponse.ok) {
            Swal.fire('Erro', 'Usuário ou senha inválidos.', 'error');
            return;
        }

        const userData = await loginResponse.json();

        // Passo 2: Se o tipo de usuário for 'ong', faz uma segunda requisição
        if (userData.tipoUsuario === 'ong') {
            const ongResponse = await fetch(`http://localhost:8080/api/ong/usuario/${userData.id}`);

            if (!ongResponse.ok) {
                // Se não encontrar a ONG, exibe um erro específico
                Swal.fire('Erro', 'Não foi possível encontrar a ONG associada a este usuário.', 'error');
                return;
            }

            const ongData = await ongResponse.json();
            
            // Adiciona o ID da ONG e o objeto completo da ONG ao objeto do usuário
            userData.id_ong = ongData.id;
            userData.ong = ongData;
        }

        if (userData.tipoUsuario === 'tutor') {
            const ongResponse = await fetch(`http://localhost:8080/api/tutor/usuario/${userData.id}`);

            if (!ongResponse.ok) {
                // Se não encontrar a ONG, exibe um erro específico
                Swal.fire('Erro', 'Não foi possível encontrar a Tutor associada a este usuário.', 'error');
                return;
            }

            const tutorData = await ongResponse.json();
            
            userData.id_tutor = tutorData.id;
            userData.tutor = tutorData;
        }
        
        // Passo 3: Salva o objeto completo no localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Passo 4: Redireciona com base no tipo de usuário
        if (userData.tipoUsuario === 'tutor') {
            window.location.href = "tutor/TelaInicialTutor.html";
        } else if (userData.tipoUsuario === 'ong') {
            window.location.href = "ong/telaInicialOng.html";
        } else if (userData.tipoUsuario === 'admin') {
            window.location.href = "Adm/TelaInicialAdm.html";
        }

    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        Swal.fire('Erro', 'Houve um problema ao tentar fazer login. Tente novamente.', 'error');
    }
});
