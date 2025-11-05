package com.saar.mms.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

    // Secret key used to sign the JWT (taken from application.properties)
    // This should be kept private and strong enough (at least 32 characters)
    @Value("${jwt.secret}")
    private String secret;

    // Token validity period (10 hours in milliseconds)
    private static final long JWT_EXPIRATION = 1000 * 60 * 60 * 10;

    // Generate a JWT token for a given username
    public String generateToken(String username) {
        // You can include additional information in claims if needed
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    // Create the JWT token using claims, subject (username), and expiry time
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims) // extra information (optional)
                .setSubject(subject) // main identifier (usually email or username)
                .setIssuedAt(new Date(System.currentTimeMillis())) // issue time
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)) // expiration time
                .signWith(SignatureAlgorithm.HS256, secret) // sign the token with the secret key
                .compact(); // build and return the token
    }

    // Extract the username (subject) stored inside the JWT token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract the expiration date from the JWT token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract any specific claim from the token using a function
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parse the entire JWT token and get all claims (data stored in it)
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret) // use the same secret key used during token creation
                .parseClaimsJws(token) // parse the token
                .getBody(); // extract the claims (payload)
    }

    // Check whether the token has expired or not
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate the token
    // It checks if the username matches and if the token is not expired
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
