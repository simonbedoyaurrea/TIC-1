package com.tic.optimizacionespacios.auth;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;



@Service
public class JwtService {
    
    private final SecretKey key;

    private final Long expMinutes;

    //constructor : los parametros son traidos desde el propierties
    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.exp-minutes}") long expMinutes
    ){
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expMinutes= expMinutes;
    }

    // genera el token 
    public String generate(String subject,Map<String,Object> claims){
       
        Instant now = Instant.now();
        
       
        Instant exp = now.plusSeconds(expMinutes * 60);
        
        
        return Jwts.builder()
                .setSubject(subject)              
                .addClaims(claims)                 
                .setIssuedAt(Date.from(now))      
                .setExpiration(Date.from(exp))    
                .signWith(key, SignatureAlgorithm.HS256) 
                .compact();                      
    }
}
