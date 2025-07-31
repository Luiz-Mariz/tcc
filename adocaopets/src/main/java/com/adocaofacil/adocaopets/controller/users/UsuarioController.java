package com.adocaofacil.adocaopets.controller.users;

import com.adocaofacil.adocaopets.model.users.UsuarioModel;
import com.adocaofacil.adocaopets.service.users.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<UsuarioModel> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioModel> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioModel> salvar(@RequestBody UsuarioModel usuarioModel) {
        UsuarioModel usuarioCriado = service.salvar(usuarioModel);
        return ResponseEntity.created(URI.create("/api/usuarios/" + usuarioCriado.getId())).body(usuarioCriado);
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
    public ResponseEntity<UsuarioModel> deletar(@PathVariable Long id) {
        if (!service.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioModel usuarioModel) {
        try {
            Optional<UsuarioModel> usuarioOptional = service.verificarCredenciais(usuarioModel.getEmail(), usuarioModel.getSenha_hash());

            if (usuarioOptional.isPresent()) {
                UsuarioModel usuario = usuarioOptional.get();

                Map<String, Object> response = new HashMap<>();
                response.put("id", usuario.getId());
                response.put("email", usuario.getEmail());
                response.put("tipoUsuario", usuario.getTipoUsuario().name().toLowerCase()); // Coloca o tipo de usuário em minúsculas
                response.put("ativo", usuario.getAtivo());
                response.put("created_at", usuario.getCreated_at());
                response.put("updated_at", usuario.getUpdated_at());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Email ou senha inválidos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao autenticar: " + e.getMessage());
        }
    }



}
