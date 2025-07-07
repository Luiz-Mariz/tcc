package com.adocaofacil.adocaopets.repository.animal;

import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalRepository extends JpaRepository<AnimalModel, Long> {
}
