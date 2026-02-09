# 🗄️ SUPABASE DATABASE SETUP GUIDE

## ✅ **Step 1: Install Supabase Client** (COMPLETED)
```bash
npm install @supabase/supabase-js
```

## ✅ **Step 2: Environment Variables** (COMPLETED)
Created `.env` file with your credentials:
```
VITE_SUPABASE_URL=https://vudndicpyjvitmiubpmo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_w6LzQ4qFSa-k_kJocaTDmg_o98Pej56
```

## 📋 **Step 3: Create Database Tables** (ACTION REQUIRED)

### **How to Run the SQL:**

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste SQL**
   - Open the file: `database-setup.sql`
   - Copy ALL the SQL code
   - Paste it into the SQL Editor

4. **Run the SQL**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for "Success" message

5. **Verify Tables Created**
   - Click "Table Editor" in left sidebar
   - You should see two tables:
     - ✅ `clients`
     - ✅ `reviews`

## 📊 **Database Schema**

### **Table 1: `clients`**
Stores all business clients/customers

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| business_id | TEXT | Unique identifier (e.g., "raj-salon") |
| business_name | TEXT | Business name |
| email | TEXT | Contact email |
| phone | TEXT | Contact phone |
| address | TEXT | Business address |
| logo | TEXT | Emoji or URL |
| tagline | TEXT | Business tagline |
| description | TEXT | Business description |
| subscription_plan | TEXT | "monthly", "annual", "3-year" |
| subscription_status | TEXT | "active", "inactive", "trial", "expired" |
| subscription_start_date | TIMESTAMP | When subscription started |
| subscription_end_date | TIMESTAMP | When subscription ends |
| total_reviews | INTEGER | Total number of reviews |
| average_rating | DECIMAL | Average rating (0-5) |
| qr_code_url | TEXT | QR code URL |
| google_business_url | TEXT | Google Business profile URL |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | Last updated |

### **Table 2: `reviews`**
Stores all customer reviews

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| business_id | TEXT | Foreign key to clients |
| business_name | TEXT | Business name |
| customer_name | TEXT | Customer name |
| customer_email | TEXT | Customer email |
| customer_phone | TEXT | Customer phone |
| rating | INTEGER | Rating 1-5 |
| review_text | TEXT | Review content |
| qualities | TEXT[] | Selected qualities |
| feelings | TEXT[] | Selected feelings |
| service_used | TEXT | Service/product used |
| staff_member | TEXT | Staff member name |
| posted_to_google | BOOLEAN | If posted to Google |
| google_review_url | TEXT | Google review URL |
| is_public | BOOLEAN | If publicly visible |
| ip_address | TEXT | Customer IP |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | Last updated |

## 🔄 **How It Works**

### **Review Submission Flow:**

```
1. Customer fills review form
   ↓
2. Form data saved to Supabase (reviews table)
   ↓
3. Client statistics updated (total_reviews, average_rating)
   ↓
4. Customer redirected to Google Reviews
   ↓
5. Review marked as "posted_to_google" (optional tracking)
```

### **Admin Dashboard:**

```
- View all clients
- Add new clients
- View all reviews per client
- Filter and search
- Analytics and statistics
- Export data
```

## 🎯 **Features Implemented**

### **Client Management** ✅
- `addClient()` - Add new business client
- `getAllClients()` - Get all clients
- `getClientById()` - Get specific client
- `updateClient()` - Update client details
- `deleteClient()` - Remove client

### **Review Management** ✅
- `addReview()` - Save review to database
- `getAllReviews()` - Get all reviews
- `getReviewsByBusiness()` - Get reviews for specific business
- `markReviewAsPosted()` - Mark review as posted to Google
- `deleteReview()` - Remove review

### **Analytics** ✅
- `getAnalytics()` - Get dashboard statistics
- Total clients
- Total reviews
- Posted reviews
- Active subscriptions
- Conversion rate

## 🚀 **Next Steps**

### **1. Run the SQL** (REQUIRED)
- Copy `database-setup.sql` content
- Paste in Supabase SQL Editor
- Click "Run"

### **2. Test the Connection**
Once tables are created, the app will automatically:
- ✅ Save reviews when customers submit
- ✅ Update client statistics
- ✅ Display data in admin dashboard

### **3. Add Your First Client**
In the admin dashboard, you can:
- Add new clients
- View all reviews
- See analytics

## 📝 **Example Usage**

### **Add a Client:**
```javascript
import { addClient } from './lib/supabase';

const result = await addClient({
  business_id: 'my-restaurant',
  business_name: 'My Restaurant',
  email: 'contact@myrestaurant.com',
  phone: '+91 98765 43210',
  address: '123 Main St, Jaipur',
  logo: '🍽️',
  tagline: 'Best food in town',
  subscription_plan: 'monthly',
  google_business_url: 'https://g.page/my-restaurant'
});
```

### **Save a Review:**
```javascript
import { addReview } from './lib/supabase';

const result = await addReview({
  business_id: 'my-restaurant',
  business_name: 'My Restaurant',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  rating: 5,
  review_text: 'Amazing food and service!',
  qualities: ['Excellent Service', 'Great Food'],
  feelings: ['Happy', 'Satisfied']
});
```

## ⚠️ **Important Notes**

1. **Environment Variables**
   - Never commit `.env` to Git
   - Keep your Supabase keys secure
   - Already added to `.gitignore`

2. **Row Level Security (RLS)**
   - Enabled for both tables
   - Public access allowed (for demo)
   - Consider adding authentication for production

3. **Foreign Keys**
   - Reviews linked to clients via `business_id`
   - Deleting a client deletes all reviews (CASCADE)

4. **Auto-Updates**
   - `updated_at` automatically updated on changes
   - Client stats auto-calculated when reviews added/deleted

## 🎉 **Ready to Use!**

Once you run the SQL:
1. ✅ Database tables created
2. ✅ Review form saves to database
3. ✅ Admin dashboard shows real data
4. ✅ Analytics work automatically
5. ✅ Client management ready

**Run the SQL now and your database will be ready!** 🚀

---

**Need Help?**
- Check Supabase logs for errors
- Verify tables in Table Editor
- Test with sample data
- Check browser console for errors
