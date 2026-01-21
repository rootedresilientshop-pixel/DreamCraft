# Architectural Decisions - VentureLab

**Last Updated**: 2026-01-21 | **Phase**: 3 - Closed Beta + Real-time | **Completion**: 100%

---

## Decision: Closed Beta Access Control via Invite Codes

- **Chosen**: Invite code system with manual code generation and usage tracking
- **Rejected**:
  - Email whitelist (less flexible, harder to revoke access)
  - Open registration with beta flag (no access control)
  - Referral codes (requires existing users)
- **Rationale**:
  - Admin creates codes with configurable uses and expiration
  - Easy to share specific codes with specific testers
  - Can revoke or deactivate codes without affecting registered users
  - Tracks who used which code for analytics
  - Supports both single-use codes (default) and shared codes
- **Date**: 2026-01-21
- **Status**: Final & Implemented
- **Files**:
  - `packages/backend/src/models/InviteCode.ts` (new model)
  - `packages/backend/src/routes/admin.ts` (management endpoints)
  - `packages/backend/src/routes/auth.ts` (validation on registration)
  - `apps/web/src/pages/LoginPage.tsx` (invite code input)
  - `apps/web/src/pages/AdminDashboard.tsx` (creation UI)

---

## Decision: Feedback System with Public Board

- **Chosen**: Centralized public feedback board with categorization, upvoting, and admin management
- **Rejected**:
  - Email-based feedback (doesn't prevent duplicates)
  - Private feedback to admin only (duplicates go unreported)
  - Separate feedback per idea (scattered, doesn't show patterns)
- **Rationale**:
  - Public board prevents duplicate submissions
  - Testers see others' feedback and can upvote
  - Admin can prioritize by community votes
  - Categorization helps organize feedback by type/area
  - Admin notes are private (not visible to users)
- **Date**: 2026-01-21
- **Status**: Final & Implemented
- **Files**:
  - `packages/backend/src/models/Feedback.ts` (new model)
  - `packages/backend/src/routes/feedback.ts` (CRUD endpoints)
  - `apps/web/src/pages/FeedbackBoardPage.tsx` (public listing)
  - `apps/web/src/pages/FeedbackDetailPage.tsx` (detail + admin controls)
  - `apps/web/src/components/FeedbackButton.tsx` (floating button)

---

## Decision: Real-time Updates via Socket.io

- **Chosen**: Socket.io for real-time events (feedback updates, upvotes, notifications)
- **Rejected**:
  - Polling (high latency, wasted requests)
  - Server-Sent Events (doesn't support bidirectional)
  - WebRTC (overkill for notifications)
- **Rationale**:
  - Immediate feedback status updates
  - Real-time upvote count increments
  - Admin notifications when feedback submitted
  - Fallback to HTTP if WebSocket unavailable
  - Existing Socket.io setup can be extended
- **Date**: 2026-01-21
- **Status**: Implemented in Phase 6
- **Files**:
  - `packages/backend/src/services/socketService.ts` (extended)
  - `apps/web/src/services/socketService.ts` (client events)

---

## Decision: Template Selection UI for Idea Creation

- **Chosen**: Client-side template loading with modal preview, category auto-population
- **Rejected**:
  - Server-side template rendering (would require page reload)
  - Multi-step form without templates (less guided for new creators)
  - Template-specific form generation (too complex for Phase 2)
- **Rationale**:
  - Templates provide guidance without being prescriptive
  - Client-side loading reduces server load
  - Modal preview gives users clear understanding before applying
  - Category auto-population simplifies form completion
  - Foundation for Phase 3 dynamic form generation
- **Date**: 2026-01-12
- **Status**: Final
- **Files**:
  - `apps/web/src/pages/CreateIdeaPage.tsx` (UI + template loading)
  - `packages/backend/src/models/Template.ts` (schema)
  - `packages/backend/src/routes/templates.ts` (API endpoints)

---

## Decision: Monorepo Architecture with Shared Backend

- **Chosen**: Single Express backend serving both web and mobile clients
- **Rejected**:
  - Separate backends for web and mobile (maintenance overhead)
  - BFF (Backend for Frontend) pattern (added complexity)
  - API gateway pattern (overkill for current scale)
- **Rationale**:
  - Single source of truth for business logic
  - Easier authentication and session management
  - Simpler deployment pipeline
  - Can add BFF layer later if needed
- **Date**: Earlier phase (still valid)
- **Status**: Final
- **Implications**: Must maintain API compatibility across platforms

---

## Decision: JWT Authentication with localStorage (Web) + SecureStore (Mobile)

- **Chosen**: JWT tokens with platform-specific secure storage
- **Rejected**:
  - httpOnly cookies (can't access from mobile)
  - Session-based auth (requires sticky sessions)
  - OAuth/OIDC (overkill for MVP)
- **Rationale**:
  - Works across web and mobile
  - Token validation on every request
  - 7-day expiration for security
  - Auto-logout on 401 responses
- **Date**: Earlier phase
- **Status**: Final but Revisitable
- **Security Note**: Plan to migrate to httpOnly cookies + refresh tokens for production
- **Related Issue**: localStorage vulnerable to XSS; noted for future hardening

---

## Decision: MongoDB with Mongoose ODM

- **Chosen**: MongoDB with Mongoose schema validation
- **Rejected**:
  - PostgreSQL (SQL not needed for collaboration data)
  - Firebase (lack of control over data)
  - DynamoDB (higher cost)
- **Rationale**:
  - Flexible schema for evolving collaboration models
  - Great ecosystem with Mongoose validation
  - Built-in composite indexing for performance
  - Easy horizontal scaling
- **Date**: Earlier phase
- **Status**: Final
- **Collections**: Users, Ideas, Collaborations, Messages, Notifications, Favorites, Transactions

---

## Decision: Socket.io for Real-time Communication

- **Chosen**: Socket.io for notifications and messaging
- **Rejected**:
  - Polling (battery drain on mobile)
  - Server-Sent Events (no bidirectional messaging)
  - WebRTC (P2P only, need server relay)
- **Rationale**:
  - Bidirectional communication
  - Fallbacks for older browsers
  - Room-based targeting for scalability
  - Mobile support with Expo
- **Date**: Earlier phase
- **Status**: Final
- **Scaling Note**: Will need Redis adapter for horizontal scaling

---

## Decision: API Response Format Standardization

- **Chosen**: All endpoints return `{ success: true/false, data?, error? }`
- **Rejected**:
  - HTTP status codes alone (less clear for clients)
  - HAL/JSON:API standards (too verbose)
  - Mixed formats (current state pre-fix)
- **Rationale**:
  - Clear success/failure in response body
  - Consistent error handling across all endpoints
  - Easier client-side parsing
  - Works well for both web and mobile
- **Date**: Earlier phase
- **Status**: Final (16 endpoints standardized as of Jan 12)
- **Applied To**: Auth, Ideas, Collaborators, Marketplace, Payments, Messages, Notifications

---

## Decision: Port Configuration (3000 web, 3002 backend)

- **Chosen**: Web on 3000, Backend on 3002 (avoid default 3001)
- **Rejected**:
  - All on 3001 (unclear which service is running)
  - Dynamic port selection (harder to debug)
  - Standard HTTP ports (requires sudo)
- **Rationale**:
  - Clear separation for debugging
  - Development conventions (3000 = frontend)
  - CORS configured for both web/mobile to 3002
  - Easy to remember
- **Date**: Earlier phase
- **Status**: Final
- **Files Modified**:
  - `apps/web/src/api.ts`
  - `apps/mobile/src/environment.ts`
  - `packages/backend/src/server.ts`

---

## Decision: AI Features Using OpenAI

- **Chosen**: OpenAI API for idea validation, scoring, and suggestions
- **Rejected**:
  - In-house ML models (too expensive for MVP)
  - Claude API exclusively (cost constraints)
  - Rule-based scoring (not flexible enough)
- **Rationale**:
  - Fast implementation without training data
  - Proven quality for text analysis
  - Can fallback to simpler scoring if needed
  - Users get immediate feedback on ideas
- **Date**: Earlier phase
- **Status**: Final
- **Endpoints**:
  - `POST /api/ideas/:id/validate` - Full validation with scoring
  - `POST /api/ideas/suggestions` - AI suggestions for improvement
  - `GET /api/ideas/:id/nda` - Auto-generate NDA text

---

## Decision: NDA Generation (Phase 1 - Complete)

- **Chosen**: Template-based NDA generation via OpenAI
- **Implementation**:
  - Endpoint: `GET /api/ideas/:id/nda`
  - Takes creator name and idea title
  - Returns formatted PDF-ready NDA text
- **Status**: Complete and validated
- **Date**: Earlier phase
- **Files**: `packages/backend/src/services/aiService.ts`, `packages/backend/src/routes/ideas.ts:294-305`

---

## Decision: Template Categories and Structure

- **Chosen**: Predefined categories with flexible section-based structure
- **Categories**: Technology, Healthcare, Finance, Education, Marketplace, AI, Other
- **Structure**:
  ```
  Template {
    name, description, icon, category
    sections: [
      { id, title, description, placeholder, hints, wordCountTarget, required }
    ]
  }
  ```
- **Rationale**:
  - Category-based discoverability
  - Sections provide guidance without rigid forms
  - Hints help creators understand what each section should contain
  - Word count targets set expectations
  - Optional sections for flexibility
- **Date**: 2026-01-12
- **Status**: Final for Phase 2, extensible for Phase 3
- **Templates Included**: SaaS Product, Mobile App, Healthcare Innovation, Marketplace Platform

---

## Decision: When to Launch Subscription (Phase 2 Gate)

- **Chosen**: Multi-phase approach - validate before launching payments
- **Phase 1**: NDA implementation ✅ COMPLETE
- **Phase 2**: Templates for guided creation ✅ IN PROGRESS (templates UI, pending phase 3 form generation)
- **Phase 3**: Dynamic template-guided forms (future)
- **Phase 4**: Admin features and analytics (future)
- **Phase 5**: Subscription launch (future)
- **Rationale**:
  - Features must be stable before monetization
  - Templates reduce friction but don't guide form completion yet
  - Need user feedback on templates before Phase 3
  - Avoiding premature monetization
- **Date**: 2026-01-12
- **Status**: Final
- **Next Gate**: Phase 3 completion before Phase 5 subscription launch

---

## Decision: Template Seeding with Default Data

- **Chosen**: Node.js script (`create-templates.js`) to populate MongoDB
- **Rejected**:
  - Manual database entries (not reproducible)
  - Admin UI for template creation (out of scope for MVP)
  - Hardcoded templates (harder to update)
- **Rationale**:
  - Reproducible setup for development
  - Easy to add more templates
  - Script can be run anytime without losing data
  - Foundation for CI/CD integration
- **Date**: 2026-01-12
- **Status**: Final
- **Usage**: `npm run templates:seed`
- **Seeds**: 4 example templates with complete section definitions

---

## Decision: Error Handling in Frontend

- **Chosen**: Inline error messages, no alert() popups
- **Rejected**:
  - Browser alert() (poor UX)
  - Error boundary wrappers only (miss inline validation)
  - Silent failures (confusing for users)
- **Rationale**:
  - Better UX with styled error displays
  - Clear error context near input field
  - Non-disruptive to workflow
  - Works on mobile
- **Date**: Earlier phase
- **Status**: Final
- **Applied To**: All form pages (CreateIdeaPage, LoginPage, etc.)

---

## Decision: Cross-Platform Feature Parity

- **Chosen**: All core features available on both web and mobile
- **Exceptions**:
  - Some UI patterns adapted for mobile (bottom sheets vs modals)
  - Mobile uses native components where possible (Expo)
- **Rationale**:
  - Users expect same features everywhere
  - Single backend API simplifies implementation
  - Reduces maintenance burden
- **Date**: Earlier phase
- **Status**: Final
- **Ongoing**: Must test features on both platforms before release

---

## Decision: Database Indexing Strategy

- **Chosen**: Composite indexes on frequently-queried field combinations
- **Indexes Added**:
  - User: `email`, `username`, `userType`
  - Idea: `creatorId`, `visibility`, `category`
  - Collaboration: `ideaId+status`, `collaboratorId+status`
  - Template: `category`, `isDefault`
- **Rationale**:
  - Mongoose creates indexes automatically at startup
  - Composite indexes for multi-field queries
  - Reduces N+1 query problems
  - Improves response times
- **Date**: Earlier phase
- **Status**: Final
- **Monitoring**: Should profile queries in production for optimization

---

## Current Status Summary

| Phase | Feature | Status | Notes |
|-------|---------|--------|-------|
| 1 | NDA Generation | ✅ Complete | Auto-generates NDA documents |
| 2 | Template Selection | ✅ In Progress | UI done, form generation pending Phase 3 |
| 3 | Dynamic Form Generation | ⏳ Pending | Based on template sections |
| 4 | Admin Dashboard | ⏳ Pending | User management, analytics |
| 5 | Subscription Launch | ⏳ Pending | Payment processing, billing |

---

## Revisitable Decisions

1. **JWT + localStorage**: Should migrate to httpOnly cookies + refresh tokens in production
2. **Socket.io scaling**: Will need Redis adapter when users > 1000 concurrent
3. **Rate limiting**: Currently in-memory; should use Redis for horizontal scaling
4. **Template structure**: May add custom fields, conditions, or branching logic
5. **AI provider**: Can switch providers if cost/quality needs change
