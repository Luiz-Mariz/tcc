package com.adocaofacil.adocaopets.service.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
        if (usuarioModel.getSenha_hash() != null && !usuarioModel.getSenha_hash().isEmpty()) {
            String senhaHash = passwordEncoder.encode(usuarioModel.getSenha_hash());
            usuarioModel.setSenha_hash(senhaHash);
        }
        else {
            throw new IllegalArgumentException("A senha não pode ser nula ou vazia");
        }
        return repository.save(usuarioModel);
    }

    public void deletar(Long id){
         repository.deleteById(id);
    }

    public Optional<UsuarioModel> verificarCredenciais(String email, String senha) {

        Optional<UsuarioModel> usuarioOptional = repository.findByEmail(email);

        if (usuarioOptional.isPresent()) {
            UsuarioModel usuario = usuarioOptional.get();


            if (passwordEncoder.matches(senha, usuario.getSenha_hash())) {
                return Optional.of(usuario);
            }
        }

        return Optional.empty();
    }

}

