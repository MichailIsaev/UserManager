package com.model;

import com.secutiry.Role;
import lombok.Data;
import lombok.Setter;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

/**
 * This class describes a user.
 * The class implements special interface what describes authentication object
 * @see UserDetails
 */

@Component
@ComponentScan(basePackages = "com")
@Document(collection = "users")
@Data
public class User implements UserDetails  {

    @Setter
    private List<Role> authorities;

    private boolean isAccountNonExpired, isAccountNonLocked, isCredentialsNonExpired, isEnabled;

    private String name;

    public String getEmail() {
        return email;
    }

    @Id
    private String email;

    private String description;

    public void setAuthorities(List<Role> authorities) {
        this.authorities = authorities;
    }

    public void setAccountNonExpired(boolean accountNonExpired) {
        isAccountNonExpired = accountNonExpired;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        isAccountNonLocked = accountNonLocked;
    }

    public void setCredentialsNonExpired(boolean credentialsNonExpired) {
        isCredentialsNonExpired = credentialsNonExpired;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    private String password;

    public Collection<Role> getAuthorities() {
        return authorities;
    }


    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return email;
    }


    public boolean isAccountNonExpired() {
        return true;//isAccountNonExpired;
    }

    public boolean isAccountNonLocked() {
        return true;//isAccountNonLocked;
    }

    public boolean isCredentialsNonExpired() {
        return true;// isCredentialsNonExpired;
    }

    public boolean isEnabled() {
        return true;
    }
}

