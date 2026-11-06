package com.example.airline.entity;

import java.util.Set;

public enum Role {
    SUPER_ADMIN(Set.of(
            Permissions.ADMIN_CREATE,
            Permissions.FLIGHT_CREATE, Permissions.FLIGHT_READ, Permissions.FLIGHT_UPDATE, Permissions.FLIGHT_DELETE,
            Permissions.AIRLINE_CREATE, Permissions.AIRLINE_READ, Permissions.AIRLINE_UPDATE, Permissions.AIRLINE_DELETE
    )),
    ADMIN(Set.of(
            Permissions.FLIGHT_CREATE, Permissions.FLIGHT_READ, Permissions.FLIGHT_UPDATE, Permissions.FLIGHT_DELETE,
            Permissions.AIRLINE_CREATE, Permissions.AIRLINE_READ, Permissions.AIRLINE_UPDATE, Permissions.AIRLINE_DELETE
    )),
    USER(Set.of(Permissions.FLIGHT_READ, Permissions.AIRLINE_READ));

    private final Set<Permissions> permissions;

    Role(Set<Permissions> permissions) { this.permissions = permissions; }
    public Set<Permissions> getPermissions() { return permissions; }
}