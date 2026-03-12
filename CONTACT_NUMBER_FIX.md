# Contact Number Centralization Fix

## Issue
Multiple pages throughout the application were using hardcoded contact numbers instead of fetching the contact number from the admin settings in the database. This meant:
- When the admin updated the contact number in settings, it wouldn't reflect on all pages
- Different pages could show different phone numbers
- The hardcoded number (01322 879 713) didn't match the current database value (01892-336-315)

## Database Reference
The contact number is stored in the `site_settings` table:
- `contact_phone`: "01892-336-315" (used for general contact)
- `company_phone`: "+44 (01892) 336 315" (formatted for business use)

## Changes Made

### Pages Updated to Fetch Dynamic Contact Number

1. **ServiceCoveragePage.tsx** (`src/pages/ServiceCoveragePage.tsx`)
   - Added state: `contactPhone`
   - Added function: `fetchSettings()` to load contact_phone from database
   - Updated phone link to use dynamic value
   - Updated fallback from "01322 879 713" to "01892-336-315"

2. **ServiceAreaPage.tsx** (`src/pages/ServiceAreaPage.tsx`)
   - Added state: `contactPhone`
   - Added function: `fetchSettings()` to load contact_phone from database
   - Updated phone link to use dynamic value
   - Updated fallback from "01322 879 713" to "01892-336-315"

3. **TrackRepairPage.tsx** (`src/pages/TrackRepairPage.tsx`)
   - Added state: `contactPhone`
   - Added function: `fetchSettings()` to load contact_phone from database
   - Updated phone link from placeholder "+441234567890" to dynamic value
   - Set fallback to "01892-336-315"

4. **CustomerPortalPage.tsx** (`src/pages/CustomerPortalPage.tsx`)
   - Added state: `contactPhone`
   - Added function: `fetchSettings()` to load contact_phone from database
   - Updated phone link from placeholder "+442390000000" to dynamic value
   - Set fallback to "01892-336-315"

### Fallback Values Updated (Already Fetching Dynamically)

These components were already fetching the contact number dynamically but had outdated fallback values:

5. **Navigation.tsx** (`src/components/Navigation.tsx`)
   - Updated fallback from "01322 879 713" to "01892-336-315"
   - Already fetches from `company_phone`

6. **Footer.tsx** (`src/components/Footer.tsx`)
   - Updated fallback from "01322 879 713" to "01892-336-315"
   - Already fetches from `company_phone`

7. **CTABlock.tsx** (`src/components/blog/CTABlock.tsx`)
   - Updated fallback from "01322 879 713" to "01892-336-315"
   - Already fetches from `contact_phone`

8. **ContactPage.tsx** (`src/pages/ContactPage.tsx`)
   - Updated fallback from "+44 (01322) 879 713" to "+44 (01892) 336 315"
   - Updated meta description to use dynamic phone number
   - Already fetches from `company_phone`

## Implementation Pattern

All pages now follow this pattern:

```typescript
// Add state for contact phone
const [contactPhone, setContactPhone] = useState<string>('01892-336-315');

// Fetch settings on mount
useEffect(() => {
  fetchSettings();
}, []);

async function fetchSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('contact_phone')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data?.contact_phone) {
      setContactPhone(data.contact_phone);
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  }
}

// Use in JSX
<a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}>
  {contactPhone || '01892-336-315'}
</a>
```

## Phone Number Formatting

The application handles phone numbers in multiple formats:
- Display format: "01892-336-315" or "+44 (01892) 336 315"
- Tel link format: Strips non-numeric characters except `+` using `.replace(/[^0-9+]/g, '')`

## Testing

To verify the changes work:

1. **Update contact number in admin settings**:
   - Login to admin dashboard
   - Go to Settings
   - Update "Contact Phone" field
   - Save changes

2. **Verify pages reflect the change**:
   - Homepage (in navigation and footer)
   - Service Coverage page
   - All Service Area pages (e.g., /service-area/bexley)
   - Track Repair page
   - Customer Portal page
   - Contact page (including meta description)
   - Blog posts (CTA blocks)

3. **Check phone links work**:
   - Click phone numbers on any page
   - Should open dialer with correct number

## Benefits

✅ **Centralized Management**: Admin can update the contact number once in settings
✅ **Consistency**: All pages show the same contact number
✅ **Dynamic Updates**: Changes reflect immediately after database update
✅ **SEO Benefit**: Contact page meta description now uses dynamic phone number
✅ **Fallback Safety**: If database query fails, fallback to current number

## Database Query Used

```sql
SELECT contact_phone FROM site_settings LIMIT 1;
-- OR
SELECT company_phone FROM site_settings LIMIT 1;
```

Current values:
- `contact_phone`: "01892-336-315"
- `company_phone`: "+44 (01892) 336 315"

## Files Modified

- `src/pages/ServiceCoveragePage.tsx`
- `src/pages/ServiceAreaPage.tsx`
- `src/pages/TrackRepairPage.tsx`
- `src/pages/CustomerPortalPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/components/Navigation.tsx`
- `src/components/Footer.tsx`
- `src/components/blog/CTABlock.tsx`

## Build Status

✅ Build successful with no errors
✅ All TypeScript checks passed
✅ Contact numbers now centralized and dynamic
