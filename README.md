# Real-world class grading App

A real-world class grading application built with Prisma.

The grading application is used to manage enrollment in online classes, tests (as in exams) for classes, and test results.

The goal if this application is to showcase a real-world scenario of an application using Prisma. the following aspects of Prisma

- Data modeling
- CRUD
- Aggregations
- API layer
- Validation
- Testing
- Authentication
- Authorization
- Integration with other APIs
- Deployment

## Data model

The development of this project is driven by the database schema (also known as the data model).
The schema is first designed to represent the following concepts:

- **User**: this can be a student or a teacher, or both. The role of the user is determined through their association with a course.
- **Course**: represent a course that can have multiple students/teachers. Each user can be associated with multiple courses either as a student or as a teacher.
- **Test**: Each course can have many tests
- **TestResult**: Each Test can have many TestReusults that is associated with a student

These are defined in the [Prisma schema](./prisma/schema.prisma).
The database schema will be created by Prisma Migrate.

## Tech Stack

- Backend:
  - PostgreSQL
  - Node.js
  - Prisma
  - TypeScript
  - Jest

## How to use

Install npm dependencies:

```
npm install
```

## Course

- [Part 1](https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-data-modeling-tsjs1ps7kip1?utm_source=youtube&utm_medium=youtube&utm_campaign=modern-backend-series) - Data Modeling, CRUD and Aggregations
- [Part 2](https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-rest-api-validation-dcba1ps7kip3) - REST, Validation, and Testing
- [Part 3](https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-auth-mngp1ps7kip4) - Authentication & Authorization
