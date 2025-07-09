package com.adocaofacil.adocaopets.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adocaofacil.adocaopets.model.users.UsuarioModel;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository <UsuarioModel, Long>{
    Optional<UsuarioModel> findByEmail(String email);
}
