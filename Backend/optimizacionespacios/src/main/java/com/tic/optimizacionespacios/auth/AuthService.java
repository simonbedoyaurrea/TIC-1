package com.tic.optimizacionespacios.auth;

import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tic.optimizacionespacios.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwt;
    private final BCryptPasswordEncoder encoder = new  BCryptPasswordEncoder();
    
    // record para guardar los datos que devuelve el login 
    public record LoginResponse(String token, String role,Integer id){}

    //servicio de login 
    public LoginResponse Login(String email,String password){
        var usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new AuthException("usuario no encontrado"));

        if(!encoder.matches(password,usuario.getPassword())){
            throw new AuthException("credenciales invalidas");
        }

        String token = jwt.generate(usuario.getEmail(), Map.of("role", usuario.getRol().name()));
        return new LoginResponse(token, usuario.getRol().name(),usuario.getId());
    }

    public static class AuthException extends RuntimeException {
        public AuthException(String m){ super(m); }
    }
}
