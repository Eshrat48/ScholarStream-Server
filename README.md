# ScholarStream Server

Backend server for ScholarStream - A Scholarship Management Platform that connects students with scholarship opportunities.

## Live URL
- **Server:** Your deployed server URL here

## Purpose
This server provides RESTful API endpoints for managing scholarships, applications, user authentication, reviews, and payment processing using Stripe.

## Key Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 👥 **Role-Based Access Control** - Three user roles (Student, Moderator, Admin)
- 🎓 **Scholarship Management** - CRUD operations for scholarships
- 📝 **Application System** - Students can apply for scholarships
- 💳 **Payment Integration** - Stripe payment processing
- ⭐ **Review System** - Students can review scholarships
- 🔍 **Advanced Search & Filter** - Server-side search, filter, sort, and pagination
- 📊 **Analytics Dashboard** - Statistics and charts for admin

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe
- **Environment:** dotenv

## NPM Packages Used
- `express` - Web framework for Node.js
- `mongodb` - MongoDB driver for Node.js
- `cors` - Enable CORS for cross-origin requests
- `dotenv` - Environment variable management
- `jsonwebtoken` - JWT token generation and verification
- `stripe` - Stripe payment processing
- `nodemon` - Development server with auto-restart

## API Endpoints

### Authentication
- `POST /api/auth/jwt` - Generate JWT token

### Users
- `POST /api/users` - Create new user
- `GET /api/users/:email` - Get user by email (Protected)
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Scholarships
- `GET /api/scholarships` - Get all scholarships (with pagination, search, filter, sort)
- `GET /api/scholarships/top` - Get top 6 scholarships
- `GET /api/scholarships/:id` - Get scholarship by ID
- `GET /api/scholarships/category/:category` - Get scholarships by category
- `POST /api/scholarships` - Add scholarship (Admin only)
- `PUT /api/scholarships/:id` - Update scholarship (Admin only)
- `DELETE /api/scholarships/:id` - Delete scholarship (Admin only)

### Applications
- `POST /api/applications` - Create application (Protected)
- `GET /api/applications/user/:email` - Get user applications (Protected)
- `GET /api/applications` - Get all applications (Moderator/Admin)
- `PATCH /api/applications/:id/status` - Update application status (Moderator/Admin)
- `PATCH /api/applications/:id/feedback` - Add feedback (Moderator/Admin)
- `PATCH /api/applications/:id/payment` - Update payment status (Protected)
- `PUT /api/applications/:id` - Update application (Protected)
- `DELETE /api/applications/:id` - Delete application (Protected)

### Reviews
- `GET /api/reviews/scholarship/:scholarshipId` - Get reviews by scholarship
- `GET /api/reviews/user/:email` - Get user reviews (Protected)
- `GET /api/reviews` - Get all reviews (Moderator/Admin)
- `POST /api/reviews` - Add review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

### Payment
- `POST /api/create-payment-intent` - Create Stripe payment intent (Protected)

### Analytics
- `GET /api/analytics/stats` - Get dashboard statistics (Admin only)
- `GET /api/analytics/applications-by-university` - Get application stats by university (Admin only)
- `GET /api/analytics/applications-by-category` - Get application stats by category (Admin only)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd scholar-stream-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

### 4. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` in the connection string with your database user password
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)

### 5. Run the server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## Database Collections

### users
- Stores user information (name, email, photoURL, role, createdAt)

### scholarships
- Stores scholarship data (scholarshipName, universityName, universityImage, universityCountry, universityCity, universityWorldRank, subjectCategory, scholarshipCategory, degree, tuitionFees, applicationFees, serviceCharge, applicationDeadline, scholarshipPostDate, postedUserEmail)

### applications
- Stores application data (scholarshipId, userId, userName, userEmail, universityName, scholarshipCategory, degree, applicationFees, serviceCharge, applicationStatus, paymentStatus, applicationDate, feedback)

### reviews
- Stores review data (scholarshipId, universityName, userName, userEmail, userImage, ratingPoint, reviewComment, reviewDate)

## Security Features
- JWT token-based authentication
- Role-based access control (Student, Moderator, Admin)
- Protected routes with middleware
- Environment variables for sensitive data
- CORS configuration for client requests

## Deployment
This server is deployed on [Your hosting platform - Vercel/Railway/Render/etc.]

## Author
[Your Name]

## License
ISC
