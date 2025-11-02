# Sweet Shop Management System

This is a full-stack web application designed for managing a sweet shop's inventory, built as a TDD (Test-Driven Development) Kata.This project demonstrates proficiency in backend API development, database management, frontend implementation, and testing, adhering to the "Clean Coding Practices" and TDD workflow requirements.

The application is built with a **NestJS/TypeScript** backend with a **MongoDB** database, and a **React** single-page application (SPA) frontend.

## Core Features

- **Authentication & Security**
  - User registration and login using **JWT (JSON Web Tokens)**.
  - Role-based access control (`User` vs. `Admin`).
- **Sweets Management (Admin Only)**
  _ **POST /api/sweets**: Add a new sweet.
  _ **PUT /api/sweets/:id**: Update sweet details. \* **DELETE /api/sweets/:id**: Delete a sweet.
  **\*Inventory Management**
  _ **POST /api/sweets/:id/purchase**: Decrease sweet quantity (User access).
  _ **POST /api/sweets/:id/restock**: Increase sweet quantity (**Admin Only**).
  **\*Customer View** [cite: 21-23, 37-39]
  _ **GET /api/sweets**: View a list of all available sweets.
  _ **GET /api/sweets/search**: Search by name, category, or price range. \* Frontend displays a dashboard, search bar, and disables the "Purchase" button if stock is zero.

---

## Screenshots of Final Application

_(**ACTION REQUIRED:** Ensure your screenshots are saved in the root directory and replace the placeholders below.)_

### Login/Registration Flow (Visually Appealing Frontend)

![alt text](Login.png)
![alt text](Regitration.png)

### Sweets Dashboard (User View)

![alt text](Userview2.png)
![alt text](Userview1.png)

### Sweets Dashboard (Admin View)

![alt text](Adminuser3.png)
![alt text](Adminuser2.png)
![alt text](AdminUser1.png)

---

## Detailed Setup and Run Instructions

This section provides detailed instructions on how to set up and run the project locally.

You must have **Node.js** (v18+) and **MongoDB** (running locally on `mongodb://localhost:27017/`) installed.

### 1. Backend Setup (NestJS + MongoDB)

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create a **.env** file in the `/backend` folder.
#    Add your database and secret key (must be a real string):
DATABASE_URL="mongodb://localhost:27017/sweetshop"
JWT_SECRET="SHOPS_SUPER_STRONG_RANDOM_SECRET_KEY"

# 4. Run the backend server (in development mode)
npm run start:dev

# The API will be running at http://localhost:3000

# Open a new Terminal for the frontend

# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Run the frontend server
npm run dev

# The frontend will be running at http://localhost:5173

# From the /backend folder:
npm run test:e2e

Final Test Results:
PASS  test/app.e2e-spec.ts
 Authentication API (e2e)
   √ should register a new user (POST /api/auth/register)
   √ should log in an existing user and return a token (POST /api/auth/login)
 Sweets API (e2e)
   √ should create a new sweet (POST /api/sweets)
   √ should block unauthenticated access (POST /api/sweets)
   √ should get a list of all sweets (GET /api/sweets)
   √ should search for sweets by name (GET /api/sweets/search)
   √ should update a sweet (PUT /api/sweets/:id)
   √ should BLOCK a non-admin from deleting a sweet (DELETE /api/sweets/:id)
   √ should allow an ADMIN to delete a sweet (DELETE /api/sweets/:id)
   √ should purchase a sweet and decrease its quantity (POST /api/sweets/:id/purchase)
   √ should BLOCK a non-admin from restocking a sweet (POST /api/sweets/:id/restock)
   √ should allow an ADMIN to restock a sweet (POST /api/sweets/:id/restock)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        (approx 6 seconds)

My AI Usage (Mandatory Section)
This section details my use of AI tools during the software development lifecycle, as required by the project guidelines.

AI Tool Used: Gemini (Google)

How I used them:

TDD Workflow & Code Generation: I used Gemini to generate the initial "Red" (failing) test code and the minimal code required to achieve the "Green" state for all 12 backend endpoints, strictly following the Red-Green-Refactor TDD process.

Security Implementation: I requested the boilerplate structure for implementing complex NestJS security features, including the JwtStrategy and RolesGuard, which are crucial for protecting API endpoints.

Debugging & Configuration: I pasted in terminal error messages (e.g., module path errors, network refusal errors), and Gemini helped diagnose the root cause, leading to fixes for the CORS configuration and necessary code imports.

Reflection on AI Impact on my Workflow: Using the AI significantly reduced the time spent on repetitive syntax, configuration, and boilerplate. This allowed me to concentrate the majority of my effort on the overall application architecture, maintaining Clean Code standards, and ensuring the final application was fully tested and functional.
```
