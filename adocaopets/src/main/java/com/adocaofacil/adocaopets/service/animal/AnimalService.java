package com.adocaofacil.adocaopets.service.animal;

import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import com.adocaofacil.adocaopets.repository.animal.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository repository;

    public List<AnimalModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<AnimalModel> buscarPorId(Long id){
        return repository.findById(id);
    }

    public AnimalModel salvar(AnimalModel animalModel){
        return repository.save(animalModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);
    }
}
