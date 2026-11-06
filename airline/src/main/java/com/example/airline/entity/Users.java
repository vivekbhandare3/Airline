package com.example.airline.entity;
import com.example.airline.entity.type.AuthProviderType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = true)
    private String password;
    @Builder.Default
    private boolean active = true;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Builder.Default
    private boolean blocked = false;
    private String providerId;
    @Enumerated(EnumType.STRING)
    private AuthProviderType providerType;
    @Column(nullable = false)
    private String email;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities=new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_"+role.name()));
        Set<SimpleGrantedAuthority> permissionsAuthorities=role.getPermissions().stream()
                .map(permissions -> new SimpleGrantedAuthority(permissions.name()))
                .collect(Collectors.toSet());
        authorities.addAll(permissionsAuthorities);
        return authorities;
    }


}