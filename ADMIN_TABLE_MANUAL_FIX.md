# MANUAL FIX INSTRUCTIONS - AdminDashboard.jsx

## Issue: The table is using `filteredClients` but still has old field names

### Step-by-Step Fix:

1. **Line 290** - Already fixed ✅ (`filteredClients.map`)

2. **Line 302** - Change:
```javascript
<div className="font-semibold">{business.name}</div>
```
To:
```javascript
<div className="font-semibold">{business.business_name || business.name || 'Unnamed'}</div>
```

3. **Line 310** - Change:
```javascript
<span className="font-semibold">{business.rating}</span>
```
To:
```javascript
<span className="font-semibold">{business.average_rating || '0.0'}</span>
```

4. **Line 314** - Change:
```javascript
<span className="font-semibold">{business.reviewCount}</span>
```
To:
```javascript
<span className="font-semibold">{business.total_reviews || 0}</span>
```

5. **Line 317** - Change:
```javascript
<span className="text-gray-600">{business.services.length} services</span>
```
To:
```javascript
<span className="text-gray-600">{business.services?.length || 0} services</span>
```

6. **Line 321** - Change:
```javascript
href={getQRCodeUrl(business.id)}
```
To:
```javascript
href={getQRCodeUrl(business.business_id || business.id)}
```

7. **Line 322** - Change:
```javascript
download={`${business.id}-qr.png`}
```
To:
```javascript
download={`${business.business_id || business.id}-qr.png`}
```

8. **Line 329-335** - Replace the entire `<td>` with Edit + View buttons:
```javascript
<td className="px-6 py-4">
    <div className="flex items-center gap-2">
        <button
            onClick={() => {
                setEditingClient(business);
                setShowEditClientModal(true);
            }}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
        >
            <PencilIcon className="w-4 h-4" />
            Edit
        </button>
        <button
            onClick={() => navigate(`/business/${business.business_id || business.id}`)}
            className="text-primary hover:text-primary-dark font-semibold"
        >
            View →
        </button>
    </div>
</td>
```

9. **Line 343** - Change:
```javascript
{filteredBusinesses.length === 0 && (
```
To:
```javascript
{filteredClients.length === 0 && (
```

---

## OR Use This Complete Replacement:

Replace lines 290-338 with:
```javascript
                            {filteredClients.map((business, index) => (
                                <motion.tr
                                    key={business.business_id || business.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{business.logo || '🏢'}</div>
                                            <div>
                                                <div className="font-semibold">{business.business_name || business.name || 'Unnamed'}</div>
                                                <div className="text-sm text-gray-500">{business.tagline || ''}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{business.average_rating || '0.0'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold">{business.total_reviews || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{business.services?.length || 0} services</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={getQRCodeUrl(business.business_id || business.id)}
                                            download={`${business.business_id || business.id}-qr.png`}
                                            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold"
                                        >
                                            <QrCodeIcon className="w-5 h-5" />
                                            Download
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingClient(business);
                                                    setShowEditClientModal(true);
                                                }}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => navigate(`/business/${business.business_id || business.id}`)}
                                                className="text-primary hover:text-primary-dark font-semibold"
                                            >
                                                View →
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
```

---

**After these changes, the admin dashboard will work correctly!**
