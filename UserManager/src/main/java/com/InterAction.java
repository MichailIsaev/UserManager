package com;

import com.controllers.UserController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;


@SpringBootApplication
@Component("InterAction")
@ComponentScan(basePackages = "com")
public class InterAction {

    public static ApplicationContext context;
    private UserController controller;

    @Autowired
    public InterAction(UserController controller) {
        this.controller = controller;
    }

    public static void main(String[] args) {
        context = SpringApplication.run(InterAction.class);
        InterAction interAction = (InterAction) (context.getBean("InterAction"));
        interAction.work();
    }

    public void work() {
        /*User test = new User();
        test.setPassword("pass");
        test.setEmail("mail");
        test.setName("name");
        test.setDescription("description");
        test.setAccountNonLocked(true);
        test.setCredentialsNonExpired(true);
        test.setAccountNonExpired(true);
        test.setEnabled(true);
        test.setAuthorities(List.from(new Role[]{Role.SUPER_USER}));
        controller.addUser(test);
        test = null;
        test = new User();
        test.setPassword("pass");
        test.setEmail("other_mail");
        test.setName("name");
        test.setDescription("description");
        test.setAccountNonLocked(true);
        test.setCredentialsNonExpired(true);
        test.setAccountNonExpired(true);
        test.setEnabled(true);
        test.setAuthorities(List.from(new Role[]{Role.OTHER}));
        controller.addUser(test);*/
        System.out.println("I`m working.");
    }

    public void clean() {
        //controller.deleteUserByEmail("mail");
    }
}
