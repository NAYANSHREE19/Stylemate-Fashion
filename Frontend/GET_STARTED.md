# ⚡ GET STARTED IN 5 MINUTES!

## 🎉 YOUR AMAZING FULL-STACK APP IS READY!

Everything is integrated and ready to run. Here's how to start:

---

## 📦 STEP 1: INSTALL DEPENDENCIES (2 Minutes)

### Backend Installation:
```bash
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/backend"
npm install
```

### Frontend Installation:
```bash
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/StyleMate"
npm install
```

✅ This installs all dependencies (Express, MongoDB, Axios, etc.)

---

## 🚀 STEP 2: START BACKEND (Terminal 1)

```bash
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/backend"
npm run dev
```

✅ **YOU SHOULD SEE:**
```
🚀 StyleMate API running on port 5000
🌍 Environment: development
📍 API Base URL: http://localhost:5000
✅ MongoDB Connected: localhost
📦 Database: stylemate
```

**❗ KEEP THIS TERMINAL OPEN!**

---

## 🎨 STEP 3: START FRONTEND (Terminal 2 - New Window!)

Open a **NEW terminal window** and run:

```bash
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/StyleMate"
npm run dev
```

✅ **YOU SHOULD SEE:**
```
VITE v7.0.4  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**❗ KEEP THIS TERMINAL OPEN TOO!**

---

## 🌐 STEP 4: OPEN IN BROWSER

```
http://localhost:5173
```

---

## 🎯 STEP 5: TEST IT! (2 Minutes)

### Test 1: Register
1. Click **"Sign Up"** button in header
2. Fill in:
   - Name: **Test User**
   - Email: **test@example.com**
   - Password: **password123**
3. Click **"Sign Up"**
4. ✅ You'll be redirected to Quiz page!

### Test 2: Take Quiz
1. Answer all 5 questions (click any options)
2. Click **"Next"** through questions
3. Click **"Finish"** on last question
4. ✅ See **"Your Style Profile is Ready!"**
5. ✅ See your personalized recommendations

### Test 3: View All Features
- Click **"View Full Recommendations"** button
- Check the **"Style Guide"** page
- Click **"Logout"** to test logout
- Try logging in again with same credentials

---

## 🎨 OPTIONAL: Add Sample Data (Recommended!)

To populate your Style Guide with 10 beautiful outfit styles:

**Open a 3rd terminal:**

```bash
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/backend"
npm run seed
```

✅ **YOU'LL SEE:**
```
✅ 10 outfits added
✅ Sample data seeded successfully!
```

Now refresh the Style Guide page and you'll see 10 styles!

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected (check backend terminal)
- [ ] Can register a new user
- [ ] Can take the quiz
- [ ] See recommendations
- [ ] Can logout and login
- [ ] Style Guide shows styles (if seeded)

---

## 🆘 PROBLEMS?

### "MongoDB connection failed"
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### "Port 5000 already in use"
- Kill the process using port 5000
- Or change `PORT=5000` in `backend/.env` to a different port

### "Cannot GET /api/..."
- Make sure backend is running
- Check backend terminal for errors

### Frontend can't connect
- Check `.env` file in StyleMate folder
- Should have: `VITE_API_URL=http://localhost:5000/api`

---

## 📂 IMPORTANT FILES

### Frontend:
- `StyleMate/PROJECT_SUMMARY.md` - Complete project overview
- `StyleMate/FRONTEND_SETUP.md` - Detailed frontend guide
- `StyleMate/.env` - Backend API URL configuration

### Backend:
- `backend/README.md` - Complete API documentation
- `backend/QUICKSTART.md` - Quick backend setup
- `backend/.env` - Backend configuration (MongoDB, JWT)

---

## 🎯 QUICK COMMANDS

### Start Everything:
```bash
# Terminal 1 - Backend
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/backend" && npm run dev

# Terminal 2 - Frontend
cd "c:/Users/ANURAG/Desktop/Web development/Nanu fashion design/StyleMate" && npm run dev
```

### Stop Everything:
Press **Ctrl + C** in each terminal

---

## 🌟 WHAT YOU BUILT

✅ **Full-Stack App** - React + Node.js + MongoDB
✅ **Authentication** - JWT-based secure login/signup
✅ **Quiz System** - Interactive 5-question quiz
✅ **Recommendations** - Personalized outfit suggestions
✅ **Style Guide** - Browse and search fashion styles
✅ **Protected Routes** - Auth-required pages
✅ **Error Handling** - Beautiful error pages
✅ **Loading States** - Smooth user experience
✅ **Responsive Design** - Works on all devices
✅ **Production-Ready** - Secure and scalable

---

## 🚀 READY? LET'S GO!

1. ✅ Install dependencies (both folders)
2. ✅ Start backend (Terminal 1)
3. ✅ Start frontend (Terminal 2)
4. ✅ Open http://localhost:5173
5. ✅ Register and test!

---

**🎉 THAT'S IT! YOU'RE READY TO START!**

**Open 2 terminals and run the commands above!** 🚀

---

Need help? Check:
- `PROJECT_SUMMARY.md` - Full details
- `FRONTEND_SETUP.md` - Frontend guide
- `backend/README.md` - Backend API docs

**Happy coding! 👗💻✨**
