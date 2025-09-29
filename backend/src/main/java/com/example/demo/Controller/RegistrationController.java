package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.User;
import com.example.demo.Model.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.utils.JwtTokenUtil;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class RegistrationController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    
    @PostMapping(value = "/req/signup", consumes = "application/json")
    public ResponseEntity<String> createUser(@RequestBody User user){
        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            return new ResponseEntity<>("Username not available", HttpStatus.BAD_REQUEST);
        }
        User existingAppUser = userRepository.findByEmail(user.getEmail());
        System.out.println(existingAppUser);
        if(existingAppUser != null){
            if(existingAppUser.isVerified()){
                return new ResponseEntity<>("User Already exist and Verified.",HttpStatus.BAD_REQUEST);
            }else{
                String verificationToken = JwtTokenUtil.generateToken(existingAppUser.getEmail());
                existingAppUser.setVerficationToken(verificationToken);
                userRepository.save(existingAppUser);
                //Send Email Code
                emailService.sendVerificationEmail(existingAppUser.getEmail(), verificationToken);
                return new ResponseEntity<>("Verification Email resent. Check your inbox",HttpStatus.OK);
            }
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        String vericationToken =JwtTokenUtil.generateToken(user.getEmail());
        user.setVerficationToken(vericationToken);
        userRepository.save(user);
        //Send Email Code
        emailService.sendVerificationEmail(user.getEmail(), vericationToken);
        
        return new ResponseEntity<>("Registration successfull! Please Verify your Email", HttpStatus.OK);
    }
    
}
