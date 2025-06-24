package com.adocaofacil.adocaopets.repository.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adocaofacil.adocaopets.model.users.EnderecoModel;

@Repository
public interface EnderecoRepository extends JpaRepository<EnderecoModel, Long>{
    
}
