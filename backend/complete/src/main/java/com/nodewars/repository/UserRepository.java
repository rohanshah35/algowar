package com.nodewars.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nodewars.model.User;

/**
 * UserRepository is an interface that extends JpaRepository to provide CRUD operations 
 * for User entities. It is annotated with @Repository to indicate that it is a Spring 
 * Data repository.
 * 
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.username = :username")
    User findByUsername(String username);
}
