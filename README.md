# Employee Management System

A full-stack Employee Management System built using Spring Boot, Spring Data JPA, MySQL, and a responsive HTML/CSS/JavaScript frontend. The application provides REST APIs for managing employees and departments with database persistence and centralized exception handling.

## Features

- Employee CRUD operations
- Department CRUD operations
- Employee and department relationship management
- RESTful API architecture
- MySQL database integration
- Spring Data JPA/Hibernate for persistence
- Centralized exception handling
- Validation and meaningful API error responses
- Responsive frontend interface
- Search and manage employee records
- Maven-based project structure

## Tech Stack

### Backend
- Java 22
- Spring Boot 3.5.4
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Database
- MySQL 8+
- MySQL Connector/J

### Frontend
- HTML5
- CSS3
- JavaScript

### Development Tools
- IntelliJ IDEA / VS Code
- MySQL Workbench
- Git
- GitHub

## Architecture

The application follows a layered architecture:

Frontend  
↓  
REST Controllers  
↓  
Service Layer  
↓  
Repository Layer  
↓  
MySQL Database

### Layers

**Controller Layer**

Handles HTTP requests and exposes REST API endpoints for employees and departments.

**Service Layer**

Contains the application's business logic and coordinates operations between controllers and repositories.

**Repository Layer**

Uses Spring Data JPA to communicate with the MySQL database.

**Entity Layer**

Contains JPA entity classes representing database tables such as Employee and Department.

**Exception Layer**

Provides centralized exception handling and structured API error responses.

## Project Structure

```text
employee-management-system/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ems/employeemanagementsystem/
│   │   │       ├── controller/
│   │   │       │   ├── EmployeeController.java
│   │   │       │   └── DepartmentController.java
│   │   │       │
│   │   │       ├── entity/
│   │   │       │   ├── Employee.java
│   │   │       │   └── Department.java
│   │   │       │
│   │   │       ├── repository/
│   │   │       │   ├── EmployeeRepository.java
│   │   │       │   └── DepartmentRepository.java
│   │   │       │
│   │   │       ├── service/
│   │   │       │   ├── EmployeeService.java
│   │   │       │   └── DepartmentService.java
│   │   │       │
│   │   │       ├── exception/
│   │   │       │   ├── ApiError.java
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   └── ResourceNotFoundException.java
│   │   │       │
│   │   │       └── EmployeeManagementSystemApplication.java
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── styles.css
│   │       │   └── app.js
│   │       │
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│
├── pom.xml
├── README.md
└── .gitignore