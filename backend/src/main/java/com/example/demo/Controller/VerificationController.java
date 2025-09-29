package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.User;
import com.example.demo.Model.UserRepository;
import com.example.demo.utils.JwtTokenUtil;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class VerificationController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenUtil jwtUtil;
     
    @GetMapping("/req/signup/verify")
    public ResponseEntity verifyEmail(@RequestParam("token") String token) {
        String emailString = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(emailString);
        if (user == null || user.getVerficationToken() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token Expired!");
        }
        
        if (!jwtUtil.validateToken(token) || !user.getVerficationToken().equals(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token Expired!");
        }
        user.setVerficationToken(null);
        user.setVerified(true);  
        userRepository.save(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body("Email successfully verified!");
    }
    
    
}

