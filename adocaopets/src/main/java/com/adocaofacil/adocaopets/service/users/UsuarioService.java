package com.adocaofacil.adocaopets.service.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adocaofacil.adocaopets.model.users.UsuarioModel;
import com.adocaofacil.adocaopets.repository.users.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository repository;

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
}
