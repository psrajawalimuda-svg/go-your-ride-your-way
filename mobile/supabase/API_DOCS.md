# Backend API Documentation

This document describes the Supabase Edge Functions for the "Go Your Ride, Your Way" project.

## 1. Auth Module
**Endpoint:** `/auth`

### Action: `set-role`
Sets the user's role (passenger or driver).
- **Method:** POST
- **Payload:**
  ```json
  {
    "action": "set-role",
    "payload": { "role": "passenger" | "driver" }
  }
  ```

### Action: `get-permissions`
Retrieves the current user's role and associated permissions.
- **Method:** POST
- **Payload:**
  ```json
  { "action": "get-permissions" }
  ```

---

## 2. User & Driver Module
**Endpoint:** `/user-driver`

### Action: `update-profile`
Updates the user's basic profile details.
- **Method:** POST
- **Payload:**
  ```json
  {
    "action": "update-profile",
    "payload": { "full_name": "string", "avatar_url": "string", "phone_number": "string" }
  }
  ```

### Action: `driver-status`
Updates driver availability and vehicle details.
- **Method:** POST
- **Payload:**
  ```json
  {
    "action": "driver-status",
    "payload": { "status": "online" | "offline" | "busy", "vehicle_details": { "make": "string", "plate": "string" } }
  }
  ```

---

## 3. Booking Module
**Endpoint:** `/booking`

### Action: `create-booking`
Creates a new ride or shuttle booking.
- **Method:** POST
- **Payload:**
  ```json
  {
    "action": "create-booking",
    "payload": {
      "booking_type": "instant" | "scheduled" | "shuttle",
      "pickup_lat": number, "pickup_lng": number,
      "dropoff_lat": number, "dropoff_lng": number,
      "scheduled_at": "ISO8601",
      "shuttle_schedule_id": "uuid" (optional)
    }
  }
  ```

---

## 4. Payment Module
**Endpoint:** `/payment`

### Action: `initiate-payment`
Starts a payment process for a booking or trip.
- **Method:** POST
- **Payload:**
  ```json
  {
    "action": "initiate-payment",
    "payload": {
      "booking_id": "uuid",
      "amount": number,
      "payment_method": "string"
    }
  }
  ```

### Action: `get-payment-history`
Retrieves the user's transaction history.
- **Method:** POST
- **Payload:**
  ```json
  { "action": "get-payment-history" }
  ```
