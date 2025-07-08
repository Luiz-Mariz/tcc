package com.adocaofacil.adocaopets.service.animal;

import com.adocaofacil.adocaopets.model.animal.AdocaoModel;
import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import com.adocaofacil.adocaopets.repository.animal.AdocaoRepository;
import com.adocaofacil.adocaopets.repository.animal.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdocacaoService {

    @Autowired
    private AdocaoRepository repository;

    public List<AdocaoModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<AdocaoModel> buscarPorId(Long id){
        return repository.findById(id);
    }

    public AdocaoModel salvar(AdocaoModel adocaoModel){
        return repository.save(adocaoModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);
    }
}
