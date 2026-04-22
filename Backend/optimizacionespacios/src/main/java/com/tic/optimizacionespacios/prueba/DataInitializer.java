// package com.tic.optimizacionespacios.prueba;

// import com.tic.optimizacionespacios.enums.Rol;
// import com.tic.optimizacionespacios.models.User;
// import com.tic.optimizacionespacios.repositories.UsuarioRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import java.time.LocalDateTime;
// import java.util.List;

// //Esta clase sirve para crear usuarios de prueba
// @Configuration
// public class DataInitializer {

//     @Bean
//     CommandLineRunner initUsers(UsuarioRepository userRepo) {
//         return args -> {
//             BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

//             if (userRepo.count() == 0) { // solo si no hay usuarios
//                 User admin = User.builder()
//                         .email("admin@test.com")
//                         .nombre("Admin")
//                         .rol(Rol.ADMINISTRATIVO)
//                         .password(encoder.encode("admin123")) // contraseña clara -> hash
//                         .fechaRegistro(LocalDateTime.now())
//                         .build();

//                 User docente = User.builder()
//                         .email("docente@test.com")
//                         .nombre("Docente")
//                         .rol(Rol.DOCENTE)
//                         .password(encoder.encode("docente123"))
//                         .fechaRegistro(LocalDateTime.now())
//                         .build();

//                 User estudiante = User.builder()
//                         .email("estudiante@test.com")
//                         .nombre("Estudiante")
//                         .rol(Rol.ESTUDIANTE)
//                         .password(encoder.encode("estudiante123"))
//                         .fechaRegistro(LocalDateTime.now())
//                         .build();

//                 userRepo.saveAll(List.of(admin, docente, estudiante));
//                 System.out.println("Usuarios iniciales creados");
//             }
//         };
//     }
// }