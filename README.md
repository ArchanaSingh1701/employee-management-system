# Employee Management System

A simple Employee Management System built with Spring Boot, MySQL, and a vanilla HTML/CSS/JavaScript dashboard.

## Prerequisites

- Java 22
- Maven 3.9+
- MySQL 8+

Create a MySQL database named `employee_management_system` before running the application. The application validates the schema by default and does not create or alter tables automatically.

## Configure local credentials

Set these environment variables in your local terminal. Do not commit a password to this repository.

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-local-mysql-password"
```

Optional variables are `DB_URL` and `JPA_DDL_AUTO`. Use `JPA_DDL_AUTO=update` only for intentional local schema changes; do not use it for a shared or production database.

## Run

```powershell
mvn spring-boot:run
```

Open `http://localhost:8080` to use the dashboard.

## Run tests

```powershell
mvn test
```

## API endpoints

- `GET`, `POST` `/api/departments`
- `GET`, `PUT`, `DELETE` `/api/departments/{id}`
- `GET`, `POST` `/api/employees`
- `GET`, `PUT`, `DELETE` `/api/employees/{id}`

Deleting a department that still has employees is intentionally rejected. Delete or reassign its employees first.
