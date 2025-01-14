package com.openclassrooms.starterjwt.Unit;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {
    @InjectMocks
    private static UserDetailsServiceImpl userDetailsService;
    @Mock
    private static UserRepository userRepository;
    @Test
    public void userFoundLoadUserByUsernameTest(){
        User user = new User();
        user.setId(new Long(1));
        user.setEmail("test@test.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password");
        Optional<User> optUser = Optional.of(user);
        when(userRepository.findByEmail("test@test.com")).thenReturn(optUser);
        UserDetails userDetails = userDetailsService.loadUserByUsername("test@test.com");
        assertEquals("test@test.com", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
    }
    @Test
    public void userNotFoundLoadUserByUsernameTest(){
        Optional<User> optUser = Optional.empty();
        when(userRepository.findByEmail("test@test.com")).thenReturn(optUser);
        assertThrowsExactly(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("test@test.com"));
    }
}
