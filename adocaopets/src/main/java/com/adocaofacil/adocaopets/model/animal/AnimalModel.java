package com.adocaofacil.adocaopets.model.animal;

import com.adocaofacil.adocaopets.enumClasses.PorteAnimal;
import com.adocaofacil.adocaopets.enumClasses.SexoAnimal;
import com.adocaofacil.adocaopets.enumClasses.StatusAnimal;
import com.adocaofacil.adocaopets.model.users.OngModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Animal")

@Getter
@Setter

@NoArgsConstructor
public class AnimalModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

   @Column(name = "idade")
   private String idade;

    @Enumerated(EnumType.STRING)
    @Column(name = "porte")
    private PorteAnimal porte;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexo")
    private SexoAnimal sexo;

    @Column(name = "descricao")
    private String descricao;

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusAnimal status;

    @ManyToOne
    @JoinColumn(name = "id_tipo_animal", nullable = false, foreignKey = @ForeignKey(name = "fk_animal_tipo"))
    private TipoAnimalModel tipoAniaml;

    @ManyToOne
    @JoinColumn(name = "id_ong", foreignKey = @ForeignKey(name = "fk_animal_ong"))
    private OngModel ong;
}
