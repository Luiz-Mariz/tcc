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

import com.adocaofacil.adocaopets.model.users.OngModel;
import com.adocaofacil.adocaopets.service.users.OngService;

@RestController
@RequestMapping("/api/ong")
@CrossOrigin("*")
public class OngController {
    
    @Autowired
    private OngService service;

    @GetMapping
    public List<OngModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OngModel> buscarPorID(@PathVariable Long id){
        return service.buscarPorId(id)
               .map(ResponseEntity :: ok)
               .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<OngModel> buscarPorIdUsuario(@PathVariable Long idUsuario) {
        return service.buscarPorIdUsuario(idUsuario)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OngModel salvar(@RequestBody OngModel ongModel){ 
        return service.salvar(ongModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OngModel> atualizar(@PathVariable Long id, @RequestBody OngModel ongModel){
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ongModel.setId(id); 

        return ResponseEntity.ok(service.salvar(ongModel));
    }

     @DeleteMapping("/{id}")
    public ResponseEntity<OngModel> deletar(@PathVariable Long id){
        if (!service.buscarPorId(id).isPresent()) {
           return ResponseEntity.notFound().build();
        }

        service.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
