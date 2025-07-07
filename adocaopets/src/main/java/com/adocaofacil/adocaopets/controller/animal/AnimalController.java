package com.adocaofacil.adocaopets.controller.animal;

import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import com.adocaofacil.adocaopets.service.animal.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animal")
public class AnimalController {

    @Autowired
    private AnimalService service;

    @GetMapping
    public List<AnimalModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalModel> buscarPorId(@PathVariable Long id){
        return service.buscarPorId(id)
                .map(ResponseEntity :: ok)
                .orElse(ResponseEntity.notFound().build());

    }

    @PostMapping
    public AnimalModel salvar(@RequestBody AnimalModel animalModel){
        return service.salvar(animalModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalModel> atualizar(@PathVariable Long id, @RequestBody AnimalModel animalModel){
        if (!service.buscarPorId(id).isPresent()){
            return ResponseEntity.notFound().build();
        }

        animalModel.setId(id);

        return  ResponseEntity.notFound().build();
    }


    @DeleteMapping
    public ResponseEntity<AnimalModel> deletar(@PathVariable Long id, @RequestBody AnimalModel animalModel){
        if (!service.buscarPorId(id).isPresent()){
            return ResponseEntity.notFound().build();
        }

        service.deletar(id);

        return  ResponseEntity.noContent().build();
    }
}
