package com.controllers;

import com.InterAction;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.client.test.OAuth2ContextConfiguration;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(UserRestController.class)
@ContextConfiguration(classes = {InterAction.class})
@OAuth2ContextConfiguration()

public class UserRestControllerTest {

    private String path = "http://localhost:55555/";

    private MockMvc mockMvc;

    @MockBean
    private UserRestController userRestController;


    @Autowired
    public void setMockMvc(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }


    @Test
    public void getUsersWithoutAuth() throws Exception {
        mockMvc.perform(
                MockMvcRequestBuilders.
                        get(path + "/users").
                        param("page", "1").
                        param("size", "10")).
                andExpect(status().isUnauthorized()
                );
    }

    @Test
    @WithMockUser(username = "mail", password = "pass")
    public void getUsersWithAuth() throws Exception {
        mockMvc.perform(
                MockMvcRequestBuilders.
                        get(path + "/users").
                        param("page", "1").
                        param("size", "10")).
                andExpect(status().isOk()
                );
    }


}