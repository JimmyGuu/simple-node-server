# StableFlow Server

A Node.js server that provides TronLink data receiving API.

## Features

- 🚀 Express.js server
- 📡 POST `/tronlink` endpoint to receive TronLink data
- 🏥 Health check endpoint
- 🔒 CORS support
- 📝 Request logging

## Installation

```bash
npm install
```

## Start Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start at `http://localhost:3000`

## API Endpoints

### POST /tronlink

Receive TronLink data

**Request Body Example:**
```json
{
  "actionId": "e5471a9c-b0f1-418b-8634-3de60d68a288",
  "address": "TSPrmJetAMo6S6RxMd4tswzeRCFVegBNig",
  "code": 0,
  "id": 1780812177,
  "message": "success"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Data received successfully",
  "data": {
    "actionId": "e5471a9c-b0f1-418b-8634-3de60d68a288",
    "address": "TSPrmJetAMo6S6RxMd4tswzeRCFVegBNig",
    "code": 0,
    "id": 1780812177,
    "message": "success",
    "receivedAt": "2024-01-01T00:00:00.000Z",
    "status": "success"
  }
}
```

### GET /health

Health check endpoint

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Testing API

Test TronLink endpoint using curl:

```bash
curl -X POST http://localhost:3000/tronlink \
  -H "Content-Type: application/json" \
  -d '{
    "actionId": "e5471a9c-b0f1-418b-8634-3de60d68a288",
    "address": "TSPrmJetAMo6S6RxMd4tswzeRCFVegBNig",
    "code": 0,
    "id": 1780812177,
    "message": "success"
  }'
```

## Environment Variables

- `PORT`: Server port (default: 3000)