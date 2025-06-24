package com.adocaofacil.adocaopets.model.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ONG", uniqueConstraints = {@UniqueConstraint(columnNames = {"cnpj", "id_usuario"})})
@Getter
@Setter
@NoArgsConstructor
public class OngModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cnpj", nullable = false)
    private String cnpj;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "instagram")
    private String instagram;

    @Column(name = "responsavel_nome")
    private String responsavel_nome;

    @ManyToOne
    @JoinColumn(name = "id_usuario", foreignKey = @ForeignKey(name = "fk_ong_usuario"))
    private UsuarioModel usuario;

    @ManyToOne
    @JoinColumn(name = "id_endereco", foreignKey = @ForeignKey(name = "fk_ong_endereco"))
    private EnderecoModel endereco;
}
