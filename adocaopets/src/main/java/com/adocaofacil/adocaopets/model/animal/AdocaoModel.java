package com.adocaofacil.adocaopets.model.animal;

import com.adocaofacil.adocaopets.enumClasses.StatusAdoacao;
import com.adocaofacil.adocaopets.model.users.TutorModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "Adocao")

@Getter
@Setter

@NoArgsConstructor
public class AdocaoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusAdoacao status;

    @ManyToOne
    @JoinColumn(name = "id_pessoa", nullable = false, foreignKey = @ForeignKey(name = "fk_adocao_pessoa"))
    private TutorModel pessoa;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false, foreignKey = @ForeignKey(name = "fk_adocao_animal"))
    private AnimalModel animal;

    @Column(name = "data_peticao", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate dataPeticao;

    @Column(name = "data_conclusao", columnDefinition = "DATE")
    private LocalDate dataConclucao;

}
