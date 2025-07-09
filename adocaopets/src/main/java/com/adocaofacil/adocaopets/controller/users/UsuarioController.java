package com.adocaofacil.adocaopets.controller.users;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.adocaofacil.adocaopets.model.users.UsuarioModel;
import com.adocaofacil.adocaopets.service.users.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<UsuarioModel> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioModel> buscarPorId(@PathVariable Long id, @RequestBody UsuarioModel usuarioModel) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UsuarioModel salvar(@RequestBody UsuarioModel usuarioModel) {
        return service.salvar(usuarioModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioModel> atualizar(@PathVariable Long id, @RequestBody UsuarioModel usuarioModel) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        usuarioModel.setId(id);

        return ResponseEntity.ok(service.salvar(usuarioModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UsuarioModel> deletar(@PathVariable Long id, @RequestBody UsuarioModel usuarioModel) {
        if (service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String senha){

        try {
            boolean autentificando = service.verificar(email, senha);

            if (autentificando) {
                return "Login bem-sucedido";
            } else {
                return "Email ou senha invalidas";
            }
        } catch (Exception e) {
            return "Erro " + e.getMessage();
        }
    }
}
