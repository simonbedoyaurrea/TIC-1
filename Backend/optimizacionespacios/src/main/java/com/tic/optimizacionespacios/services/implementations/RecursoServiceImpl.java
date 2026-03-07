package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Materia;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.repositories.RecursoRepository;
import com.tic.optimizacionespacios.services.interfaces.RecursoService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class RecursoServiceImpl implements RecursoService {
    private final RecursoRepository recursoRepository;

    public RecursoServiceImpl(RecursoRepository recursoRepository) {
        this.recursoRepository = recursoRepository;
    }

    @Override
    public Recurso crearRecurso(Recurso recurso) {
        validarExistencia(recurso);

        return recursoRepository.save(recurso);
    }

    @Override
    public Recurso obtenerRecurso(Long id) {
        return recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado"));
    }

    @Override
    public List<Recurso> obtenerRecursos(){
        return recursoRepository.findAll();
    }

    @Override
    public Recurso actualizarRecurso(Long idRecurso, Recurso recurso) {
        Recurso existente = obtenerRecurso(idRecurso);

        existente.setNombre(recurso.getNombre());
        existente.setDescripcion(recurso.getDescripcion());

        return recursoRepository.save(existente);
    }

    @Override
    public void eliminarRecurso(Long idRecurso) {
        Recurso existente = obtenerRecurso(idRecurso);

        recursoRepository.deleteById(idRecurso);
    }

    // ===============================
    // MÉTODOS PRIVADOS
    // ===============================

    private void validarExistencia(Recurso recurso){

        boolean existeRecurso = obtenerRecursos().stream().anyMatch(r->r.getNombre().equalsIgnoreCase(recurso.getNombre()));

        if(existeRecurso){
            throw new RuntimeException("El recurso "+recurso.getNombre()+" ya existe");
        }

    }

}
