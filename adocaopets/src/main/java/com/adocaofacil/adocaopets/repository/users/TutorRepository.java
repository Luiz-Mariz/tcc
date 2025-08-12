package com.adocaofacil.adocaopets.repository.users;

import com.adocaofacil.adocaopets.model.users.TutorModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TutorRepository extends JpaRepository<TutorModel, Long> {
    Optional<TutorModel> findByUsuarioId(Long usuarioId);
}
