# ScholarStream Server API Documentation

## Overview
ScholarStream Server is a Node.js/Express backend for a scholarship management platform. It provides comprehensive REST APIs for managing users, scholarships, applications, reviews, payments, and analytics.

## Project Structure

```
scholar-stream-server/
├── config/              # Configuration files
│   └── environment.js   # Environment variable validation
├── controllers/         # Business logic layer (7 controllers)
│   ├── authController.js
│   ├── userController.js
│   ├── scholarshipController.js
│   ├── applicationController.js
│   ├── reviewController.js
│   ├── paymentController.js
│   └── analyticsController.js
├── middleware/          # Request/response middleware (5 files)
│   ├── verifyToken.js
│   ├── verifyAdmin.js
│   ├── verifyModerator.js
│   ├── errorMiddleware.js
│   └── loggingMiddleware.js
├── routes/              # Route definitions (7 files)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── scholarshipRoutes.js
│   ├── applicationRoutes.js
│   ├── reviewRoutes.js
│   ├── paymentRoutes.js
│   └── analyticsRoutes.js
├── helpers/             # Utility functions (2 files)
│   ├── responseHelper.js
│   └── dbHelper.js
├── utils/               # Utility functions (3 files)
│   ├── errorHandler.js
│   ├── validators.js
│   └── constants.js
├── seed/                # Database seeding
│   └── seedData.js
├── index.js             # Main server entry point
├── .env                 # Environment variables (git-ignored)
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Installation & Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- npm or yarn

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/Eshrat48/ScholarStream-Server.git
cd scholar-stream-server

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure environment variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_key

# 5. Seed database (optional)
node seed/seedData.js

# 6. Start server
npm run dev
```

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 4.18.2 | Web framework |
| MongoDB | 6.3.0 | Database driver |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 2.4.3 | Password hashing |
| Stripe | 14.14.0 | Payment processing |
| dotenv | 16.3.1 | Environment config |
| CORS | 2.8.5 | Cross-origin requests |

## API Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /generate-token` - Generate JWT token for user

### Users (`/api/v1/users`)
- `POST /` - Create new user (public)
- `GET /:email` - Get user by email
- `GET /` - Get all users (Admin only)
- `PATCH /:id/role` - Update user role (Admin only)
- `DELETE /:id` - Delete user (Admin only)

### Scholarships (`/api/v1/scholarships`)
- `GET /` - Get all scholarships with search/filter/sort
- `GET /top` - Get top 6 scholarships
- `GET /category/:category` - Get scholarships by category
- `GET /:id` - Get scholarship by ID
- `POST /` - Add scholarship (Admin only)
- `PATCH /:id` - Update scholarship (Admin only)
- `DELETE /:id` - Delete scholarship (Admin only)

### Applications (`/api/v1/applications`)
- `POST /` - Create application (Student)
- `GET /my-applications` - Get user's applications (Student)
- `GET /` - Get all applications (Moderator/Admin)
- `PATCH /:id/status` - Update application status (Moderator/Admin)
- `PATCH /:id/feedback` - Add feedback to application (Moderator)
- `PATCH /:id` - Update application (Student)
- `DELETE /:id` - Delete application (Student/Admin)

### Reviews (`/api/v1/reviews`)
- `GET /:scholarshipId` - Get reviews for scholarship
- `GET /my-reviews` - Get user's reviews (Student)
- `GET /` - Get all reviews (Admin)
- `POST /` - Add review (Student)
- `PATCH /:id` - Update review (Student/Admin)
- `DELETE /:id` - Delete review (Student/Admin)

### Payments (`/api/v1/payments`)
- `POST /create-payment-intent` - Create Stripe payment intent

### Analytics (`/api/v1/analytics`)
- `GET /dashboard` - Dashboard statistics (Admin only)
- `GET /by-university` - Applications by university (Admin only)
- `GET /by-category` - Applications by category (Admin only)

## User Roles & Access Control

### Student (Default)
- Create/update/delete own applications
- Create/update/delete own reviews
- View scholarships and apply

### Moderator
- Review and process applications
- Add feedback to applications
- Delete any review
- Cannot delete applications or scholarships

### Admin
- Full access to all resources
- User management (create/delete/update roles)
- Scholarship management (CRUD)
- Delete applications and reviews
- Access analytics dashboard

## Authentication Flow

1. User registers/logs in via client
2. Client calls `/api/v1/auth/generate-token` with user email
3. Server generates JWT token (7-day expiration)
4. Client stores token in localStorage
5. Client includes token in Authorization header: `Bearer <token>`
6. Server validates token on protected routes

## Error Handling

All errors return consistent JSON format:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "details": "Additional details (development only)"
}
```

Common status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Development Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database
node seed/seedData.js

# View logs
npm run logs
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| MONGODB_URI | Yes | - | MongoDB connection string |
| JWT_SECRET | Yes | - | Secret key for JWT signing |
| PORT | No | 5000 | Server port |
| CLIENT_URL | Yes | - | Frontend URL for CORS |
| STRIPE_SECRET_KEY | No | - | Stripe API secret key |
| NODE_ENV | No | development | Environment (development/production) |

## Database Collections

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  role: String (Student/Moderator/Admin),
  university: String,
  createdAt: Date
}
```

### scholarships
```javascript
{
  _id: ObjectId,
  scholarshipName: String,
  universityName: String,
  universityCountry: String,
  scholarshipCategory: String,
  applicationFees: Number,
  serviceCharge: Number,
  degree: String,
  tuitionFees: Number,
  applicationDeadline: Date,
  postDate: Date
}
```

### applications
```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,
  userId: ObjectId,
  universityName: String,
  applicantName: String,
  status: String (pending/processing/completed/rejected),
  feedback: String,
  paymentStatus: String,
  createdAt: Date
}
```

### reviews
```javascript
{
  _id: ObjectId,
  scholarshipId: ObjectId,
  userId: ObjectId,
  userName: String,
  rating: Number,
  comment: String,
  createdAt: Date
}
```

## API Testing

Use tools like Postman or Thunder Client to test endpoints:
1. Import endpoints from `/docs/api-testing-guide.md`
2. Set authorization header with JWT token
3. Test all CRUD operations per role

## Deployment

Deploy to platforms like:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Ensure environment variables are configured on hosting platform.

## Contributing

1. Create feature branch (`git checkout -b feature/feature-name`)
2. Commit changes (`git commit -m "Add feature"`)
3. Push to branch (`git push origin feature/feature-name`)
4. Open Pull Request

## Support

For issues and questions, open an issue on GitHub or contact the development team.

---

**Last Updated:** December 10, 2025
**Server Version:** 1.0.0
**API Version:** v1
