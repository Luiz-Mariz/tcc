package com.adocaofacil.adocaopets.repository.animal;

import com.adocaofacil.adocaopets.model.animal.AdocaoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdocaoRepository extends JpaRepository<AdocaoModel, Long> {
}
