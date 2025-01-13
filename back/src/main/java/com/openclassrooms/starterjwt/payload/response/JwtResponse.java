package com.openclassrooms.starterjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private String firstName;
  private String lastName;

  private Boolean admin;

  public JwtResponse(String accessToken, Long id, String username,String firstName, String lastName, Boolean admin) {
    this.token = accessToken;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.admin = admin;
  }
}
