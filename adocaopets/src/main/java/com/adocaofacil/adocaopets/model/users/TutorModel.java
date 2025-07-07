package com.adocaofacil.adocaopets.model.users;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Tutor",uniqueConstraints = {@UniqueConstraint(columnNames = {"cnpj", "id_usuario"})})

@Getter
@Setter

@NoArgsConstructor
public class TutorModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cpf", nullable = false)
    private String cpf;

    @Column(name = "telefone")
    private String telefone;

    @ManyToOne
    @JoinColumn(name = "id_usuario", foreignKey = @ForeignKey(name = "fk_tutor_usuario"))
    private  UsuarioModel usuario;

    @ManyToOne
    @JoinColumn(name = "id_endereco", foreignKey = @ForeignKey(name = "fk_tutor_Endereco"))
    private EnderecoModel endereco;
}
