# Interlink – Social App API
A scalable, modular, and real-time Social Media backend inspired by Instagram.  
Built with TypeScript, Node.js, Express, Apollo GraphQL, MongoDB, and Socket.IO.

---

## Tech Stack
- TypeScript  
- Node.js (Express.js + Apollo GraphQL)  
- MongoDB (Mongoose)  
- Socket.IO (Real-time layer)  
- JWT Authentication  
- Cloudinary (media uploads)  
- Joi Validation  
- Layered Architecture (Services + Repositories)  
- Custom Guards and Context System  

---

## Overview

Interlink is a REST + GraphQL API that provides a complete backend foundation for a modern social media application.  
It is built with a clean, modular architecture focusing on scalability, maintainability, and real-time communication.

The system introduces a unified context-aware mechanism that allows the same guards and middleware to operate seamlessly across:

- HTTP Requests  
- GraphQL Resolvers  
- WebSocket Events  

This eliminates duplicated logic and keeps the codebase consistent and extensible.

---

## Security and Authentication

- JWT-based authentication  
- Token invalidation when user credentials are updated  
- Authentication and Authorization Guards (NestJS-inspired)  
- Ownership checks for posts, comments, replies, and stories  
- Private/Public profile system with follow request workflow  
- Complete protection against unauthorized or invalid requests  

---

## Architecture Breakdown

### 1. Decorator System
- `ContextDetector` identifies request type (HTTP, GraphQL, or Socket.IO)  
- `asyncHandler` provides unified error handling  
- `applyGuards` activates guard pipelines depending on the context  

This architecture enforces:
- No code duplication  
- Clean request handling  
- Consistent security enforcement across all layers  

---

### 2. Repository Layer
Abstraction over Mongoose that provides:

- Separation of data access from business logic  
- Clean interfaces for CRUD operations  
- Consistent methods such as `findOneAndUpdate`, `create`, `deleteMany`, etc.  

---

### 3. Services Layer
Contains all business logic for:

- Users  
- Posts  
- Comments  
- Replies  
- Stories  
- Follow system  
- Saved posts  
- Notifications (real-time and persistent)  

All services remain independent from transport layers, ensuring high maintainability.

---

## Social Features

### Posts
- Create, edit, delete  
- Like and unlike  
- Share counter  
- Save and unsave posts  
- Fetch all saved posts  
- Soft delete system with TTL cleanup  

### Users
- Follow and unfollow  
- Follow requests for private profiles  
- Accept or reject follow requests  
- Followers and followings management  
- Profile views counter  
- Public and private profile modes  

### Comments and Replies
- Full CRUD  
- Cloudinary attachments  
- Nested replies  
- Real-time notifications  

### Stories
- Upload with auto-expiration  
- Like system  
- Notifications  
- Supports media attachments  

---

## Real-Time Notifications (Socket.IO)

The NotificationService enables a complete real-time notification pipeline.

### Capabilities
- Sends notifications instantly if the user is online  
- Stores notifications when the user is offline  
- On reconnect, all missed notifications are delivered automatically  
- Supports:
  - Follow requests  
  - Follow request accepted  
  - Post liked  
  - Post commented  
  - Comment replied  
  - Story liked  

### Online Users Tracking
A simple and efficient mapping:
Map<userId, socketId>
This ensures instant delivery without unnecessary database lookups.

---

## Unified Context Guards

The same guard logic works across:

- HTTP  
- GraphQL  
- WebSocket  

Through:
- ContextDetector  
- applyGuards  
- asyncHandler  
- Separate guard activators  

This results in a unified security model that does not depend on the request transport layer.

---

## Uploads and Attachments

Cloudinary integration includes:
- Image uploads for posts, comments, and stories  
- Rollback on error during request handling  
- Auto deletion on entity removal  
- Structured folder paths  

---

## Validation

- Joi validation schemas  
- Clean layered validation structure  
- Compatible with both REST and GraphQL  

---

## Additional Features

- Pagination helpers  
- Soft delete with expiration  
- Virtual fields for like and comment counts  
- Automatic comment deletion when a post is removed  
- Cloudinary cleanup pipelines  

---

## Future Enhancements

- Reactions system    
- Push notifications (FCM)  
- Story highlights  
- Recommendation system (Explore)  

---

## Conclusion

Interlink is a fully-fledged backend architecture designed for modern social platforms.  
It combines real-time capabilities, strong security layers, a unified guard system, and a clean scalable structure suitable for production-grade applications.