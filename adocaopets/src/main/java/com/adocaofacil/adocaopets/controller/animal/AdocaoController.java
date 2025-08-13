package com.adocaofacil.adocaopets.controller.animal;

import com.adocaofacil.adocaopets.model.animal.AdocaoModel;
import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import com.adocaofacil.adocaopets.service.animal.AdocacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adocao")
@CrossOrigin("*")
public class AdocaoController {

    @Autowired
    private AdocacaoService service;

    @GetMapping
    public List<AdocaoModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdocaoModel> buscarPorId(@PathVariable Long id){
        return service.buscarPorId(id)
                .map(ResponseEntity :: ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AdocaoModel salvar(@RequestBody AdocaoModel adocaoModel){
        return service.salvar(adocaoModel);
    }

    @PutMapping("/{id}")
    public  ResponseEntity<AdocaoModel> atualizar(@PathVariable Long id, @RequestBody AdocaoModel adocaoModel){
        if (!service.buscarPorId(id).isPresent()){
            return ResponseEntity.notFound().build();
        }

        adocaoModel.setId(id);

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<AnimalModel> deletar (@PathVariable Long id){
        if (!service.buscarPorId(id).isPresent()){
            return ResponseEntity.notFound().build();
        }

        service.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
