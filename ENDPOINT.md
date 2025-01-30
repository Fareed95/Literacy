# 📌 API Documentation

## 🚀 Overview
This document provides an overview of the available API endpoints for the Flask-based backend. Each endpoint is described with its request type, request body, and expected responses.

---

## 🛠 Base URL
`http://localhost:8000/`

---

## 📍 Endpoints

### 1️⃣ **Generate Roadmap**
**Endpoint:** `/generate-roadmap`

**Method:** `POST`

**Description:** Generates a roadmap with YouTube videos and PDF resources, then saves it to the database.

**Request Body:**
```json
{
  "input_value": "python developer roadmap",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "roadmap_id": 1,
  "roadmap_name": "Python Developer Roadmap",
  "roadmap_components": [...],
  "pdf_links": [...],
  "total_components": 5
}
```

---

### 2️⃣ **Get User Roadmaps**
**Endpoint:** `/user-roadmaps`

**Method:** `POST`

**Description:** Retrieves all roadmaps associated with a specific user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Python Developer Roadmap",
    "roadmap_json": {...}
  }
]
```

---

### 3️⃣ **Mark Roadmap as Completed**
**Endpoint:** `/roadmaps/{roadmap_id}/complete`

**Method:** `PATCH`

**Description:** Updates the completion status of a roadmap.

**Request Body:**
```json
{
  "is_completed": 1
}
```

**Response:**
```json
{
  "message": "Roadmap completion status updated successfully"
}
```

---

### 4️⃣ **Get Roadmap by ID**
**Endpoint:** `/roadmaps/{roadmap_id}`

**Method:** `GET`

**Description:** Fetches a specific roadmap by its ID.

**Response:**
```json
{
  "id": 1,
  "name": "Python Developer Roadmap",
  "roadmap_json": {...}
}
```

---

## 📝 Notes
- Ensure that all request bodies are in JSON format.
- The `{roadmap_id}` parameter in URLs should be replaced with the actual roadmap ID.
- Handle authentication if required before calling these endpoints.

📩 For any issues, contact the backend team!
Fareed Sayed - 9987580370
fareedsayedprsnl@gmail.com

