package com.openclassrooms.starterjwt.Unit;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    private static UserService userService;
    @Mock
    private static UserRepository userRepository;
    Long id;
    @BeforeEach
    private void setUpperTest() {
        userService = new UserService(userRepository);
        id = new Long(1);
    }
    @Test
    public void deleteTest(){
        List<Teacher> teachers = new ArrayList<>();
        doNothing().when(userRepository).deleteById(id);
        userService.delete(id);
        verify(userRepository, times(1)).deleteById(id);
    }
    @Test
    public void findByIdTest(){
        User user = new User();
        Optional<User> optUser = Optional.of(user);
        when(userRepository.findById(id)).thenReturn(optUser);
        userService.findById(id);
        verify(userRepository, times(1)).findById(id);
    }
}
