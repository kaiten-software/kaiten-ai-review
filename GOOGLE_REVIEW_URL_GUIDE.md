# Google Business Review URL Integration Guide

## Overview
This feature allows business clients to add their Google Business review page URL, enabling customers to be redirected directly to their Google review page when they submit a 5-star review.

## How It Works

### 1. **Admin Setup (Adding a Client)**
When adding a new client through the Admin Dashboard:

1. Navigate to **Admin Dashboard** → Click **"+ Add Client"**
2. Fill in all the basic information (Business Name, Type, Contact Details, etc.)
3. In the **Contact Information** section, you'll find a new field:
   - **Google Business Review URL** (optional)
   - Paste the direct Google review page URL for the business
   - Format: `https://g.page/r/YOUR_PLACE_ID/review`

4. Click **"Add Client with AI"** to save

### 2. **Customer Review Flow**
When a customer submits a review:

**For 5-Star Reviews:**
1. Customer fills out the review form on the business page
2. Submits a 5-star rating
3. AI generates a professional review (short and long versions)
4. Customer can copy the review
5. Customer fills in their personal details (name, email, phone)
6. Clicks **"Post on Google"** button
7. **NEW:** They are redirected to the exact Google review page URL configured by the admin
8. Customer pastes the copied review and submits on Google

**For 1-3 Star Reviews:**
- These are kept private and not posted to Google
- Feedback is saved internally for the business owner

### 3. **Fallback Behavior**
If no Google Business URL is configured:
- The system falls back to a Google search: `"Business Name reviews"`
- Customer is taken to Google search results where they can find the business

## How to Get Your Google Review URL

### Method 1: Google Business Profile
1. Go to [Google Business Profile](https://business.google.com/)
2. Select your business
3. Click on "Get more reviews"
4. Copy the review link (format: `https://g.page/r/YOUR_PLACE_ID/review`)

### Method 2: Google Maps
1. Search for your business on Google Maps
2. Click on your business listing
3. Scroll down to the "Reviews" section
4. Click "Write a review"
5. Copy the URL from your browser's address bar
6. The URL should look like: `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`

### Method 3: Short URL (Recommended)
1. Use the format: `https://g.page/r/YOUR_PLACE_ID/review`
2. Replace `YOUR_PLACE_ID` with your actual Google Place ID
3. This is the cleanest and most reliable format

## Database Schema

The `google_business_url` field is stored in the `clients` table:

```sql
CREATE TABLE clients (
  ...
  google_business_url TEXT,
  ...
);
```

## Migration for Existing Databases

If you already have a database set up, run the migration script:

```bash
# In Supabase SQL Editor, run:
migration-add-google-url.sql
```

This will add the `google_business_url` column to your existing `clients` table.

## Example URLs

Here are some example Google review URLs:

- **Direct Review Link:** `https://g.page/r/CZQxBUCz0VqpEAI/review`
- **Place ID Format:** `https://search.google.com/local/writereview?placeid=ChIJqVWzwELBQjQRAgVqz0FBQMw`
- **Maps Share Link:** `https://maps.app.goo.gl/ABC123xyz`

## Benefits

✅ **Direct Navigation:** Customers go straight to your review page
✅ **Improved Conversion:** Fewer steps = more reviews posted
✅ **Better UX:** No searching required, instant access
✅ **Tracking:** You can see which reviews came from your platform
✅ **Professional:** Seamless integration with Google Business

## Testing

To test the feature:

1. Add a test client with a Google review URL
2. Navigate to that business's page
3. Submit a 5-star review
4. Copy the generated review
5. Fill in personal details
6. Click "Post on Google"
7. Verify you're redirected to the correct Google review page
8. Paste and submit the review on Google

## Troubleshooting

**Issue:** "Post on Google" button doesn't redirect to the right page
- **Solution:** Verify the Google Business URL is correct and active
- Check that the URL format is valid
- Ensure the business has claimed their Google Business Profile

**Issue:** URL field is not showing in Add Client modal
- **Solution:** Clear browser cache and refresh
- Verify you're running the latest version of the code

**Issue:** Database error when saving Google URL
- **Solution:** Run the migration script `migration-add-google-url.sql`
- Verify the `google_business_url` column exists in the `clients` table

## Code Files Modified

1. **AddClientModal.jsx** - Added Google URL input field
2. **BusinessPage.jsx** - Passes Google URL through review flow
3. **ReviewGenerated.jsx** - Uses Google URL for "Post on Google" button
4. **database-setup.sql** - Includes google_business_url column
5. **migration-add-google-url.sql** - Migration for existing databases

## Future Enhancements

- [ ] Auto-detect Google Place ID from business name
- [ ] Validate Google review URLs before saving
- [ ] Track click-through rates on "Post on Google" button
- [ ] Show preview of Google review page in admin panel
- [ ] Bulk import Google URLs for multiple businesses
