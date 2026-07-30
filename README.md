# Reservation de Salles (Room Reservation System)

A full-stack room reservation application with **Spring Boot** (backend) and **Angular 20** (frontend).

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 24, Spring Boot 3.5.4, Spring Security, JPA/Hibernate |
| **Frontend** | Angular 20.3.3, TypeScript 5.9, Chart.js |
| **Database** | PostgreSQL |
| **Auth** | JWT (jjwt 0.11.5), BCrypt |

## Features

- **Two roles:** CLIENT and ADMIN
- **Clients:** Browse rooms, create/edit/delete their reservations, view history
- **Admins:** Full CRUD on rooms and users, manage all reservations, dashboard with stats (user/room counts, active/expired reservations), audit logs
- **Default admin:** `admin@gmail.com` / `adminadmin` (auto-created on first startup)

## Prerequisites

- Java 24
- Node.js
- PostgreSQL (database: `reservation_salles`, user: `postgres`)

## Run Locally

### Backend (port 8081)

```powershell
cd back
.\mvnw.cmd spring-boot:run
```

### Frontend (port 4200)

```powershell
cd front/salle-reservation-frontend
npm install
npm start
```

The dev server at `http://localhost:4200` proxies `/api` requests to the backend.
