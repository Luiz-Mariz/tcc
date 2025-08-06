package com.adocaofacil.adocaopets.controller.users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adocaofacil.adocaopets.model.users.EnderecoModel;
import com.adocaofacil.adocaopets.service.users.EnderecoService;

@RestController
@RequestMapping("/api/endereco")
@CrossOrigin("*")
public class EnderecoController {
    
    @Autowired
    private EnderecoService service;

    @GetMapping
    public List<EnderecoModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoModel> buscarPorId(@PathVariable Long id, @RequestBody EnderecoModel enderecoModel){
        return service.buscarPorId(id)
               .map(ResponseEntity :: ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EnderecoModel salvar(@RequestBody EnderecoModel enderecoModel){
        return service.salvar(enderecoModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoModel> atualizar(@PathVariable Long id, @RequestBody EnderecoModel enderecoModel){
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        enderecoModel.setId(id);
        
        return ResponseEntity.ok(service.salvar(enderecoModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EnderecoModel> deletar(@PathVariable Long id, @RequestBody EnderecoModel enderecoModel){
        if (!service.buscarPorId(id).isPresent()) {
           return ResponseEntity.notFound().build();
        }

        service.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
