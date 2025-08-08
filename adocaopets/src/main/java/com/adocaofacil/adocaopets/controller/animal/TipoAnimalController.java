package com.adocaofacil.adocaopets.controller.animal;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adocaofacil.adocaopets.model.animal.TipoAnimalModel;
import com.adocaofacil.adocaopets.service.animal.TipoAnimalService;

@RestController
@RequestMapping("/api/tipoAnimal")
@CrossOrigin("*")
public class TipoAnimalController {
    
    @Autowired
    private TipoAnimalService service;

    @GetMapping
    public List<TipoAnimalModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity <TipoAnimalModel> acharPorId(@PathVariable Long id, @RequestBody TipoAnimalModel tipoAnimalModel){
        return service.buscarPorID(id)
               .map(ResponseEntity :: ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TipoAnimalModel salvar(@RequestBody TipoAnimalModel tipoAnimalModel){
        return service.salvar(tipoAnimalModel);
    }

    @DeleteMapping
    public ResponseEntity<TipoAnimalModel> deletar(@PathVariable Long id, @RequestBody TipoAnimalModel tipoAnimalModel){
        if (!service.buscarPorID(id).isPresent()) {
            return ResponseEntity.noContent().build();
        }

        service.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
