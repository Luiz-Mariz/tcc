package com.adocaofacil.adocaopets.service.animal;

import com.adocaofacil.adocaopets.enumClasses.PorteAnimal;
import com.adocaofacil.adocaopets.enumClasses.SexoAnimal;
import com.adocaofacil.adocaopets.enumClasses.StatusAnimal;
import com.adocaofacil.adocaopets.model.animal.AnimalModel;
import com.adocaofacil.adocaopets.model.animal.TipoAnimalModel;
import com.adocaofacil.adocaopets.model.users.OngModel;
import com.adocaofacil.adocaopets.repository.animal.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository repository;

    // Listar todos
    public List<AnimalModel> listarTodos() {
        return repository.findAll();
    }

    // Buscar por ID
    public Optional<AnimalModel> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Salvar com foto (multipart)
    public AnimalModel salvarComFoto(String nome, String idade, String porte, String sexo,
                                     String descricao, String status, Long idTipoAnimal,
                                     Long idOng, MultipartFile foto) throws IOException {

        AnimalModel animal = new AnimalModel();
        animal.setNome(nome);
        animal.setIdade(idade);
        animal.setPorte(PorteAnimal.valueOf(porte.toUpperCase()));
        animal.setSexo(SexoAnimal.valueOf(sexo.toUpperCase()));
        animal.setDescricao(descricao);
        animal.setStatus(StatusAnimal.valueOf(status.toUpperCase()));

        TipoAnimalModel tipoAnimal = new TipoAnimalModel();
        tipoAnimal.setId(idTipoAnimal);
        animal.setTipoAniaml(tipoAnimal);

        OngModel ong = new OngModel();
        ong.setId(idOng);
        animal.setOng(ong);

        if (foto != null && !foto.isEmpty()) {
            animal.setFoto(foto.getBytes());
        }

        return repository.save(animal);
    }

    // Salvar (genérico)
    public AnimalModel salvar(AnimalModel animalModel) {
        return repository.save(animalModel);
    }

    // Atualizar animal
    public Optional<AnimalModel> atualizar(Long id, AnimalModel dadosAtualizados) {
        return repository.findById(id).map(animalExistente -> {
            dadosAtualizados.setId(id);
            return repository.save(dadosAtualizados);
        });
    }

    // Deletar
    public boolean deletar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
