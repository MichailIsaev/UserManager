package com.controllers;

import com.model.User;
import com.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * This is controller for users. There are methods for CRUD operations here.
 * Using Pageable for requests with part of data
 *
 * @version 1.0
 */
@Component
@ComponentScan(basePackages = {"com"})
public class UserController {
    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * This adds an user into the database.
     *
     * @param user
     */
    synchronized public void addUser(User user) {
        userRepository.insert(user);
    }

    /**
     * This gets an user from the database by the email.
     *
     * @param email
     * @return user
     * @see User
     */
    public User getUser(String email) {
        return userRepository.findOne(email);
    }

    /**
     * This gets all users
     *
     * @return all users.
     */
    public List<User> getAllUsers(int page, int size) {
        return userRepository.findAll(new PageRequest(page - 1, size)).getContent();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * This gets users by the name
     *
     * @param name
     * @return users by the name
     */
    public List<User> getUsersByName(String name, int page, int size) {
        return userRepository.getByNameStartingWith(new PageRequest(page - 1, size), name);
    }

    /**
     * This gets users by the description
     *
     * @param description
     * @return users by description
     */
    public List<User> getUsersByDescription(String description, int page, int size) {
        return userRepository.getUsersByDescription(new PageRequest(page - 1, size), description);
    }

    public long sizeOfAllUsers() {
        return userRepository.count();
    }

    public long sizeOfUsersByName(String name) {
        return userRepository.countByNameStartingWith(name);
    }

    public long sizeOfUsersByNameAndEmail(String name, String email) {
        return userRepository.countByNameStartingWithAndEmail(name, email);
    }

    public void updatePassword(String password , String mail){
        User user = userRepository.findOne(mail);
        user.setPassword(password);
        userRepository.delete(mail);
        userRepository.save(user);
    }


    public List<User> getUsersByNameAndEmail(String name, String email, int page, int size) {
        return userRepository.getByNameStartingWithAndEmail(new PageRequest(page - 1, size), name, email);
    }


    synchronized public void deleteUserByEmail(String email) {
        userRepository.delete(email);
    }

    synchronized public void deleteByName(String name) {
        userRepository.deleteUsersByName(name);
    }
}
