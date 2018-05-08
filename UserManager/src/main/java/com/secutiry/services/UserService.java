package com.secutiry.services;

import com.model.User;
import com.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


/**
 * Describes receiving user`s data by username
 * Needs for authentication process
 *
 * @see User
 */

@Service
public class UserService implements UserDetailsService {

    private User user;

    private UserRepository repository;

    @Autowired
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.getByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Autowired
    public void setUser(User user) {
        this.user = user;
    }
}
