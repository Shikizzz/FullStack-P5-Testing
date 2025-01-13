package com.openclassrooms.starterjwt.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerIntegrationTest {

    @Autowired
    private WebApplicationContext applicationContext;
    @Autowired
    private MockMvc mvc;
    private ObjectMapper mapper = new ObjectMapper();

    @WithMockUser("Test")
    @Test
    public void findByIdTest() throws Exception {
        MvcResult result = mvc.perform(get("/api/teacher/1"))
                .andExpect(status().isOk())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        TeacherDto teacher = mapper.readValue(json, TeacherDto.class);
        assertTrue(teacher.getLastName().equals("DELAHAYE") && teacher.getFirstName().equals("Margot"));
    }
    @WithMockUser("Test")
    @Test
    public void findByIdNotFoundTest() throws Exception {
        mvc.perform(get("/api/teacher/999"))
                .andExpect(status().isNotFound());
    }
    @WithMockUser("Test")
    @Test
    public void findByIdBadRequestTest() throws Exception {
        mvc.perform(get("/api/teacher/notANumber"))
                .andExpect(status().isBadRequest());
    }

    @WithMockUser("Test")
    @Test
    public void findAllTest() throws Exception {
        MvcResult result = mvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        List<TeacherDto> teachers = mapper.readerForListOf(TeacherDto.class).readValue(json);
        assertEquals(teachers.size(), 2);
        assertTrue(teachers.get(0).getLastName().equals("DELAHAYE") && teachers.get(1).getLastName().equals("THIERCELIN"));
    }

}
