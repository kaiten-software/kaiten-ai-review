# 🚀 Super AI Review - Project Structure

## 📁 Current Directory Structure

```
version 2/
├── react-app/              ← 🎯 MAIN APPLICATION (React + Vite)
│   ├── src/                ← Source code
│   ├── public/             ← Static assets
│   ├── dist/               ← Production build (after npm run build)
│   └── package.json        ← Dependencies
│
├── _old_html_files/        ← 📦 ARCHIVED old static HTML files
│   ├── home.html
│   ├── dashboard.html
│   ├── admin-login.html
│   └── ... (all old HTML files)
│
├── index.html              ← 🔗 Redirect page to React app
├── README.md               ← This file
└── *.md                    ← Documentation files

```

## 🎯 How to Run the Application

### **Development Mode** (Recommended for development)
```bash
cd react-app
npm run dev
```
Then open: http://localhost:5173/

### **Production Build**
```bash
cd react-app
npm run build
npm run preview
```

## 📝 Important Notes

### ✅ **Active Files (DO NOT DELETE)**
- `react-app/` folder - This is your main application
- `index.html` - Redirect page
- All `.md` documentation files

### 📦 **Archived Files**
- `_old_html_files/` - Old static HTML files (kept for reference)
- These are NOT used anymore but preserved in case you need to reference them

## 🔄 What Changed?

**Before:**
- Opening `home.html` from folder → Old static HTML page
- Multiple disconnected HTML files
- No React functionality

**After:**
- Opening `index.html` from folder → Redirects to React app
- All old HTML files moved to `_old_html_files/`
- Clean, organized structure
- React app is the single source of truth

## 🌐 Accessing the Application

### Option 1: Development Server (Best for development)
1. Run `npm run dev` in the `react-app` folder
2. Open http://localhost:5173/ in your browser
3. Hot reload enabled - changes reflect instantly

### Option 2: Double-click index.html
1. Double-click `index.html` in Windows Explorer
2. It will auto-redirect to the dev server if running
3. Or show manual options to choose from

### Option 3: Production Build (For deployment)
1. Run `npm run build` in the `react-app` folder
2. Open `react-app/dist/index.html` in browser
3. Optimized, minified production code

## 📋 Current React Pages

- ✅ Home Page (`/`)
- ✅ Business Review Page (`/business/:businessId`)
- ✅ Review Generated (`/review-generated`)
- ✅ Private Feedback (`/private-feedback`)
- ✅ Admin Login (`/admin/login`)
- ✅ Admin Dashboard (`/admin/dashboard`)

## 🚧 Pages Still Needed (from old HTML)

- ❌ Signup Wizard
- ❌ FAQ Page
- ❌ Terms & Privacy Pages
- ❌ Review History
- ❌ Staff Performance
- ❌ Multi-Location
- ❌ Referrals
- ❌ Payments
- ❌ My Clients

## 🛠️ Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Heroicons

## 📞 Need Help?

If you need to restore any old HTML files, they're safely stored in `_old_html_files/` folder.

---

**Last Updated:** February 7, 2026
**Status:** ✅ React app running, old files archived
