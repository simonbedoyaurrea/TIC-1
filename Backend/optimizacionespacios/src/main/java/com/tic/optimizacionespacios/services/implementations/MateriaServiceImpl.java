package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Materia;
import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.repositories.MateriaRepository;
import com.tic.optimizacionespacios.services.interfaces.MateriaService;
import com.tic.optimizacionespacios.services.interfaces.RecursoService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class MateriaServiceImpl implements MateriaService {
    private final MateriaRepository materiaRepository;
    private final RecursoService recursoService;

    public MateriaServiceImpl(MateriaRepository materiaRepository, RecursoService recursoService) {
        this.materiaRepository = materiaRepository;
        this.recursoService = recursoService;
    }

    @Override
    public Materia crearMateria(Materia materia){
        validarExistencia(materia);
        return materia;
    }

    @Override
    public Materia obtenerMateria(Long idMateria){
        return materiaRepository.findById(idMateria).
                orElseThrow(() -> new RuntimeException("Materia no encontrado"));
    }

    @Override
    public List<Materia> obtenerMaterias(){
        return materiaRepository.findAll();
    }

    @Override
    public void agregarRecurso(Long idMateria, Long idRecurso){
        Materia materia = obtenerMateria(idMateria);
        Recurso recurso = recursoService.obtenerRecurso(idRecurso);

        materia.getRecursosNecesarios().add(recurso);
        materiaRepository.save(materia);
    }

    @Override
    public void eliminarRecurso(Long idMateria, Long idRecurso){
        Materia materia = obtenerMateria(idMateria);
        Recurso recurso = recursoService.obtenerRecurso(idRecurso);

        materia.getRecursosNecesarios().remove(recurso);
        materiaRepository.save(materia);
    }

    @Override
    public Materia actualizarMateria(Long idMateria, Materia materia) {
        Materia existente = obtenerMateria(idMateria);

        existente.setCodigo(materia.getCodigo());
        existente.setNombre(materia.getNombre());
        existente.setCreditos(materia.getCreditos());
        existente.setRecursosNecesarios(materia.getRecursosNecesarios());

        return materiaRepository.save(existente);

    }

    @Override
    public void eliminarMateria(Long idMateria){
        Materia materia = obtenerMateria(idMateria);
        materia.setActivo(false);
        materiaRepository.save(materia);
    }

    // ===============================
    // MÉTODOS PRIVADOS
    // ===============================

    private void validarExistencia(Materia materia){

        boolean existeMateria = obtenerMaterias().stream().anyMatch(m->m.getNombre().equalsIgnoreCase(materia.getNombre()));

        if(existeMateria){
            throw new RuntimeException("La materia "+materia.getNombre()+" ya existe");
        }

    }
}
