package com.openclassrooms.starterjwt.Unit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class JwtUtilsTest {
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private MockMvc mvc;

    @Test
    public void generateTokenTest(){
        UserDetails principal = userDetailsService.loadUserByUsername("yoga@studio.com");
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, principal.getPassword(), principal.getAuthorities());
        String newToken = jwtUtils.generateJwtToken(authentication);

        assertTrue(jwtUtils.validateJwtToken(newToken));
    }
    @Test
    public void getUserNameFromJwtTokenTest(){
        //Generating token
        UserDetails principal = userDetailsService.loadUserByUsername("yoga@studio.com");
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, principal.getPassword(), principal.getAuthorities());
        String newToken = jwtUtils.generateJwtToken(authentication);

        String userName = jwtUtils.getUserNameFromJwtToken(newToken);

        assertEquals("yoga@studio.com", userName);
    }


    @Test
    public void validTokenTest() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter writer = mapper.writer().withDefaultPrettyPrinter();
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("yoga@studio.com");
        loginRequest.setPassword("test!1234");
        String requestJson = writer.writeValueAsString(loginRequest);
        MvcResult result = mvc.perform(post("/api/auth/login").contentType(APPLICATION_JSON_UTF8)
                        .content(requestJson))
                .andReturn();
        String json = result.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper();
        JwtResponse response = objectMapper.readValue(json, JwtResponse.class);
        String token = response.getToken();

        Boolean validated = jwtUtils.validateJwtToken(token);
        assertTrue(validated);
    }
    @Test
    public void unvalidTokenTest(){
        Boolean validated = jwtUtils.validateJwtToken("unvalidToken");
        assertFalse(validated);
    }
}
