package com.controllers;

import com.mailservice.EmailService;
import com.model.User;
import com.model.UserResponse;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.xml.ws.http.HTTPException;
import java.io.IOException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.List;


/**
 * This is rest controller.
 * There are all requests which you can use in web.
 *
 * @version 1.0
 */
@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserRestController {

    private UserController userController;
    private EmailService emailService;

    @Autowired
    public void setUserController(UserController userController) {
        this.userController = userController;
    }

    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Get method for receiving all users.
     *
     * @return all users
     */
    @PreAuthorize("hasAuthority('SUPER_USER')")
    @RequestMapping(method = RequestMethod.GET, params = {"page", "size"})
    @ResponseBody
    public UserResponse getAllUsers(@RequestParam(name = "page") int page,
                                    @RequestParam(name = "size") int size) {

        return new UserResponse(userController.getAllUsers(page, size), userController.sizeOfAllUsers());
    }

    /**
     * Get method for receiving user by email.
     * email is the key for user.
     *
     * @param email
     * @return user by email.
     */
    @RequestMapping(method = RequestMethod.GET, params = {"email"})
    public @ResponseBody
    UserResponse getUserByEmail(@RequestParam("email") String email) {
        return new UserResponse(com.sun.tools.javac.util.List.of(userController.getUser(email)), 1);
    }

    /**
     * Get method for receiving users by name
     *
     * @param name
     * @return users by name
     */
    @PreAuthorize("hasAuthority('SUPER_USER') or hasAuthority('OTHER')")
    @RequestMapping(method = RequestMethod.GET, params = {"name", "page", "size"})
    public @ResponseBody
    UserResponse getUsersByName(@AuthenticationPrincipal User user,
                                @RequestParam("name") String name,
                                @RequestParam(name = "page") int page,
                                @RequestParam(name = "size") int size) {

        List<User> users;
        UserResponse response;

        if (user.getAuthorities().toString().equals("[SUPER_USER]")) {
            users = userController.getUsersByName(name, page, size);
            response = new UserResponse(users, userController.sizeOfUsersByName(name));
        } else {
            users = userController.getUsersByNameAndEmail(name, user.getEmail(), page, size);
            response = new UserResponse(users, userController.sizeOfUsersByNameAndEmail(name, user.getEmail()));
        }

        return response;
    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody
    User addUser(@RequestBody User user) throws ParseException {
        userController.addUser(user);
        emailService.sendSimpleMessage(user.getEmail(), "Your password in our project.", "Password : " + user.getPassword());
        return user;
    }

    @PreAuthorize("hasAuthority('SUPER_USER') or hasAuthority('OTHER')")
    @RequestMapping(method = RequestMethod.PUT, params = {"email" , "password"})
    public void updatePassword(@RequestParam(value = "email") String email,
                               @RequestParam(value = "password") String password) {

        userController.updatePassword(password, email);

    }


    @PreAuthorize("hasAuthority('SUPER_USER')")
    @RequestMapping(method = RequestMethod.DELETE, params = "email")
    public void deleteByEmail(@RequestHeader("Authorization") String auth,
                              @RequestParam(value = "email") String email) {

        try {
            Request deleteRequest = new Request.Builder()
                    .url("http://localhost:44444/tasks?email=" + email)
                    .delete()
                    .addHeader("Authorization", auth)
                    .build();

            OkHttpClient client = new OkHttpClient.Builder().build();
            Response response = client.newCall(deleteRequest).execute();

            if (response.isSuccessful()) {
                userController.deleteUserByEmail(email);
            }

        } catch (HTTPException | IOException e) {
            System.out.println(Arrays.toString(e.getStackTrace()));
        }
    }

}
