package com.openclassrooms.starterjwt.Unit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class JwtUtilsTest {
    private static JwtUtils jwtUtils;
    @Autowired
    private MockMvc mvc;
    String token;

    @BeforeEach
    private void setUpperTest() throws Exception {
        jwtUtils = new JwtUtils();

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
        token = "Bearer " + response.getToken();
    }
/*
    @Test
    @WithMockUser("Test")
    public void generateJwtTokenTest(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String response = jwtUtils.generateJwtToken(authentication);
        assertTrue(response.length()>10); //token is a long string
    }*/

    @Test
    public void validateTokenTest(){
        Boolean validated = jwtUtils.validateJwtToken(token);
        assertTrue(validated);
    }
}
