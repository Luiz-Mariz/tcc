package com.adocaofacil.adocaopets.model.users;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.adocaofacil.adocaopets.enumClasses.TipoUsuario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Usuario", uniqueConstraints={@UniqueConstraint(columnNames={"email"})})

@Getter
@Setter

@NoArgsConstructor
public class UsuarioModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senha_hash;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable =  false)
    private TipoUsuario tipoUsuario;

    @Column(nullable = false)
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario != null ? TipoUsuario.valueOf(tipoUsuario.name().toUpperCase()) : null;
    }

    @OneToMany(mappedBy = "usuario")
    private List<TutorModel> tutores;
}
