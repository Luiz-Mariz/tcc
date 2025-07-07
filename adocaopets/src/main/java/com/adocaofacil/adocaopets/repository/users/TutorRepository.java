package com.adocaofacil.adocaopets.repository.users;

import com.adocaofacil.adocaopets.model.users.TutorModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TutorRepository extends JpaRepository<TutorModel, Long> {
}
