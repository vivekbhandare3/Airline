# ✈️ Airline Reservation System

A full-stack Airline Reservation System built using **Java, Spring Boot, React.js, MySQL, and Redis**. The application provides flight search and flight details functionality, with Redis-based caching and optimized database lookups. Deployed on AWS using Docker and CI/CD pipelines.

## 🚀 Features

- **Flight Search:** Search flights based on origin, destination, travel date, and passenger count.
- **Flight Details:** Retrieve detailed flight information using flight ID.
- **Redis Caching:** Implemented cache-aside caching for flight search and Spring Cache for flight details.
- **Bloom Filter / Cuckoo Filter:** Optimized existence checks to reduce unnecessary database queries.
- **Database Integration:** MySQL for persistent flight data storage.
- **REST APIs:** Developed RESTful APIs using Spring Boot.
- **Cloud Deployment:** Deployed backend and frontend on AWS with automated CI/CD pipelines.

## 🛠️ Tech Stack

**Backend:** Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate

**Frontend:** React.js, JavaScript, HTML, CSS

**Database:** MySQL

**Caching:** Redis, Spring Cache

**Performance Optimization:** Bloom Filter, Cuckoo Filter

**Cloud & DevOps:** AWS ECS, ECR, RDS, S3, CloudFront, Application Load Balancer, Docker, AWS CodeBuild, AWS CodePipeline, GitHub Actions

## 📂 Project Structure

```text
Airline/
│
├── airline/                  # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── AirlineSystemFrontend/    # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## ⚙️ Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/vivekbhandare3/Airline.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd Airline/airline
   ```

3. Configure the required environment variables for MySQL, email, and Google OAuth.

4. Start MySQL and Redis.

5. Run the Spring Boot application:

   **Windows:**
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   **Linux/macOS:**
   ```bash
   ./mvnw spring-boot:run
   ```

   Backend runs at:

   ```text
   http://localhost:8080
   ```

## 🌐 Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd AirlineSystemFrontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/search` | Search flights |
| GET | `/flightDetails/{id}` | Get flight details |

**Example:**

```http
GET /search?origin=Pune&destination=Mumbai&date=2026-12-15&passengers=1
```

```http
GET /flightDetails/1
```

## ☁️ AWS Deployment

The application is deployed using AWS services with separate deployment pipelines for the backend and frontend.

**Backend Deployment:**
- Dockerized the Spring Boot application.
- Pushed Docker images to Amazon ECR.
- Deployed the backend using Amazon ECS.
- Used Amazon RDS for MySQL database hosting.
- Configured an Application Load Balancer for backend API traffic.
- Automated backend build and deployment using AWS CodeBuild and CodePipeline.

**Frontend Deployment:**
- Built the React application for production.
- Hosted the frontend on Amazon S3.
- Configured Amazon CloudFront for content delivery.
- Automated frontend deployment using GitHub Actions.

## 📝 Notes

- Configure environment variables before running the backend.
- Ensure MySQL and Redis are running.
- Do not commit sensitive credentials or `.env` files to the repository.

## 👨‍💻 Author

**Vivek Bhandare**

GitHub: [vivekbhandare3](https://github.com/vivekbhandare3)
