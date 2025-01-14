package com.openclassrooms.starterjwt.Unit;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    private static SessionService sessionService;
    @Mock
    private static SessionRepository sessionRepository;
    @Mock
    private static UserRepository userRepository;
    Session session;
    List<User> users;
    @BeforeEach
    private void setUpperTest() {
        sessionService = new SessionService(sessionRepository, userRepository);
        session = new Session();
    }
    @Test
    public void createTest(){
        when(sessionRepository.save(session)).thenReturn(session);
        sessionService.create(session);
        verify(sessionRepository, times(1)).save(session);
    }
    @Test
    public void deleteTest(){
        long id = new Long(1);
        doNothing().when(sessionRepository).deleteById(id);
        sessionService.delete(id);
        verify(sessionRepository, times(1)).deleteById(id);
    }
    @Test
    public void findAllTest(){
        List<Session> sessions = new ArrayList<>();
        when(sessionRepository.findAll()).thenReturn(sessions);
        sessionService.findAll();
        verify(sessionRepository, times(1)).findAll();
    }
    @Test
    public void getByIdTest(){
        long id = new Long(1);
        Optional<Session> optSession = Optional.of(session);
        when(sessionRepository.findById(id)).thenReturn(optSession);
        sessionService.getById(id);
        verify(sessionRepository, times(1)).findById(id);
    }
    @Test
    public void updateTest(){
        long id = new Long(1);
        when(sessionRepository.save(session)).thenReturn(session);
        sessionService.update(id, session);
        verify(sessionRepository, times(1)).save(session);
    }
    @Test
    public void participateTest(){
        long id = new Long(1);
        LocalDateTime now = LocalDateTime.now();
        users = new ArrayList<>();
        Session newSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), users, now,now);
        User newUser = new User(id, "test@test.com", "Doe", "John", "password", false, now,now);
        Optional<Session> optSession = Optional.of(newSession);
        Optional<User> optUser = Optional.of(newUser);
        when(sessionRepository.findById(id)).thenReturn(optSession);
        when(userRepository.findById(id)).thenReturn(optUser);
        when(sessionRepository.save(any())).thenReturn(session);

        sessionService.participate(id, id);

        List<User> notEmptyUsers = new ArrayList<>();
        notEmptyUsers.add(newUser);
        Session modifiedSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), notEmptyUsers, now,now);
        verify(sessionRepository, times(1)).save(any());
        assertEquals(newSession, modifiedSession);
    }
    @Test
    public void alreadyParticipateTest(){
        long id = new Long(1);
        LocalDateTime now = LocalDateTime.now();
        User newUser = new User(id, "test@test.com", "Doe", "John", "password", false, now,now);
        List<User> notEmptyUsers = new ArrayList<>();
        notEmptyUsers.add(newUser);
        Session newSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), notEmptyUsers, now,now);
        Optional<Session> optSession = Optional.of(newSession);
        Optional<User> optUser = Optional.of(newUser);
        when(sessionRepository.findById(id)).thenReturn(optSession);
        when(userRepository.findById(id)).thenReturn(optUser);

        assertThrows(BadRequestException.class, () -> {sessionService.participate(id, id);} );
    }

    @Test
    public void nullUserParticipateTest(){
        long id = new Long(1);
        LocalDateTime now = LocalDateTime.now();
        Session newSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), users, now,now);
        Optional<Session> optSession = Optional.of(newSession);
        Optional<User> optUser = Optional.empty();
        when(sessionRepository.findById(id)).thenReturn(optSession);
        when(userRepository.findById(id)).thenReturn(optUser);

        assertThrows(NotFoundException.class, () -> {sessionService.participate(id, id);} );
    }
    @Test
    public void nullSessionParticipateTest(){
        long id = new Long(1);
        LocalDateTime now = LocalDateTime.now();
        User newUser = new User(id, "test@test.com", "Doe", "John", "password", false, now,now);
        Optional<Session> optSession = Optional.empty();
        Optional<User> optUser = Optional.of(newUser);
        when(sessionRepository.findById(id)).thenReturn(optSession);
        when(userRepository.findById(id)).thenReturn(optUser);

        assertThrows(NotFoundException.class, () -> {sessionService.participate(id, id);} );
    }

    @Test
    public void noLongerParticipateTest(){
        long id = new Long(1);
        LocalDateTime now = LocalDateTime.now();
        List<User> notEmptyList = new ArrayList<>();
        User newUser = new User(id, "test@test.com", "Doe", "John", "password", false, now,now);
        notEmptyList.add(newUser);
        Session newSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), notEmptyList, now,now);
        Optional<Session> optSession = Optional.of(newSession);
        when(sessionRepository.findById(id)).thenReturn(optSession);
        Session noUserSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), users, now,now);
        when(sessionRepository.save(noUserSession)).thenReturn(noUserSession);

        sessionService.noLongerParticipate(id, id);

        verify(sessionRepository, times(1)).save(noUserSession);
        assertEquals(newSession, noUserSession);
    }
    @Test
    public void nullSessionNoLongerParticipateTest(){
        long id = new Long(1);
        Optional<Session> optSession = Optional.empty();
        when(sessionRepository.findById(id)).thenReturn(optSession);

        assertThrows(NotFoundException.class, () -> {sessionService.noLongerParticipate(id, id);} );
    }

    @Test
    public void notparticipatingNoLongerParticipateTest(){
        long id = new Long(1);
        LocalDateTime now = LocalDateTime.now();
        users = new ArrayList<>();
        Session newSession = new Session(id, "TestSession", new Date(), "TestDescription", new Teacher(), users, now,now);
        Optional<Session> optSession = Optional.of(newSession);
        when(sessionRepository.findById(id)).thenReturn(optSession);

        assertThrows(BadRequestException.class, () -> {sessionService.noLongerParticipate(id, id);} );
    }
}
