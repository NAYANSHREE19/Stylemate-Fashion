# 🚀 StyleMate Backend API

Complete backend API for StyleMate - Your Personal Fashion Assistant

## 📋 Features

- ✅ **User Authentication** (JWT-based)
- ✅ **Fashion Quiz System** with personalized recommendations
- ✅ **Style Guide** with filtering and search
- ✅ **Wardrobe Management** (personal closet tracker)
- ✅ **Favorites System** (bookmark outfits)
- ✅ **Recommendations Engine** (personalized outfit suggestions)
- ✅ **RESTful API** with proper error handling
- ✅ **Rate Limiting** & Security middleware
- ✅ **MongoDB** with Mongoose ODM

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection
- **Morgan** for logging
- **CORS** enabled

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Choose ONE:

# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/stylemate

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stylemate?retryWrites=true&w=majority

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_change_this_123456
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB

  # macOS/Linux
  brew services start mongodb-community
  # OR
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account & cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password
6. Paste into `.env` as `MONGODB_URI`

### 4. Seed Sample Data (Optional)

Populate database with sample outfits:

```bash
npm run seed
```

### 5. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
🚀 StyleMate API running on port 5000
🌍 Environment: development
📍 API Base URL: http://localhost:5000
✅ MongoDB Connected: localhost
📦 Database: stylemate
```

---

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| PUT | `/auth/update-password` | Update password | ✅ |

**Example: Register**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Example: Login**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response: (same as register)
```

---

### 👤 User Management (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get user profile | ✅ |
| PUT | `/users/profile` | Update profile | ✅ |
| PUT | `/users/preferences` | Update style preferences | ✅ |
| DELETE | `/users/account` | Deactivate account | ✅ |

---

### 📝 Quiz System (`/api/quiz`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/quiz/submit` | Submit quiz answers | ✅ |
| GET | `/quiz/history` | Get quiz history | ✅ |
| GET | `/quiz/latest` | Get latest quiz result | ✅ |

**Example: Submit Quiz**
```json
POST /api/quiz/submit
{
  "lifestyle": "Creative",
  "stylePersonality": ["Minimalist", "Edgy"],
  "colorPreferences": ["Neutrals", "Bold colors"],
  "bodyType": "Hourglass",
  "budget": "Mid-range"
}

Response:
{
  "success": true,
  "data": {
    "styleDNA": "Creative Minimalist + Edgy lover who rocks Neutrals & Bold colors...",
    "recommendations": [...]
  }
}
```

---

### 💡 Recommendations (`/api/recommendations`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/recommendations` | Get personalized recommendations | ✅ |
| GET | `/recommendations/:id` | Get single outfit | ❌ |
| GET | `/recommendations/occasion/:occasion` | Filter by occasion | ✅ |
| GET | `/recommendations/category/:category` | Filter by category | ✅ |

---

### 📖 Style Guide (`/api/style-guide`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/style-guide` | Get all styles (with filters) | ❌ |
| GET | `/style-guide/trending` | Get trending styles | ❌ |
| GET | `/style-guide/:id` | Get single style | ❌ |
| POST | `/style-guide` | Create new style | ✅ |
| POST | `/style-guide/:id/like` | Like a style | ✅ |

**Query Parameters for GET `/style-guide`:**
- `category` - Filter by category (Casual, Formal, Business, Evening)
- `search` - Search in title/description/tags
- `tags` - Filter by tags (comma-separated)
- `season` - Filter by season

---

### 👗 Wardrobe Manager (`/api/wardrobe`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/wardrobe` | Get all wardrobe items | ✅ |
| GET | `/wardrobe/stats` | Get wardrobe statistics | ✅ |
| GET | `/wardrobe/:id` | Get single item | ✅ |
| POST | `/wardrobe` | Add item to wardrobe | ✅ |
| PUT | `/wardrobe/:id` | Update wardrobe item | ✅ |
| DELETE | `/wardrobe/:id` | Delete wardrobe item | ✅ |
| PATCH | `/wardrobe/:id/favorite` | Toggle favorite | ✅ |
| PATCH | `/wardrobe/:id/wear` | Increment times worn | ✅ |

**Example: Add Wardrobe Item**
```json
POST /api/wardrobe
{
  "name": "Blue Denim Jacket",
  "category": "Outerwear",
  "color": "Blue",
  "brand": "Levi's",
  "season": ["Spring", "Fall"],
  "occasion": ["Casual", "All"],
  "tags": ["denim", "jacket", "classic"],
  "price": 89.99
}
```

---

### ❤️ Favorites (`/api/favorites`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/favorites` | Get all favorites | ✅ |
| GET | `/favorites/check/:outfitId` | Check if outfit is favorited | ✅ |
| POST | `/favorites/:outfitId` | Add to favorites | ✅ |
| DELETE | `/favorites/:outfitId` | Remove from favorites | ✅ |

---

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**In JavaScript/React:**
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/recommendations', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 📁 Project Structure

```
backend/
├── server.js                 # Main entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore
│
├── config/
│   └── database.js           # MongoDB connection
│
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── QuizResult.js
│   ├── Outfit.js
│   ├── WardrobeItem.js
│   └── Favorite.js
│
├── controllers/              # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── quizController.js
│   ├── recommendationController.js
│   ├── styleGuideController.js
│   ├── wardrobeController.js
│   └── favoriteController.js
│
├── routes/                   # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── quizRoutes.js
│   ├── recommendationRoutes.js
│   ├── styleGuideRoutes.js
│   ├── wardrobeRoutes.js
│   └── favoriteRoutes.js
│
├── middleware/               # Custom middleware
│   ├── authMiddleware.js     # JWT verification
│   ├── errorMiddleware.js    # Error handling
│   ├── rateLimiter.js        # Rate limiting
│   └── validationMiddleware.js
│
└── utils/                    # Helper functions
    ├── recommendationEngine.js
    └── seed.js               # Sample data seeder
```

---

## 🧪 Testing the API

### Using cURL:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Using Postman:
1. Import the API endpoints
2. Create environment variable `base_url = http://localhost:5000`
3. After login, save the token
4. Use `{{token}}` in Authorization header for protected routes

---

## 🚨 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change port in `.env` or kill process using port 5000

### JWT Token Invalid
**Solution:** Make sure you're sending the correct token format:
```
Authorization: Bearer YOUR_TOKEN
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Rate Limiting** - Protection against brute force (5 login attempts per 15 min)
- ✅ **Helmet** - Security headers
- ✅ **Input Validation** - Express Validator
- ✅ **CORS** - Configured for frontend origin
- ✅ **Error Handling** - Sanitized error messages

---

## 📈 Next Steps

1. **Connect Frontend** - Update React app to use these APIs
2. **Add Image Upload** - Integrate Cloudinary for wardrobe photos
3. **AI Integration** - Connect OpenAI for smart recommendations
4. **Weather API** - Add weather-based suggestions
5. **Payment Gateway** - For premium features
6. **Email Service** - Password reset & notifications
7. **Social Features** - User follows, comments, etc.

---

## 🤝 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify `.env` configuration
3. Check console logs for errors
4. Ensure all dependencies are installed (`npm install`)

---

## 📝 License

MIT License

---

**Built with ❤️ for StyleMate**
