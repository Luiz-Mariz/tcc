package com.adocaofacil.adocaopets.controller.users;

import com.adocaofacil.adocaopets.model.users.TutorModel;
import com.adocaofacil.adocaopets.service.users.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutor")
@CrossOrigin("*")
public class TutorController {

    @Autowired
    private TutorService service;

    @GetMapping
    public List<TutorModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorModel> buscarPorID(@PathVariable Long id){
        return service.buscarPorId(id)
                .map(ResponseEntity :: ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<TutorModel> buscarPorIdUsuario(@PathVariable Long idUsuario) {
        return service.buscarPorIdUsuario(idUsuario)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TutorModel salvar(@RequestBody TutorModel tutorModel){
        return service.save(tutorModel);

    }

    @PutMapping("/{id}")
    public  ResponseEntity<TutorModel> atulizar(@PathVariable Long id, @RequestBody TutorModel tutorModel){
        if (!service.buscarPorId(id).isPresent()){
            return ResponseEntity.notFound().build();
        }

        tutorModel.setId(id);

        return ResponseEntity.ok(service.save(tutorModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TutorModel> deletar(@PathVariable Long id){
        if (!service.buscarPorId(id).isPresent()){
            return ResponseEntity.notFound().build();
        }

        service.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
