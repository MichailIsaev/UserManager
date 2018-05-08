package com.model;


import java.util.List;

public class UserResponse {
    private long size;
    private List<User> users;

    public UserResponse(List<User> users , long size){
        this.size = size;
        this.users = users;
    }
    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

}
