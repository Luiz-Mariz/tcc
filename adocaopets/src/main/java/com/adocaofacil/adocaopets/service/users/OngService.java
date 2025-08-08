package com.adocaofacil.adocaopets.service.users;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adocaofacil.adocaopets.model.users.OngModel;
import com.adocaofacil.adocaopets.repository.users.OngRepository;

@Service
public class OngService {
    
    @Autowired
    private OngRepository repository;

    public List<OngModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<OngModel> buscarPorId(Long id){
        return repository.findById(id);
    }

    public OngModel salvar(OngModel ongModel){
        return repository.save(ongModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);
    }

    public Optional<OngModel> buscarPorIdUsuario(Long idUsuario) {
        return repository.findByUsuarioId(idUsuario);
    }
}
