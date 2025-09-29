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
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/req/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> userPresent(@RequestBody User user) {

        User existingAppUser = userRepository.findByEmail(user.getEmail());
        System.out.println(existingAppUser);

        if (existingAppUser != null) {
            if (!passwordEncoder.matches(user.getPassword(), existingAppUser.getPassword())) {
                System.out.println(existingAppUser.getPassword());
                System.out.println(passwordEncoder.encode(user.getPassword()));
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Please check the password");
            }

            // ✅ Return user object as JSON
            return ResponseEntity.ok(existingAppUser);
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("No User found for these credentials, please register");
    }


}
