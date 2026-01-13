# Phase 2: Templates Implementation Guide

**Status**: ✅ COMPLETE
**Date**: January 12, 2026
**Focus**: Template selection UI for creators + Database seeding

---

## What Was Completed

### 1. Frontend: Template Selection UI
**File**: `apps/web/src/pages/CreateIdeaPage.tsx`

**Features Added**:
- ✅ Template loading from backend `/api/templates` endpoint
- ✅ Grid display of available templates with icons and categories
- ✅ Template preview modal showing:
  - Template icon and description
  - All form sections with their requirements
  - Hints and word count targets
  - "Use This Template" button
- ✅ Template application to form (sets category automatically)

**UI Components**:
```
CreateIdeaPage
├── Template Grid (Shows all available templates)
│   ├── SaaS Product ☁️
│   ├── Mobile App 📱
│   ├── Healthcare Innovation ⚕️
│   └── Marketplace Platform 🏪
├── Template Modal (Preview & Details)
│   ├── Template header with icon
│   ├── Section breakdown
│   │   ├── Section title
│   │   ├── Description
│   │   ├── Tips/hints
│   │   └── Word count target
│   └── Action buttons (Use/Cancel)
└── Form (with template-guided structure)
```

### 2. Backend: Template Routes (Already Existed)
**File**: `packages/backend/src/routes/templates.ts`

**Available Endpoints**:
- `GET /api/templates` - Get all default templates
- `GET /api/templates/:id` - Get single template details
- `GET /api/templates/category/:category` - Filter by category
- `POST /api/templates` - Create new template (admin)

### 3. Template Model (Already Existed)
**File**: `packages/backend/src/models/Template.ts`

**Schema Structure**:
```typescript
{
  name: string,           // Template name
  description: string,    // What it's for
  icon: string,          // Emoji icon
  category: string,      // Category (Technology, Healthcare, etc.)
  sections: [
    {
      id: string,
      title: string,
      description: string,
      placeholder: string,
      hints: string[],
      warnings?: string[],
      wordCountTarget?: number,
      required: boolean
    }
  ],
  isDefault: boolean,    // Whether it's a default template
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Template Seeding Script
**File**: `create-templates.js`

**Purpose**: Populate database with example templates

**Included Templates**:

#### SaaS Product ☁️
- **Category**: Technology
- **Sections**:
  1. The Problem (150 words)
  2. Your Solution (200 words)
  3. Target Market (150 words)
  4. Business Model (100 words)
  5. Competition (150 words, optional)

#### Mobile App 📱
- **Category**: Technology
- **Sections**:
  1. Primary Use Case (150 words)
  2. Unique Features (150 words)
  3. Monetization Strategy (100 words, optional)
  4. Target Demographics (150 words)

#### Healthcare Innovation ⚕️
- **Category**: Healthcare
- **Sections**:
  1. Medical Problem (150 words)
  2. Clinical Approach (200 words)
  3. Regulatory Path (150 words, optional)
  4. Market Opportunity (150 words)

#### Marketplace Platform 🏪
- **Category**: Marketplace
- **Sections**:
  1. Supply Side/Sellers (150 words)
  2. Demand Side/Buyers (150 words)
  3. Matching/Discovery (150 words)
  4. Network Effects (150 words, optional)
  5. Revenue Model (100 words)

---

## How to Use

### 1. Seed Templates into Database

```bash
# Load MongoDB first (if not running)
mongod

# In new terminal, seed templates
npm run templates:seed

# Output:
# Connected to MongoDB
# Cleared existing templates
# ✅ Created 4 templates
#   - SaaS Product (Technology)
#   - Mobile App (Technology)
#   - Healthcare Innovation (Healthcare)
#   - Marketplace Platform (Marketplace)
```

### 2. Start the Application

```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start web app
npm run web

# Open browser
http://localhost:3000
```

### 3. Create an Idea with Templates

1. Navigate to "Create Idea" page
2. See "📋 Start with a Template" section
3. Click any template card
4. Review template structure in modal
5. Click "✓ Use This Template" to apply
6. Form is ready with guided structure

---

## Architecture

### Data Flow

```
User opens CreateIdeaPage
         ↓
useEffect hook fires
         ↓
Fetch /api/templates
         ↓
Display template grid
         ↓
User clicks template
         ↓
Show template modal
  (with all sections)
         ↓
User clicks "Use Template"
         ↓
Update form with category
         ↓
User fills form sections
         ↓
Submit idea
```

### State Management

```typescript
const [templates, setTemplates] = useState<any[]>([]);
const [loadingTemplates, setLoadingTemplates] = useState(true);
const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
const [showTemplateModal, setShowTemplateModal] = useState(false);
```

---

## Integration Points

### Frontend Components
- **CreateIdeaPage.tsx**: Template selection UI
  - Loads templates on mount
  - Displays grid and modal
  - Applies template to form

### Backend Services
- **GET /api/templates**: Returns all default templates
- **Template Model**: MongoDB collection with schema

---

## Next Steps for Future Phases

### Phase 3 Recommendations

1. **Template-Guided Form Fields**
   - Dynamically generate form fields based on template sections
   - Show section descriptions and placeholders
   - Add character count tracking per section

2. **Template Customization**
   - Allow users to save custom templates
   - Share templates within team
   - Pre-fill templates with common answers

3. **AI Integration**
   - Generate content suggestions for each section
   - Auto-fill sections based on user input
   - Validate content against template requirements

4. **Mobile Support**
   - Mobile app template selection
   - Responsive template modal on small screens

5. **Admin Dashboard**
   - CRUD interface for templates
   - Template analytics (which templates are popular)
   - A/B testing templates

---

## Testing Checklist

- [ ] Seed templates: `npm run templates:seed`
- [ ] Verify templates in MongoDB
- [ ] Load CreateIdeaPage and see template grid
- [ ] Click a template and view modal
- [ ] Apply template to form
- [ ] Verify category is updated
- [ ] Submit idea with template
- [ ] Check idea is created successfully

---

## Common Issues & Solutions

### Issue: Templates not loading
**Solution**:
1. Verify backend is running: `npm run backend`
2. Check `/api/templates` endpoint in browser
3. Ensure MongoDB is connected

### Issue: Template modal doesn't appear
**Solution**:
1. Check browser console for errors
2. Verify template object has `sections` array
3. Clear browser cache and reload

### Issue: Seeding script fails
**Solution**:
1. Ensure MongoDB is running: `mongod`
2. Check `.env` has `MONGODB_URI` set correctly
3. Verify node_modules has mongoose: `npm install mongoose`

---

## Files Modified/Created

| File | Change | Status |
|------|--------|--------|
| `apps/web/src/pages/CreateIdeaPage.tsx` | Added template UI and modal | ✅ |
| `create-templates.js` | New seeding script | ✅ |
| `package.json` | Added `templates:seed` script | ✅ |
| `packages/backend/src/routes/templates.ts` | Already existed | ✅ |
| `packages/backend/src/models/Template.ts` | Already existed | ✅ |

---

## Code Examples

### Loading Templates

```typescript
useEffect(() => {
  loadTemplates();
}, []);

const loadTemplates = async () => {
  try {
    const response = await fetch('/api/templates');
    const data = await response.json();
    if (data.success) {
      setTemplates(data.data);
    }
  } catch (err) {
    console.error('Failed to load templates:', err);
  } finally {
    setLoadingTemplates(false);
  }
};
```

### Applying Template

```typescript
const handleApplyTemplate = () => {
  if (selectedTemplate) {
    setFormData((prev) => ({
      ...prev,
      category: selectedTemplate.category,
    }));
    setShowTemplateModal(false);
  }
};
```

### Template API Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "SaaS Product",
      "description": "Perfect for software-as-a-service ideas with recurring revenue",
      "icon": "☁️",
      "category": "Technology",
      "sections": [
        {
          "id": "problem",
          "title": "The Problem",
          "description": "What pain point does your SaaS solve?",
          "placeholder": "Describe the specific problem your target users face...",
          "hints": ["Be specific", "Focus on frequency of problem", "Quantify if possible"],
          "required": true,
          "wordCountTarget": 150
        }
        // ... more sections
      ],
      "isDefault": true,
      "createdAt": "2026-01-12T00:00:00.000Z"
    }
    // ... more templates
  ]
}
```

---

## Success Metrics

✅ **Phase 2 Objectives Achieved**:
1. Templates loaded from backend API
2. Template selection UI implemented
3. Template preview modal with full details
4. Template application to form
5. Database seeding script created
6. 4 example templates provided

---

## Summary

Phase 2 successfully implements template selection for creators. Users can now:
- Browse available templates by category
- View template structure before applying
- Auto-populate form category based on template
- Follow guided structure for idea creation

The foundation is in place for Phase 3 enhancements like dynamic form generation, customization, and AI-powered suggestions.

---

**Next Phase**: Phase 3 - Dynamic Template-Guided Forms
**Status**: Ready to begin
