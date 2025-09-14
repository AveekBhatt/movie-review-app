# movie-review-app

Backend : -

1. Core Technology & Setup

    Runtime: Node.js

    Package Management: npm (evidenced by package.json and package-lock.json)

    Entry Point: index.js - This is the main file that starts the server and ties everything together.

    Environment Configuration: .env - Stores sensitive configuration like database passwords, API keys, and JWT secrets.

    Database Configuration: config.json - Likely the configuration file for Sequelize (an ORM for databases like PostgreSQL, MySQL, etc.).

2. Architecture Pattern: MVC

The code is organized into three main components:

    Models: Define the data structure and interact with the database.

    Controllers: Contain the logic for handling requests and sending responses.

3. Models (./models/) - The Data Layer

These files define the database tables and their relationships.

    usermodel.js: Defines the User table (e.g., id, username, email, password).

    Moviemodel.js: Defines the Movie table (e.g., id, title, year, director, poster_url).

    Reviewmodel.js: Defines the Review table, which likely has a relationship to both User and Movie (e.g., id, rating, comment, userId, movieId).

    Watchlistmodel.js: Defines a user's watchlist, a many-to-many relationship between Users and Movies (e.g., id, userId, movieId).

4. Controllers (./controllers/) - The Business Logic Layer

These files contain functions that handle the application's logic for specific routes.

    authController.js: Handles user authentication logic (e.g., registerUser, loginUser, logoutUser).

    userController.js: Handles user profile management (e.g., getUserProfile, updateUserProfile).

    movieController.js: Handles movie-related actions (e.g., getAllMovies, getMovieById, searchMovies).

5. Middleware (./controllers/middleware/) - The Security Layer

Middleware functions sit between a request and the final controller, often used for checks and validation.

    authMiddleware.js: Contains crucial security functions:

        authenticateToken: Verifies a JWT (JSON Web Token) to protect routes. Only logged-in users with a valid token can access certain endpoints (e.g., adding a review).

        authorizeUser: Checks if the logged-in user has permission to perform an action (e.g., can only delete their own reviews).

6. Routes (./routes/) - The API Endpoints

These files define the available URL paths (endpoints) and link them to the controller functions.

    authroutes.js: Defines routes like POST /api/auth/register, POST /api/auth/login.

    useroutes.js: Defines routes like GET /api/users/profile, PUT /api/users/profile. These are likely protected by the auth middleware.

    movieroutes.js: Defines routes like:

        GET /api/movies (public - get all movies)

        GET /api/movies/:id (public - get one movie)

        POST /api/movies/:id/reviews (protected - add a review to a movie)

7. Dependencies (node_modules/)

This folder contains all the third-party libraries (like express, jsonwebtoken, bcrypt, sequelize) installed via npm install. It is auto-generated and not included in version control.
