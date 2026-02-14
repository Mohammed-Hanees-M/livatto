# Livatto - Development Setup Guide

## Quick Start Guide

### Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ PostgreSQL database (local or cloud)
- ✅ Git (optional)

### Step 1: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Edit `backend/.env` file with your database credentials:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/livatto?schema=public"
JWT_SECRET="change-this-to-a-secure-random-string"
```

4. **Run database migrations:**
```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma Client
- Set up the schema

5. **Generate Prisma Client (if not auto-generated):**
```bash
npx prisma generate
```

6. **Start backend server:**
```bash
npm run start:dev
```

Backend should now be running on **http://localhost:3001**

### Step 2: Frontend Setup

1. **Open new terminal and navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Verify environment configuration:**

Check `frontend/.env.local` exists with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Start frontend development server:**
```bash
npm run dev
```

Frontend should now be running on **http://localhost:3000**

### Step 3: Create Your First User

**Option A: Via Frontend (Recommended)**
1. Open browser: `http://localhost:3000`
2. You'll be redirected to login page
3. Click "Register here"
4. Fill in:
   - Name: Admin (optional)
   - Email: admin@livatto.com
   - Password: password123 (minimum 6 characters)
5. Click "Create Account"
6. You'll be automatically logged in and redirected to dashboard

**Option B: Via API (cURL)**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@livatto.com","password":"password123","name":"Admin"}'
```

**Option C: Via Prisma Studio**
```bash
cd backend
npx prisma studio
```
- Browser opens at http://localhost:5555
- Navigate to User table
- Click "Add record"
- Fill in email and password (hash manually or use API)

### Step 4: Verify Everything Works

1. **Check Backend:**
   - Visit: http://localhost:3001
   - You should see "Cannot GET /" (this is normal - backend is API only)

2. **Test Login:**
   - Go to `http://localhost:3000/login`
   - Login with your created credentials
   - Should redirect to dashboard

3. **Check Dashboard:**
   - See analytics cards (all zeros initially)
   - Active stream section (empty)
   - System health (all green)

---

## Common Issues & Solutions

### Issue: "DATABASE_URL" not found

**Solution:**
- Make sure `.env` file exists in `backend/` directory
- Verify it contains `DATABASE_URL=...`
- Restart backend server

### Issue: Database connection failed

**Solution:**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Try connecting with a database client to verify

### Issue: Prisma Client not generated

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=3002
```

### Issue: Frontend can't connect to backend

**Solution:**
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend/.env.local
- Check CORS settings in backend/src/main.ts

---

## Database Management

### View Database (Prisma Studio)
```bash
cd backend
npx prisma studio
```
Opens GUI at http://localhost:5555

### Reset Database
```bash
cd backend
npx prisma migrate reset
```
⚠️ **Warning:** This deletes all data!

### Create New Migration
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

---

## Development Workflow

### Typical Development Cycle

1. **Start both servers** (backend & frontend in separate terminals)

2. **Make changes** to code

3. **Backend changes:**
   - NestJS auto-reloads on save
   - If schema changes: `npx prisma migrate dev`

4. **Frontend changes:**
   - Next.js auto-reloads on save
   - See changes immediately in browser

### Recommended Tools

- **VS Code Extensions:**
  - Prisma (syntax highlighting)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

- **API Testing:**
  - Thunder Client (VS Code extension)
  - Postman
  - cURL

---

## Project Scripts

### Backend
```bash
npm run start:dev   # Development server with hot reload
npm run build       # Build for production
npm run start:prod  # Run production build
```

### Frontend
```bash
npm run dev         # Development server
npm run build       # Build for production
npm run start       # Run production build
npm run lint        # Run ESLint
```

---

## Next Steps

Once everything is running:

1. **Explore the Dashboard** - Familiarize yourself with the UI
2. **Upload a Video** - (Note: Video upload UI page needs to be created)
3. **Check Analytics** - See metrics update
4. **Review Code** - Understand the architecture
5. **Read Walkthrough** - See `walkthrough.md` for detailed implementation overview

## Getting Help

- Check `README.md` for comprehensive documentation
- Review `walkthrough.md` for implementation details
- Inspect backend logs for errors
- Use browser DevTools for frontend issues

---

**You're all set! Happy coding! 🚀**
