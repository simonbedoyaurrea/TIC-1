package com.tic.optimizacionespacios.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tic.optimizacionespacios.models.User;


@Repository
public interface UsuarioRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
