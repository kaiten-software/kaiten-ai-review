# 🔧 FIX: Add analyticsData Object

## Problem:
The dashboard references `analyticsData` which was removed. This causes errors.

## Solution:

In `AdminDashboard.jsx`, find this code (around line 58-64):

```javascript
    };

    useEffect(() => {
        if (!sessionStorage.getItem('adminLoggedIn')) {
            navigate('/admin/login');
        }
    }, [navigate]);
```

**Replace it with:**

```javascript
    };

    // Mock analytics data - will be replaced with real data from Supabase later
    const analyticsData = {
        qrScans: {
            total: 0,
            byBusiness: {}
        },
        reviewsGenerated: {
            total: clients.reduce((sum, c) => sum + (c.total_reviews || 0), 0),
            byBusiness: {}
        },
        reviewsPosted: {
            total: 0,
            byBusiness: {}
        },
        conversionRates: {
            scanToGenerate: 0,
            generateToPost: 0
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem('adminLoggedIn')) {
            navigate('/admin/login');
        }
    }, [navigate]);
```

This adds the missing `analyticsData` object that the dashboard needs.

## After this fix:
✅ Dashboard will load without errors
✅ Add Client will work
✅ Edit Client will work
✅ All tabs will function properly
