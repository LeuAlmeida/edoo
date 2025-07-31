# Benefits Management API

A simple REST API for managing benefits built with Node.js, Express, and SQLite.

## Features

- Create, list, activate, deactivate, and delete benefits
- SQLite database for data persistence
- Clean Architecture implementation
- Input validation
- Error handling
- TypeScript support

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```
3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
yarn dev
```

Build and run in production:
```bash
yarn build
yarn start
```

## API Endpoints

- `GET /api/benefits` - List all benefits
- `POST /api/benefits` - Create a new benefit
- `PUT /api/benefits/:id/activate` - Activate a benefit
- `PUT /api/benefits/:id/deactivate` - Deactivate a benefit
- `DELETE /api/benefits/:id` - Delete a benefit

### Request Body Example (POST /api/benefits)

```json
{
  "name": "Health Insurance",
  "description": "Complete coverage for employees"
}
```

## Validation Rules

- `name`: Required, 3-100 characters
- `description`: Optional, max 255 characters
- `isActive`: Boolean, defaults to true

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Validation errors
- `404` - Resource not found
- `500` - Internal server error
