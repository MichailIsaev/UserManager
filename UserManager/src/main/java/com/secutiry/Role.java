package com.secutiry;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    SUPER_USER, OTHER;

    @Override
    public String getAuthority() {
        return name();
    }
}
