package com.adocaofacil.adocaopets.repository.users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adocaofacil.adocaopets.model.users.OngModel;

@Repository
public interface OngRepository extends JpaRepository<OngModel, Long>{
        Optional<OngModel> findByUsuarioId(Long usuarioId);
}
