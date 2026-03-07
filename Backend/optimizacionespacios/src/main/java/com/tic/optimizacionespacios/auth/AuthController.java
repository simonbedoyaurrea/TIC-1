package com.tic.optimizacionespacios.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthService.LoginResponse> Login(@RequestBody LoginRequest body ){
        var res = authService.Login(body.email(),body.password());
        return ResponseEntity.ok(res);
    }

    @ExceptionHandler(AuthService.AuthException.class)
    public ResponseEntity<?> handleBadCreds(AuthService.AuthException ex){
        return ResponseEntity.status(401).body(new ErrorMsg(ex.getMessage()));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<?> handleDisabled(DisabledException ex){
        return ResponseEntity.status(403).body(new ErrorMsg(ex.getMessage()));
    }

    public record LoginRequest(String email, String password) {}
    public record ErrorMsg(String message){}
    public static class DisabledException extends RuntimeException {
        public DisabledException(String m){ super(m); }
    }

}
