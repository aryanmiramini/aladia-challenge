# Aladia NestJS Monorepo Challenge

A scalable NestJS monorepo with microservices architecture implementing user management capabilities using a modern microservices approach.

## Architecture Overview

This project demonstrates a well-structured NestJS monorepo pattern with microservices communication via TCP/IP. The system follows the Controller → Service → Repository pattern, ensuring clear separation of concerns:

- **apps/gateway**: HTTP REST API gateway exposing endpoints to clients, handling validation and transforming requests
- **apps/authentication**: TCP microservice for user management business logic and database operations
- **libs/common**: Shared utilities, including the networking service for inter-service communication
- **libs/core**: Domain models, DTOs, schemas, and business logic interfaces
- **libs/config**: Configuration management providing centralized access to environment variables

## Key Features

- **User Management:** Complete user registration and retrieval functionality
- **API Documentation:** Comprehensive Swagger UI with field descriptions and examples
- **Microservices Communication:** Robust TCP-based messaging with timeout and retry mechanisms
- **Data Validation:** Thorough request validation using class-validator decorators
- **Error Handling:** Graceful error handling with appropriate HTTP status codes
- **Persistence:** MongoDB integration with Mongoose ODM
- **Health Checks:** Service health endpoints for monitoring
- **Containerization:** Production-ready Docker and Docker Compose configuration

## Technical Implementation

- **NestJS Framework**: Utilizing the powerful modular architecture of NestJS
- **TypeScript**: Full type safety throughout the codebase
- **MongoDB**: Flexible document database for storing user data
- **Swagger/OpenAPI**: Automatic API documentation generation
- **TCP Microservices**: NestJS microservices transport for internal communication
- **Docker**: Containerization for consistent deployment

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance, Atlas cloud, or Docker)
- npm or yarn package manager
- (Optional) Docker and Docker Compose for containerized deployment

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aryanmiramini/aladia-challenge.git
cd aladia-challenge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```
# MongoDB Connection (Local or Atlas)
MONGODB_URI=mongodb://localhost:27017/aladia
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Service Configuration
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
GATEWAY_PORT=3000
```

## Running the Application

### Development Mode

Start each service in a separate terminal:

```bash
# Terminal 1: Start the authentication microservice
npm run start:auth:dev

# Terminal 2: Start the gateway API
npm run start:gateway:dev
```

### Production Mode

For production deployment:

```bash
# Build the applications
npm run build

# Start the authentication service
npm run start:auth

# Start the gateway service
npm run start:gateway
```

## Docker Deployment

The project includes a complete Docker setup for easy deployment:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## MongoDB Configuration

### Local MongoDB

Ensure MongoDB is running locally on the default port (27017).

### MongoDB Atlas

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Configure network access (add your IP to the whitelist)
4. Create a database user
5. Get your connection string and update it in the `.env` file

## API Documentation

Once the application is running, access the Swagger documentation at:

http://localhost:3000/api

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | /auth/register | Register a new user | `{ "email": "user@example.com", "username": "username", "password": "password123" }` | User object |
| GET | /auth/users | Get all registered users | - | Array of users |
| GET | /health | Health check endpoint | - | Service status |

## Project Structure

```
aladia-challenge/
├── apps/                    # Application services
│   ├── gateway/             # API Gateway
│   │   ├── src/
│   │   │   ├── auth/        # Auth module
│   │   │   └── main.ts      # Gateway entry point
│   └── authentication/      # Authentication microservice
│       ├── src/
│       │   └── main.ts      # Auth service entry point
├── libs/                    # Shared libraries
│   ├── common/              # Common utilities
│   │   └── networking/      # Microservices communication
│   ├── core/                # Core domain models
│   │   └── user/            # User domain
│   │       ├── dto/         # Data Transfer Objects
│   │       └── schemas/     # Database schemas
│   └── config/              # Configuration management
├── docker-compose.yml       # Docker compose configuration
├── Dockerfile               # Docker build definition
└── package.json             # Project dependencies
```

## Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running and accessible
- Check environment variables are correctly set
- Verify ports 3000 and 3001 are not in use by other applications

### Docker Issues
- Ensure Docker and Docker Compose are installed
- Check Docker daemon is running
- Verify no port conflicts with existing containers

## License

This project is MIT licensed. 