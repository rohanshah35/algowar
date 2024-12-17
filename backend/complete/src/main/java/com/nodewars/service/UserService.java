package com.nodewars.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nodewars.model.User;
import com.nodewars.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(String email, String cognitoUserId, String username, String password) {
        User user = new User(email, cognitoUserId, username, password);

        return userRepository.save(user);
    }
}
