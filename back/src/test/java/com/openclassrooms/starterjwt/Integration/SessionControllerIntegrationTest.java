package com.openclassrooms.starterjwt.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.openclassrooms.starterjwt.dto.SessionDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.sql.Timestamp;
import java.util.Date;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIntegrationTest {
    @Autowired
    private MockMvc mvc;
    private ObjectMapper mapper = new ObjectMapper();
    private ObjectWriter writer;

    @BeforeEach
    public void setup() {
        writer = mapper.writer().withDefaultPrettyPrinter();
    }

    @WithMockUser("Test")
    @Test
    public void findByIdTest() throws Exception {
        mvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("TestSession"))
                .andExpect(jsonPath("$.description").value("TestDescription"))
                .andExpect(jsonPath("$.teacher_id").value(1));
    }
    @WithMockUser("Test")
    @Test
    public void findByIdNotFoundTest() throws Exception {
        mvc.perform(get("/api/session/999"))
                .andExpect(status().isNotFound());
    }
    @WithMockUser("Test")
    @Test
    public void findByIdBadRequestTest() throws Exception {
        mvc.perform(get("/api/session/notANumber"))
                .andExpect(status().isBadRequest());
    }

    @WithMockUser("Test")
    @Test
    public void findAllTest() throws Exception {
        mvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("TestSession"))
                .andExpect(jsonPath("$[1].name").value("SecondSession"));
    }

    @WithMockUser("Test")
    @Test
    public void createTest() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("NewSession");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(new Long(1));
        sessionDto.setDescription("NewDescription");
        String requestJson = writer.writeValueAsString(sessionDto);
        mvc.perform(post("/api/session").contentType(APPLICATION_JSON_UTF8)
                        .content(requestJson))
                .andExpect(jsonPath("$.name").value("NewSession"))
                .andExpect(jsonPath("$.date").exists())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.description").value("NewDescription"));
    }
    @WithMockUser("Test")
    @Test
    public void createInvalidTest() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("NewSession");
        String requestJson = writer.writeValueAsString(sessionDto);
        mvc.perform(post("/api/session").contentType(APPLICATION_JSON_UTF8)
                        .content(requestJson))
                .andExpect(status().isBadRequest());
    }
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @WithMockUser("Test")
    @Test
    public void updateTest() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("UpdatedSession");
        long time = new Date().getTime();
        sessionDto.setDate(new Timestamp(time));
        sessionDto.setTeacher_id(new Long(1));
        sessionDto.setDescription("UpdatedDescription");
        String requestJson = writer.writeValueAsString(sessionDto);
        mvc.perform(MockMvcRequestBuilders.put("/api/session/2").contentType(APPLICATION_JSON_UTF8)
                        .content(requestJson))
                .andExpect(status().isOk());
        mvc.perform(get("/api/session/2"))//we verify if session is modified in DB
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("UpdatedSession"))
                .andExpect(jsonPath("$.description").value("UpdatedDescription"));
    }
    @WithMockUser("Test")
    @Test
    public void updateBadRequestTest() throws Exception {
        SessionDto sessionDto = new SessionDto();
        String requestJson = writer.writeValueAsString(sessionDto);
        mvc.perform(MockMvcRequestBuilders.put("/api/session/notANumber").contentType(APPLICATION_JSON_UTF8)
                        .content(requestJson))
                .andExpect(status().isBadRequest());
    }
    @WithMockUser("Test")
    @Test
    public void updateOtherBadRequestTest() throws Exception {
        SessionDto sessionDto = new SessionDto();
        String requestJson = writer.writeValueAsString(sessionDto);
        mvc.perform(MockMvcRequestBuilders.put("/api/session/999").contentType(APPLICATION_JSON_UTF8)
                        .content(requestJson))
                .andExpect(status().isBadRequest());
    }

    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @WithMockUser("Test")
    @Test
    public void deleteTest() throws Exception {
        mvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/session/1"))
                .andExpect(status().isNotFound());
    }
    @WithMockUser("Test")
    @Test
    public void deleteNotFoundTest() throws Exception {
        mvc.perform(delete("/api/session/999"))
                .andExpect(status().isNotFound());
    }
    @WithMockUser("Test")
    @Test
    public void deleteBadRequestTest() throws Exception {
        mvc.perform(delete("/api/session/notANumber"))
                .andExpect(status().isBadRequest());
    }
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @WithMockUser("Test")
    @Test
    public void participateAndNoLongerParticipateTest() throws Exception {
        mvc.perform(post("/api/session/1/participate/1"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users[0]").value(1));
        mvc.perform(delete("/api/session/1/participate/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users").doesNotExist());
    }


}
