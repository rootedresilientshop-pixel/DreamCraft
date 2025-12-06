# Task Tracking — DreamCraft Phase 2 Development

## Current Goal
Implement high-priority Phase 2 features (Create Idea Form, Collaborator Invite, User Profile Editing, Loading States)

## Phase 2: Feature Development - High Priority

### 1. Create Idea Form - Web
- [x] Create `apps/web/src/pages/CreateIdeaPage.tsx`
  - Text inputs: title, description, category
  - Select: visibility (private/public)
  - Submit button that calls api.createIdea()
  - Error handling & success message
  - Redirect to marketplace after creation
- [x] Add route in `apps/web/src/App.tsx`
- [x] Add "New Idea" button in MarketplacePage that links to `/create-idea`
- [x] Styling: match dark theme (consistent with LoginPage, MarketplacePage)

### 2. Create Idea Form - Mobile
- [x] Create `apps/mobile/src/screens/CreateIdeaScreen.tsx`
  - TextInput components for title, description, category
  - Picker for visibility
  - Submit button that calls api.createIdea()
  - Navigation back to Home after creation
- [x] Add route to bottom tab navigator or stack
- [x] Add button on HomeScreen to navigate to create idea
- [x] Styling: match mobile dark theme

### 3. Collaborator Invite UI - Web
- [ ] Add collaborator invite section to MarketplacePage or new page
  - Search box (already have collaborator search endpoint)
  - Display search results as list/cards
  - "Invite" button on each collaborator
  - Call backend endpoint (TBD if exists - may need to create)
- [ ] Error handling for invalid email/user not found

### 4. Collaborator Invite UI - Mobile
- [ ] Similar UI to web on CollaboratorBrowseScreen
  - Display collaborators
  - Add "Invite" button
  - Confirm dialog before inviting

### 5. User Profile Editing - Web
- [ ] Create ProfilePage component (read from /api/collaborators/me)
  - Display user info
  - Add form to edit profile (first/last name, skills, bio)
  - Profile picture placeholder (can add later)
  - Save changes to backend (PUT /api/users/:id - may need to create)

### 6. User Profile Editing - Mobile
- [ ] Update ProfileScreen.tsx with real data (not mock)
  - Fetch from /api/collaborators/me
  - Add edit button
  - Edit form modal with same fields
  - Save changes

### 7. Loading States & Skeletons
- [ ] Add loading spinners during API calls
  - Web: CSS spinner in MarketplacePage while fetching
  - Mobile: ActivityIndicator in screens
- [ ] Add error states with user-friendly messages
- [ ] Add empty states (e.g., "No ideas found")

## Assumptions
- Backend endpoints exist for create idea (✅ confirmed)
- Backend endpoints exist for collaborator search (✅ confirmed)
- User profile GET endpoint exists (✅ confirmed)
- User profile edit endpoint may need to be created (TBD)
- Collaborator invite endpoint needs to be created (TBD)
- No new libraries will be added (use React hooks, React Native APIs)
- Dark theme styling is priority (consistency)

## Implementation Order
1. Start with Create Idea Form - Web (highest priority, unblocks users)
2. Then Create Idea Form - Mobile (same feature, different platform)
3. Then Collaborator Invite (core feature)
4. Then User Profile Editing (account management)
5. Finally Loading States (UX polish)

## Review - Phase 2
✅ **ALL PHASE 2 TASKS COMPLETE** - Dec 5, 2025 23:55 UTC

**Summary of Changes:**
- Created 4 new web pages: CreateIdeaPage, CollaboratorsPage, ProfilePage, MarketplacePage enhancements
- Created 1 new mobile screen: CreateIdeaScreen
- Rewrote ProfileScreen with full API integration and edit mode
- Enhanced CollaboratorBrowseScreen with search and invites
- Added skeleton loaders to all pages (web + mobile)
- Backend: Added POST /collaborators/invite endpoint
- API client: Added getProfile() and inviteCollaborator() methods

**Files Affected (15):**
- apps/web/src/pages/*.tsx (4 new)
- apps/web/src/App.tsx (3 new routes)
- apps/web/src/api.ts (2 new methods)
- apps/mobile/src/screens/*.tsx (3 modified, 1 new)
- apps/mobile/src/App.tsx (1 new route)
- packages/backend/src/routes/collaborators.ts (1 endpoint added)

**Key Achievements:**
- Users can now CREATE ideas (both web + mobile)
- Users can SEARCH and INVITE collaborators (both web + mobile)
- Users can EDIT their profile (both web + mobile)
- All major user actions have loading states + error handling
- Consistent dark theme across all platforms

---

# Phase 3: Advanced Features & Polish

## Current Goal
Implement Phase 3 features: Payment Integration (Stripe), Advanced Idea Valuation, Notifications, and Additional UX Enhancements

## Phase 3: Feature Development - Medium Priority

### 1. Stripe Payment Integration - Web
- [ ] Create `apps/web/src/pages/CheckoutPage.tsx`
  - Display idea details (title, price)
  - Create Stripe card element
  - Submit payment form calling api.createPaymentIntent()
  - Handle success/error states
  - Redirect after successful payment
- [ ] Add route in `apps/web/src/App.tsx`
- [ ] Add "Purchase" button on idea detail page (if available)
- [ ] Styling: match dark theme

### 2. Stripe Payment Integration - Mobile
- [ ] Create `apps/mobile/src/screens/CheckoutScreen.tsx`
  - Similar payment UI using React Native
  - Consider: react-native-stripe-sdk or similar
  - Form validation before payment
  - Loading state during payment processing
  - Success confirmation screen
- [ ] Add navigation route
- [ ] Link from idea detail screen

### 3. Advanced Idea Valuation UI - Web
- [ ] Create `apps/web/src/pages/IdeaDetailPage.tsx` (or enhance MarketplacePage)
  - Display full idea details: title, description, creator, category
  - Show valuation metrics: AI score, market size, growth potential
  - Display idea status (draft, published, in collaboration)
  - Show estimated value in currency
  - "View NDA" button if available
  - "Share Idea" option
- [ ] Add route for individual idea
- [ ] Link from idea cards in marketplace

### 4. Advanced Idea Valuation UI - Mobile
- [ ] Create `apps/mobile/src/screens/IdeaDetailScreen.tsx`
  - Similar to web, optimized for mobile
  - Valuation metrics display
  - Action buttons: Purchase, Share, Collaborate
  - Scrollable layout for long descriptions

### 5. User Notifications System - Web
- [ ] Add notification context/state management
  - Display notification bell icon in header
  - Show notification count badge
  - Fetch notifications from backend (TBD - may need endpoint)
  - Display notifications list with timestamps
  - Mark as read / dismiss
- [ ] Types of notifications:
  - Collaborator invitations received
  - Idea purchase notifications
  - Payment confirmations
  - System notifications

### 6. User Notifications System - Mobile
- [ ] Similar notification UI
  - Notification screen in tab navigator
  - In-app notification badges
  - Dismissible alerts
  - Link from notifications to relevant pages

### 7. UX Polish & Additional Features - Web
- [ ] Add idea detail modal or page (if not already created)
- [ ] Implement "Share Idea" with copy-to-clipboard
- [ ] Add favorites/bookmark feature for ideas
- [ ] Dark mode toggle (if users request)
- [ ] Responsive mobile web layout improvements
- [ ] Add footer with links

### 8. UX Polish & Additional Features - Mobile
- [ ] Add pull-to-refresh on idea lists
- [ ] Add "Favorite" button on idea cards
- [ ] Implement app navigation back button handling
- [ ] Add app version display
- [ ] Implement logout functionality completion

## Assumptions
- Stripe API keys configured in environment
- Backend payment intent endpoint exists (needs verification)
- Backend notification endpoints may need to be created
- Users want payment functionality (not MVP requirement)
- No additional libraries beyond what's available
- Payment processing is optional for MVP (launch without if time constrained)

## Implementation Order (Priority)
1. **HIGH:** Idea Detail Pages (Web + Mobile) - enables users to view idea metrics
2. **HIGH:** Advanced Valuation Display - showcase AI scoring feature
3. **MEDIUM:** Stripe Payment Integration - revenue generation
4. **MEDIUM:** Notifications System - engagement feature
5. **LOW:** UX Polish - final refinements

## Dependencies
- Phase 2 must be complete (✅ is complete)
- Backend may need new endpoints:
  - POST /payments/intent (create payment intent)
  - GET /notifications (fetch user notifications)
  - POST /notifications/:id/read (mark as read)
- Stripe SDK configuration (already in backend, may need frontend)

## Notes
- Payment integration is optional if not critical for launch
- Notifications can be simple initially (polling vs WebSocket)
- Valuation is already calculated by backend (just needs UI)
- Focus on idea details page first (unblocks other features)
- Started Phase 2: Dec 5, 2025 - 23:30 UTC
- Completed Phase 2: Dec 5, 2025 - 23:55 UTC