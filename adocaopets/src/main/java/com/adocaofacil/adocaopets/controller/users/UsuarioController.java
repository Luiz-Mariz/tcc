package com.adocaofacil.adocaopets.controller.users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adocaofacil.adocaopets.model.users.UsuarioModel;
import com.adocaofacil.adocaopets.service.users.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<UsuarioModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioModel> buscarPorId(@PathVariable Long id, @RequestBody UsuarioModel usuarioModel){
        return service.buscarPorId(id)
               .map(ResponseEntity :: ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UsuarioModel salvar(@RequestBody UsuarioModel usuarioModel){
        return service.salvar(usuarioModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioModel> atualizar(@PathVariable Long id, @RequestBody UsuarioModel usuarioModel){
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        usuarioModel.setId(id);

        return ResponseEntity.ok(service.salvar(usuarioModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UsuarioModel> deletar(@PathVariable Long id, @RequestBody UsuarioModel usuarioModel){
        if (service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        service.deletar(id);

        return ResponseEntity.noContent().build();
    }

    
}
