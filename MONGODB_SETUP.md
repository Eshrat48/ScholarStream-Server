# MongoDB Atlas Setup Guide

Follow these steps to set up MongoDB Atlas and connect it to your ScholarStream server:

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign In"
3. Create a new account or log in with Google

## Step 2: Create a New Cluster
1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Name your cluster (e.g., "ScholarStreamCluster")
6. Click "Create Cluster"

## Step 3: Create Database User
1. Click "Database Access" from the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Create a username (e.g., "scholarstreamadmin")
5. Create a strong password (save it securely!)
6. Set "Database User Privileges" to "Read and write to any database"
7. Click "Add User"

## Step 4: Allow Network Access
1. Click "Network Access" from the left sidebar
2. Click "Add IP Address"
3. For development:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your current IP address
4. Click "Confirm"

## Step 5: Get Connection String
1. Go back to "Database" from the left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver (version 5.5 or later)
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File
1. Open the `.env` file in your `scholar-stream-server` folder
2. Replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://scholarstreamadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/scholarStreamDB?retryWrites=true&w=majority
   ```
3. Replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - Add `/scholarStreamDB` before the `?` to specify the database name

## Step 7: Test the Connection
1. Open terminal in the server directory
2. Run: `npm run dev`
3. You should see:
   ```
   Connected to MongoDB!
   ScholarStream Server is running on port 5000
   All routes initialized successfully!
   ```

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Check your username and password in the connection string
- Make sure you're using the database user credentials (not your Atlas account password)

### Error: "MongooseServerSelectionError"
- Check your network access settings
- Make sure your IP is whitelisted (or use 0.0.0.0/0)
- Check your internet connection

### Error: "CORS Error"
- Make sure CLIENT_URL in .env matches your frontend URL
- Check CORS configuration in index.js

## Database Structure
The server will automatically create these collections when data is added:
- `users` - User accounts and roles
- `scholarships` - Scholarship listings
- `applications` - Student applications
- `reviews` - Scholarship reviews

## Viewing Your Data
1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select your database: `scholarStreamDB`
4. View and manage your collections

## Important Notes
- **Never commit your .env file to Git** (it's already in .gitignore)
- For production, restrict IP access to your server's IP only
- Change JWT_SECRET to a strong random string
- Keep your MongoDB password secure

## Next Steps
After successful connection:
1. Test API endpoints using Postman or Thunder Client
2. Connect your React frontend to the backend
3. Test user registration and login
4. Test scholarship CRUD operations

Happy coding! 🚀
