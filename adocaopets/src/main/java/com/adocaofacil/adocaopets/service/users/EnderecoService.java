package com.adocaofacil.adocaopets.service.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adocaofacil.adocaopets.model.users.EnderecoModel;
import com.adocaofacil.adocaopets.repository.users.EnderecoRepository;

@Service
public class EnderecoService {
    
    @Autowired
    private EnderecoRepository repository;

    public List<EnderecoModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<EnderecoModel> buscarPorId(Long id){
        return repository.findById(id);
    }

    public EnderecoModel salvar(EnderecoModel enderecoModel){
        return repository.save(enderecoModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);;
    }
}
