# Card Collection API

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

A professional Express.js REST API for managing a card collection with full CRUD operations, pagination, error handling, and structured logging.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)

## Features

- **Express.js** REST API framework
- **CORS** enabled for cross-origin requests
- **Pagination** support with configurable page and limit
- **Input Validation** with comprehensive error messages
- **Structured Logging** with configurable log levels
- **Error Handling** with detailed error responses
- **In-Memory Data Store** for quick prototyping (easily replaceable with a database)
- **Clean Architecture** following MVC/Controller-Service-Model pattern
- **Environment Configuration** using .env files
- **Graceful Shutdown** handling
- **Health Check** endpoint

## Tech Stack

- **Node.js** ≥ 14.0.0
- **Express.js** 4.18.2 - Web framework
- **CORS** 2.8.5 - Cross-origin resource sharing
- **Dotenv** 16.0.3 - Environment configuration
- **Nodemon** 3.0.1 - Development hot-reload

## Requirements

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher

## Installation

1. Clone the repository or download the project

2. Navigate to the project directory:
   ```bash
   cd card-collection-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

## Configuration

Edit the `.env` file to customize the following settings:

```env
# Server port (default: 3000)
PORT=3000

# Node environment (development, production, test)
NODE_ENV=development

# CORS origin (default: * for all origins)
CORS_ORIGIN=*

# Log level (debug, info, warn, error, none)
LOG_LEVEL=info
```

## Running the Server

**Development mode** (with auto-reload via nodemon):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

### Health Check

To verify the server is running:
```bash
curl http://localhost:3000/health
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format

All responses follow a consistent JSON format:

**Success Response:**
```json
{
  "data": {},
  "timestamp": "2026-02-19T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error Name",
  "message": "Detailed error message",
  "timestamp": "2026-02-19T10:30:00.000Z"
}
```

### Endpoints

#### 1. List All Cards

**Request:**
```http
GET /cards?page=1&limit=10
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number (must be ≥ 1)
- `limit` (optional, default: 10) - Items per page (must be 1-100)

**Response:**
```json
{
  "totalCards": 4,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 10,
  "count": 4,
  "cards": [
    {
      "id": 171836785992,
      "suit": "diamonds",
      "value": "queen",
      "collection": "royal",
      "createdAt": "2026-02-19T10:30:00.000Z",
      "updatedAt": "2026-02-19T10:30:00.000Z"
    }
  ],
  "next": null,
  "previous": null
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid pagination parameters

---

#### 2. Get Single Card

**Request:**
```http
GET /cards/:id
```

**Parameters:**
- `id` (required) - Card ID (must be a positive number)

**Response:**
```json
{
  "id": 171836785992,
  "suit": "diamonds",
  "value": "queen",
  "collection": "royal",
  "createdAt": "2026-02-19T10:30:00.000Z",
  "updatedAt": "2026-02-19T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Card found
- `400 Bad Request` - Invalid card ID
- `404 Not Found` - Card does not exist

---

#### 3. Create Card

**Request:**
```http
POST /cards
Content-Type: application/json

{
  "suit": "hearts",
  "value": "ace",
  "collection": "classic"
}
```

**Body Parameters:**
- `suit` (required, string) - Card suit (e.g., hearts, diamonds, clubs, spades)
- `value` (required, string) - Card value (e.g., ace, 2-10, jack, queen, king)
- `collection` (required, string) - Collection name

**Response:**
```json
{
  "id": 171836785996,
  "suit": "hearts",
  "value": "ace",
  "collection": "classic",
  "createdAt": "2026-02-19T10:35:00.000Z",
  "updatedAt": "2026-02-19T10:35:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Card created successfully
- `400 Bad Request` - Missing or invalid required fields
- `413 Payload Too Large` - Request body exceeds 10KB

---

#### 4. Update Card

**Request:**
```http
PUT /cards/:id
Content-Type: application/json

{
  "collection": "premium"
}
```

**Parameters:**
- `id` (required) - Card ID

**Body:** Any fields to update (suit, value, collection)

**Response:**
```json
{
  "id": 171836785992,
  "suit": "diamonds",
  "value": "queen",
  "collection": "premium",
  "createdAt": "2026-02-19T10:30:00.000Z",
  "updatedAt": "2026-02-19T10:40:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Card updated successfully
- `400 Bad Request` - Invalid card ID or invalid update data
- `404 Not Found` - Card does not exist

---

#### 5. Delete Card

**Request:**
```http
DELETE /cards/:id
```

**Parameters:**
- `id` (required) - Card ID

**Response:**
```json
{
  "message": "Card deleted successfully",
  "id": 171836785992,
  "timestamp": "2026-02-19T10:45:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Card deleted successfully
- `400 Bad Request` - Invalid card ID
- `404 Not Found` - Card does not exist

---

## Error Handling

The API provides detailed error messages to help debugging:

### Common Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or parameters |
| 404 | Not Found | Resource does not exist |
| 500 | Server Error | Internal server error |

### Error Response Example

```json
{
  "error": "Bad Request",
  "message": "suit, value, and collection are required; limit must be between 1 and 100",
  "timestamp": "2026-02-19T10:30:00.000Z"
}
```

## Project Structure

```
card-collection-api/
├── index.js                    # Server entry point
├── package.json                # Dependencies and metadata
├── .env                        # Environment variables (not in version control)
├── .env.example                # Example environment file
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
│
├── controllers/
│   └── card.controller.js      # Request handlers with validation
│
├── services/
│   └── card.service.js         # Business logic and pagination
│
├── models/
│   └── card.model.js           # Data model and CRUD operations
│
├── routes/
│   └── card.routes.js          # API route definitions
│
└── utils/
    ├── logger.js               # Logging utility
    └── validators.js           # Input validation functions
```

## Development

### Logging

The application uses structured logging with configurable levels:

```javascript
// In LOG_LEVEL=debug mode, see detailed logs
// In LOG_LEVEL=info mode, see informational and above
// In LOG_LEVEL=warn mode, see warnings and errors only
// In LOG_LEVEL=error mode, see errors only
```

Example log output:
```
[INFO] 2026-02-19T10:30:00.000Z - Server started successfully
[INFO] 2026-02-19T10:30:00.000Z - Environment: development
[DEBUG] 2026-02-19T10:30:05.123Z - GET /cards
[INFO] 2026-02-19T10:30:05.456Z - Card created with ID: 171836785996
```

### Code Style

The project follows these conventions:

- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Models** manage data storage
- **Utilities** provide reusable functions

### Adding New Features

1. **Define routes** in `routes/card.routes.js`
2. **Implement handlers** in `controllers/card.controller.js`
3. **Add logic** in `services/card.service.js`
4. **Validate inputs** using `utils/validators.js`
5. **Log operations** using `utils/logger.js`

## Production Ready Enhancements

To make this production-ready, consider:

- [ ] Replace in-memory store with a database (MongoDB, PostgreSQL, etc.)
- [ ] Add authentication (JWT, OAuth)
- [ ] Add rate limiting
- [ ] Add request validation with Joi or Yup
- [ ] Add comprehensive unit and integration tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add monitoring and alerting
- [ ] Implement request/response compression
- [ ] Add HTTPS/TLS support
- [ ] Set up CI/CD pipeline

## License

ISC

---

**Author:** Madani Hamdi 
**Version:** 1.0.0  
**Last Updated:** February 2026
Uid:24BCY70005
Exp:4B
