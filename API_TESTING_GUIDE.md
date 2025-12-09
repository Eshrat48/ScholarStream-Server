# API Testing Guide

Use this guide to test your API endpoints using Postman, Thunder Client, or any API testing tool.

## Base URL
```
http://localhost:5000
```

## 1. Test Server Health
**GET** `http://localhost:5000/`

Expected Response:
```json
"ScholarStream Server is running!"
```

---

## 2. User Registration
**POST** `http://localhost:5000/api/users`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://i.ibb.co/sample.jpg"
}
```

Expected Response:
```json
{
  "acknowledged": true,
  "insertedId": "658a1b2c3d4e5f6g7h8i9j0k"
}
```

---

## 3. Generate JWT Token
**POST** `http://localhost:5000/api/auth/jwt`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "email": "john@example.com"
}
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** Copy this token! You'll need it for protected routes.

---

## 4. Get User by Email (Protected)
**GET** `http://localhost:5000/api/users/john@example.com`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Expected Response:
```json
{
  "_id": "658a1b2c3d4e5f6g7h8i9j0k",
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://i.ibb.co/sample.jpg",
  "role": "Student",
  "createdAt": "2024-12-09T10:30:00.000Z"
}
```

---

## 5. Add Scholarship (Admin Only)
**POST** `http://localhost:5000/api/scholarships`

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

Body (JSON):
```json
{
  "scholarshipName": "Merit Scholarship 2024",
  "universityName": "Harvard University",
  "universityImage": "https://i.ibb.co/harvard.jpg",
  "universityCountry": "USA",
  "universityCity": "Cambridge",
  "universityWorldRank": 1,
  "subjectCategory": "Computer Science",
  "scholarshipCategory": "Full fund",
  "degree": "Masters",
  "tuitionFees": "50000",
  "applicationFees": "100",
  "serviceCharge": "10",
  "applicationDeadline": "2024-12-31",
  "postedUserEmail": "admin@example.com"
}
```

---

## 6. Get All Scholarships (with filters)
**GET** `http://localhost:5000/api/scholarships?page=1&limit=10`

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name, university, or degree
- `country` - Filter by country
- `category` - Filter by scholarship category
- `sortBy` - Sort field (applicationFees, postDate)
- `sortOrder` - Sort direction (asc, desc)

Examples:
```
/api/scholarships?search=harvard
/api/scholarships?country=USA&category=Full%20fund
/api/scholarships?sortBy=applicationFees&sortOrder=asc
```

---

## 7. Get Top 6 Scholarships
**GET** `http://localhost:5000/api/scholarships/top`

Expected Response: Array of 6 scholarships with lowest application fees

---

## 8. Get Scholarship by ID
**GET** `http://localhost:5000/api/scholarships/658a1b2c3d4e5f6g7h8i9j0k`

---

## 9. Create Application (Protected)
**POST** `http://localhost:5000/api/applications`

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Body (JSON):
```json
{
  "scholarshipId": "658a1b2c3d4e5f6g7h8i9j0k",
  "userId": "658b2c3d4e5f6g7h8i9j0k1l",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "universityName": "Harvard University",
  "scholarshipCategory": "Full fund",
  "degree": "Masters",
  "applicationFees": "100",
  "serviceCharge": "10",
  "paymentStatus": "paid"
}
```

---

## 10. Get User Applications (Protected)
**GET** `http://localhost:5000/api/applications/user/john@example.com`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 11. Add Review (Protected)
**POST** `http://localhost:5000/api/reviews`

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Body (JSON):
```json
{
  "scholarshipId": "658a1b2c3d4e5f6g7h8i9j0k",
  "universityName": "Harvard University",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userImage": "https://i.ibb.co/sample.jpg",
  "ratingPoint": 5,
  "reviewComment": "Excellent scholarship program!"
}
```

---

## 12. Get Reviews by Scholarship
**GET** `http://localhost:5000/api/reviews/scholarship/658a1b2c3d4e5f6g7h8i9j0k`

---

## 13. Create Payment Intent (Protected)
**POST** `http://localhost:5000/api/create-payment-intent`

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Body (JSON):
```json
{
  "amount": 110
}
```

Expected Response:
```json
{
  "clientSecret": "pi_xxxxx_secret_xxxxx"
}
```

---

## 14. Get Admin Statistics (Admin Only)
**GET** `http://localhost:5000/api/analytics/stats`

Headers:
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

Expected Response:
```json
{
  "totalUsers": 150,
  "totalScholarships": 45,
  "totalApplications": 320,
  "totalFeesCollected": "35200.00"
}
```

---

## Testing Workflow

### For Students:
1. Register user → Get JWT token
2. Browse scholarships (GET /api/scholarships)
3. View scholarship details (GET /api/scholarships/:id)
4. Create payment intent
5. Submit application (POST /api/applications)
6. View my applications (GET /api/applications/user/:email)
7. Add review (POST /api/reviews)

### For Moderators:
1. Get all applications (GET /api/applications)
2. Update application status (PATCH /api/applications/:id/status)
3. Add feedback (PATCH /api/applications/:id/feedback)
4. View/delete reviews (GET, DELETE /api/reviews)

### For Admins:
1. View all users (GET /api/users)
2. Update user roles (PATCH /api/users/:id/role)
3. Add scholarships (POST /api/scholarships)
4. Update scholarships (PUT /api/scholarships/:id)
5. Delete scholarships (DELETE /api/scholarships/:id)
6. View analytics (GET /api/analytics/*)

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```
**Solution:** Check if JWT token is valid and included in Authorization header

### 403 Forbidden
```json
{
  "message": "Forbidden access"
}
```
**Solution:** User doesn't have required role/permissions

### 500 Internal Server Error
```json
{
  "message": "Error message here",
  "error": "Detailed error"
}
```
**Solution:** Check server logs and database connection

---

## Tips
1. **Save your JWT tokens** - You'll need them for multiple requests
2. **Use environment variables** - Create a Postman environment for base URL and tokens
3. **Test in order** - Create users before testing protected routes
4. **Check MongoDB** - View your data in MongoDB Atlas after each operation
5. **Test error cases** - Try invalid IDs, missing fields, etc.

Happy Testing! 🧪
