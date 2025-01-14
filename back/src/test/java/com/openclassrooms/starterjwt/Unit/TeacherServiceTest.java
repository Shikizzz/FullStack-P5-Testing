package com.openclassrooms.starterjwt.Unit;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {
    private static TeacherService teacherService;
    @Mock
    private static TeacherRepository teacherRepository;

    @BeforeEach
    private void setUpperTest() {
        teacherService = new TeacherService(teacherRepository);

    }

    @Test
    public void findAllTest(){
        List<Teacher> teachers = new ArrayList<>();
        when(teacherRepository.findAll()).thenReturn(teachers);
        teacherService.findAll();
        verify(teacherRepository, times(1)).findAll();
    }
    @Test
    public void findByIdTest(){
        Long id = new Long(1);
        Teacher teacher = new Teacher();
        Optional<Teacher> optTeacher = Optional.of(teacher);
        when(teacherRepository.findById(id)).thenReturn(optTeacher);
        teacherService.findById(id);
        verify(teacherRepository, times(1)).findById(id);
    }
}
