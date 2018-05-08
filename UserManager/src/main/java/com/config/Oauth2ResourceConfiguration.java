package com.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.web.session.SessionManagementFilter;

@Configuration
@EnableResourceServer
public class Oauth2ResourceConfiguration extends ResourceServerConfigurerAdapter {

    private CorsSettingsFilter corsSettingsFilter;

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources
                .resourceId("resource");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(corsSettingsFilter, SessionManagementFilter.class)
                .anonymous().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS).permitAll();
                //.antMatchers("/users/**").access("hasAuthority('SUPER_USER')");
    }

    @Autowired
    public void setCorsSettingsFilter(CorsSettingsFilter corsSettingsFilter) {
        this.corsSettingsFilter = corsSettingsFilter;
    }
}
