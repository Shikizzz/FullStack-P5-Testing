package com.openclassrooms.starterjwt.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;
    private ObjectMapper mapper = new ObjectMapper();

    @WithMockUser("Test")
    @Test
    public void findByIddTest() throws Exception {
        MvcResult result = mvc.perform(get("/api/user/1"))
                .andExpect(status().isOk())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        UserDto user = mapper.readValue(json, UserDto.class);
        assertEquals("yoga@studio.com", user.getEmail());
        assertEquals("Admin", user.getLastName());
        assertEquals("Admin", user.getFirstName());
    }
    @WithMockUser("Test")
    @Test
    public void findByIdNotFoundTest() throws Exception {
        mvc.perform(get("/api/user/999"))
                .andExpect(status().isNotFound());
    }
    @WithMockUser("Test")
    @Test
    public void findByIdBadRequestTest() throws Exception {
        mvc.perform(get("/api/user/notANumber"))
                .andExpect(status().isBadRequest());
    }
    @WithMockUser("yoga@studio.com")
    @Test
    public void deleteTest() throws Exception {
        mvc.perform(delete("/api/user/1"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/user/999")) //Checking if actually deleted from database
                .andExpect(status().isNotFound());
    }
    @WithMockUser("yoga@studio.com")
    @Test
    public void deleteNotFoundTest() throws Exception {
        mvc.perform(delete("/api/user/999"))
                .andExpect(status().isNotFound());
    }
    @WithMockUser("UsernameDifferentFromDeleted")
    @Test
    public void deleteNotOurselvesTest() throws Exception {
        mvc.perform(delete("/api/user/1"))
                .andExpect(status().isUnauthorized());

    }

    @WithMockUser("yoga@studio.com")
    @Test
    public void deleteBadRequestTest() throws Exception {
        mvc.perform(delete("/api/user/notANumber"))
                .andExpect(status().isBadRequest());
    }

}
