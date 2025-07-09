package com.adocaofacil.adocaopets.service.users;

import java.util.List;
import java.util.Optional;

import com.adocaofacil.adocaopets.Redirecao.RedirectResponse;
import com.adocaofacil.adocaopets.enumClasses.TipoUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.adocaofacil.adocaopets.model.users.UsuarioModel;
import com.adocaofacil.adocaopets.repository.users.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<UsuarioModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<UsuarioModel> buscarPorId(Long id){
        return repository.findById(id);
    }

    public UsuarioModel salvar(UsuarioModel usuarioModel){
        return repository.save(usuarioModel);
    }

    public void deletar(Long id){
         repository.deleteById(id);
    }

    public String login(UsuarioModel usuarioRequest) {
        // Alteração: Remover a busca por 'username' e buscar apenas por 'email'
        Optional<UsuarioModel> usuario = repository.findByEmail(usuarioRequest.getEmail()); // Busca apenas por email

        if (usuario.isPresent()) {
            UsuarioModel usuarioFound = usuario.get();

            if (passwordEncoder.matches(usuarioRequest.getSenhaHash(), usuarioFound.getSenhaHash())) {
                TipoUsuario tipoUsuario = usuarioFound.getTipoUsuario();
                String redirectUrl = "";

                switch (tipoUsuario) {
                    case ADMIN:
                        redirectUrl = "/admin-dashboard";
                        break;
                    case TUTOR:
                        redirectUrl = "/tutor-dashboard";
                        break;
                    case ONG:
                        redirectUrl = "/ong-dashboard";
                        break;
                    default:
                        return "Tipo de usuário desconhecido.";
                }

                return redirectUrl;
            } else {
                return "Senha incorreta.";
            }
        } else {
            return "Usuário não encontrado.";
        }
    }
}

