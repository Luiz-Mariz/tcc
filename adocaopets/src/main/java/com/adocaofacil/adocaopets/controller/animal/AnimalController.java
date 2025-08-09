package com.adocaofacil.adocaopets.controller.animal;

import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import com.adocaofacil.adocaopets.service.animal.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.util.List;

@RestController
@RequestMapping("/api/animal")
@CrossOrigin("*")
public class AnimalController {

    @Autowired
    private AnimalService service;

    // Listar todos
    @GetMapping
    public ResponseEntity<List<AnimalModel>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<AnimalModel> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar foto
    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> buscarFoto(@PathVariable Long id) {
        var optionalAnimal = service.buscarPorId(id);

        if (optionalAnimal.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var animal = optionalAnimal.get();

        if (animal.getFoto() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = detectarTipoImagem(animal.getFoto());
        if (contentType == null) {
            return ResponseEntity
                    .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .build();
        }

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(animal.getFoto());
    }

    // Salvar com foto via multipart/form-data
@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<AnimalModel> cadastrarAnimal(
        @RequestPart("animal") AnimalModel animal,
        @RequestPart(value = "foto", required = false) MultipartFile foto
) {
    try {
        if (foto != null && !foto.isEmpty()) {
            animal.setFoto(foto.getBytes());
        }
        AnimalModel salvo = service.salvar(animal);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
    // Deletar animal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean removido = service.deletar(id);
        return removido ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Detecta tipo de imagem para retornar com o Content-Type correto
    private String detectarTipoImagem(byte[] imagemBytes) {
        try {
            return URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imagemBytes));
        } catch (IOException e) {
            return null;
        }
    }
}
