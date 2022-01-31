# clroot-express-boilerplate

A boilerplate/starter project for quickly building REST APIs using Node.js, Express.js, and Sequelize ORM.

## Project Structure

```text
/src
├── __test__        # Test code
│   ├── api
│   ├── lib
│   ├── models
│   └── service
├── api             # controller layer
│   ├── admin
│   ├── auth
│   └── user
├── dto             # DTOs
├── exception       # custom exceptions
├── lib             # utility classes and functions
├── models          # sequelize orm models (data layers)
└── service         # Business logic (service layers)
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to http://localhost:4000/api/v1/docs
in your browser. This documentation page is automatically generated using the swagger definitions written as comments in
the controller layer and DTO classes.