package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Model.User;
import com.example.demo.Model.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.utils.JwtTokenUtil;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Step 1: User requests password reset -> Send email with reset link
     */
    @PostMapping("/req/forgot-password")
    public ResponseEntity<?> sendForgotPassword(@RequestParam("email") String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with this email.");
        }

        // Generate JWT token for reset (valid for e.g., 15 minutes)
        String token = jwtUtil.generateToken(email);

        // Save token to DB for extra validation
        user.setVerficationToken(token);
        userRepository.save(user);



        // Send email
        emailService.sendForgotPasswordEmail(email, token);

        return ResponseEntity.ok("Password reset email sent to " + email);
    }

    /**
     * Step 2: User clicks link -> Verify token -> Reset password
     */
    @PostMapping("/req/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("token") String token,
            @RequestParam("newPassword") String newPassword) {

        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email);

        if (user == null || user.getVerficationToken() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token!");
        }

        if (!jwtUtil.validateToken(token) || !user.getVerficationToken().equals(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token!");
        }

        // Securely hash the new password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear token after reset
        user.setVerficationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully!");
    }
}
