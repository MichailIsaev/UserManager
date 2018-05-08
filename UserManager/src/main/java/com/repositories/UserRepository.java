package com.repositories;

import com.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * This interface is for the mongo repository.
 */

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    List<User> getByNameStartingWith(Pageable pageable, String name);

    List<User> getUsersByDescription(Pageable pageable, String description);

    Optional<UserDetails> getByEmail(String email);

    long countByNameStartingWith(String name);

    void deleteUsersByName(String name);

    long countByNameStartingWithAndEmail(String name , String email);

    List<User> getByNameStartingWithAndEmail(Pageable pageable, String name , String email);


}
