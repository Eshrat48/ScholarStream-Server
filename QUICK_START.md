# 🚀 Quick Start Guide

## What's Been Created?

Your backend server is now complete with:

✅ Express.js server setup
✅ MongoDB connection configuration
✅ JWT authentication system
✅ Role-based access control (Student, Moderator, Admin)
✅ Complete API endpoints for:
  - User management
  - Scholarship CRUD operations
  - Application system
  - Review system
  - Payment processing (Stripe)
  - Analytics dashboard
✅ Server-side search, filter, sort & pagination
✅ Protected routes with middleware
✅ CORS configuration

## 📁 Server Structure

```
scholar-stream-server/
├── index.js                 # Main server file with all routes
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (SECRET!)
├── .env.example           # Environment template
├── .gitignore             # Git ignore file
├── README.md              # Complete documentation
├── MONGODB_SETUP.md       # MongoDB Atlas setup guide
├── API_TESTING_GUIDE.md   # API testing instructions
├── QUICK_START.md         # This file
├── config/                # Configuration files (empty for now)
├── middleware/            # Middleware files (empty for now)
└── routes/                # Route files (empty for now)
```

Note: All routes are currently in `index.js`. You can organize them into separate files later.

## 🔧 Next Steps

### Step 1: Set Up MongoDB Atlas (REQUIRED)
1. Follow instructions in `MONGODB_SETUP.md`
2. Create a MongoDB Atlas account
3. Create a cluster
4. Get your connection string
5. Update `.env` file with your MongoDB URI

### Step 2: Configure Environment Variables
Open `.env` file and update:

```env
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/scholarStreamDB

# Keep or change this secret key
JWT_SECRET=scholarstream_secret_key_2024

# Port (default is fine)
PORT=5000

# Add your Stripe secret key later
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Your frontend URL
CLIENT_URL=http://localhost:5173
```

### Step 3: Start the Server
```bash
# Make sure you're in the server directory
cd "F:\programming hero\projects\ScholarStream\scholar-stream-server"

# Start in development mode (auto-restart on changes)
npm run dev

# OR start in production mode
npm start
```

You should see:
```
Connected to MongoDB!
ScholarStream Server is running on port 5000
All routes initialized successfully!
```

### Step 4: Test Your API
1. Open `API_TESTING_GUIDE.md`
2. Use Postman, Thunder Client, or VS Code REST Client
3. Test the endpoints starting with:
   - GET http://localhost:5000/ (health check)
   - POST http://localhost:5000/api/users (create user)
   - POST http://localhost:5000/api/auth/jwt (get token)

### Step 5: Connect Frontend to Backend
In your React app (scholar-stream-client):

1. Create an `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

2. Use axios or fetch to call APIs:
```javascript
// Example: Get all scholarships
const response = await fetch('http://localhost:5000/api/scholarships');
const data = await response.json();

// Example: Create user with JWT
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(applicationData)
});
```

## 🔑 Important Notes

### Authentication Flow
1. User registers → POST /api/users
2. User gets JWT token → POST /api/auth/jwt
3. Store token in localStorage
4. Include token in Authorization header for protected routes
5. Backend verifies token with `verifyToken` middleware

### User Roles
- **Student** (default): Can apply, review, view their data
- **Moderator**: Can manage applications, view all reviews
- **Admin**: Full access - manage users, scholarships, view analytics

### Protected Routes
Routes that require authentication:
- All `/api/applications/*` endpoints
- All `/api/reviews/*` endpoints
- User-specific endpoints
- Admin/Moderator endpoints

### Making a User Admin
After creating a user, manually update their role in MongoDB:
1. Go to MongoDB Atlas
2. Browse Collections → scholarStreamDB → users
3. Find the user
4. Edit document
5. Change `role` from "Student" to "Admin"

## 📊 Available API Endpoints

### Public Routes (No Auth)
- `GET /` - Health check
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/top` - Get top 6 scholarships
- `GET /api/scholarships/:id` - Get one scholarship
- `GET /api/reviews/scholarship/:id` - Get reviews
- `POST /api/users` - Register user
- `POST /api/auth/jwt` - Get JWT token

### Protected Routes (Need JWT)
- `GET /api/users/:email` - Get user profile
- `POST /api/applications` - Create application
- `GET /api/applications/user/:email` - Get my applications
- `POST /api/reviews` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/create-payment-intent` - Create payment

### Moderator Routes
- `GET /api/applications` - Get all applications
- `PATCH /api/applications/:id/status` - Update status
- `PATCH /api/applications/:id/feedback` - Add feedback
- `GET /api/reviews` - Get all reviews

### Admin Routes
- `GET /api/users` - Get all users
- `PATCH /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user
- `POST /api/scholarships` - Add scholarship
- `PUT /api/scholarships/:id` - Update scholarship
- `DELETE /api/scholarships/:id` - Delete scholarship
- `GET /api/analytics/*` - Get statistics

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Check if MongoDB URI is correct
- Check if all dependencies are installed: `npm install`

### "Cannot connect to MongoDB"
- Check internet connection
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas

### "Unauthorized access"
- JWT token missing or invalid
- Check Authorization header: `Bearer <token>`
- Token might be expired (7 days)

### CORS errors
- Check CLIENT_URL in `.env`
- Verify CORS configuration in `index.js`
- Make sure you're using the correct origin

## 📝 Git Commits

Remember to make meaningful commits! Examples:
```bash
git add .
git commit -m "Initial server setup with Express and MongoDB"
git commit -m "Add user authentication with JWT"
git commit -m "Implement scholarship CRUD operations"
git commit -m "Add application management system"
git commit -m "Integrate Stripe payment processing"
git commit -m "Add review system for scholarships"
git commit -m "Implement admin analytics dashboard"
git commit -m "Add search, filter, and pagination"
git commit -m "Add role-based access control middleware"
git commit -m "Complete API documentation"
```

## 🎯 Features Implemented

✅ **Authentication & Authorization**
- JWT token generation and verification
- Role-based access control (Student, Moderator, Admin)
- Protected routes with middleware

✅ **User Management**
- User registration with default "Student" role
- Profile viewing
- Admin can manage all users and roles

✅ **Scholarship System**
- CRUD operations for scholarships
- Server-side search (by name, university, degree)
- Server-side filter (by country, category)
- Server-side sort (by fees, date)
- Pagination support
- Top scholarships feature

✅ **Application System**
- Students can apply for scholarships
- Payment status tracking
- Application status (pending → processing → completed)
- Moderators can add feedback
- Students can edit/delete pending applications

✅ **Review System**
- Students can review completed scholarships
- Rating and comments
- Edit/delete own reviews
- Moderators can moderate all reviews

✅ **Payment Integration**
- Stripe payment intent creation
- Payment status tracking

✅ **Analytics Dashboard**
- Total users, scholarships, applications
- Total fees collected
- Application stats by university
- Application stats by category

## 🚀 Ready for Production?

Before deploying:
1. ✅ Change JWT_SECRET to a strong random string
2. ✅ Add your production CLIENT_URL
3. ✅ Restrict MongoDB IP access (don't use 0.0.0.0/0)
4. ✅ Add Stripe secret key
5. ✅ Test all endpoints thoroughly
6. ✅ Update CORS origins for production domain

## 💡 Tips

1. **Use Thunder Client** (VS Code extension) for API testing
2. **Check MongoDB Atlas** to view your data visually
3. **Keep .env secure** - Never commit it to Git
4. **Test roles** - Create test users for each role
5. **Read the code** - Comments explain everything

## 📚 Documentation Files

- `README.md` - Complete server documentation
- `MONGODB_SETUP.md` - Step-by-step MongoDB setup
- `API_TESTING_GUIDE.md` - How to test each endpoint
- `QUICK_START.md` - This file

## Need Help?

1. Check the error message carefully
2. Review the relevant documentation file
3. Check MongoDB Atlas dashboard
4. Verify your environment variables
5. Test with Postman/Thunder Client first

## 🎉 You're All Set!

Your backend is ready. Just:
1. Set up MongoDB Atlas
2. Update .env file
3. Run `npm run dev`
4. Start building your frontend!

Good luck with your ScholarStream project! 🚀
