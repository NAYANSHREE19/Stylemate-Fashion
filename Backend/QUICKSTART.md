# 🚀 QUICK START GUIDE

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 1.5: Start Local AI Server (SDXL)

In a separate terminal:

```bash
cd ../ai-server
pip install -r requirements.txt
python -m uvicorn ai_server:app --reload --port 8000
```

This enables local AI image generation for `/api/ai/generate-outfits`.

## Step 2: Setup MongoDB

### Option A: Install MongoDB Locally (Recommended for Quick Start)

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run installer (default settings)
3. MongoDB will start automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option B: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a cluster (M0 Free tier)
4. Create database user
5. Get connection string
6. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/stylemate
   ```

## Step 3: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:
```
🚀 StyleMate API running on port 5000
✅ MongoDB Connected
```

## Step 4: Seed Sample Data (Optional but Recommended)

Open a NEW terminal window and run:
```bash
cd backend
npm run seed
```

This adds 10 sample outfit styles to your database!

## Step 5: Test the API

Open browser and go to:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "Welcome to StyleMate API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

## Step 6: Test Registration

Use Postman, curl, or your React app to test:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🎉 Done!

Your backend is now running on `http://localhost:5000`

Next: Connect your React frontend to this backend!

---

## 📝 Quick Reference

### API Base URL
```
http://localhost:5000/api
```

### Main Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/style-guide` - Get all styles (no auth needed)
- `POST /api/quiz/submit` - Submit quiz (needs auth)
- `GET /api/recommendations` - Get recommendations (needs auth)
- `GET /api/wardrobe` - Get wardrobe items (needs auth)

### Test User (after registration)
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🚨 Troubleshooting

### Error: MongoDB connection failed
- Make sure MongoDB is running
- Check if port 27017 is available
- Try: `mongosh` in terminal to test connection

### Error: Port 5000 already in use
- Change PORT in `.env` file
- OR kill process: `npx kill-port 5000`

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Need Help?

Check the full README.md for detailed documentation!
