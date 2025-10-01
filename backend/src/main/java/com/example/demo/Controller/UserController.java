package com.example.demo.Controller;

import com.example.demo.Model.User;
import com.example.demo.Model.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/req/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;


    @GetMapping("/{username}")
    public ResponseEntity<Optional<User>> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userRepository.findByUsername(username));
    }
    @PutMapping("/{username}/become-seller")
    public ResponseEntity<?> becomeSeller(@PathVariable String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setIsSeller(true);   // activate seller role
        userRepository.save(user);

        return ResponseEntity.ok("User " + username + " is now a seller.");
    }

}

