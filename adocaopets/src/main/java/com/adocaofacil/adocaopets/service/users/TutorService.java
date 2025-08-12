package com.adocaofacil.adocaopets.service.users;

import com.adocaofacil.adocaopets.model.users.TutorModel;
import com.adocaofacil.adocaopets.repository.users.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TutorService {

    @Autowired
    private TutorRepository repository;

    public List<TutorModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<TutorModel> buscarPorId(Long id){
        return  repository.findById(id);
    }

    public TutorModel save(TutorModel tutorModel){
        return repository.save(tutorModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);
    }

    public Optional<TutorModel> buscarPorIdUsuario(Long idUsuario) {
        return repository.findByUsuarioId(idUsuario);
    }
}
