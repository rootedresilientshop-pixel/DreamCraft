---
version: 2.0
last_updated: 2026-01-12
project: VentureLab
phase: 2 - Templates Implementation
---

# Project Intent: VentureLab

## Core Vision
**VentureLab is an idea-to-MVP marketplace ecosystem that connects entrepreneurs with skilled collaborators, enabling rapid idea validation and team formation.**

The platform transforms the way ideas become reality by:
- Creators publish ideas with AI-powered validation and scoring
- Collaborators find opportunities that match their skills and interests
- Teams form around validated ideas and build MVPs together
- Smart matching based on skills, categories, and collaborative fit

## Key Goals
1. **Rapid Idea Validation**: Creators get instant AI feedback on idea viability before investing time
2. **Frictionless Collaboration**: Match creators with perfect collaborators for their specific role needs
3. **MVP-First Approach**: Guide teams from idea to functional MVP quickly
4. **Network Effects**: Build a self-sustaining marketplace where more creators attract more collaborators

## Technology Stack
- **Frontend**: React 18 + Vite (Web), React Native + Expo (Mobile)
- **Backend**: Express.js + TypeScript, running on Node.js
- **Database**: MongoDB 7.0 with Mongoose ODM
- **Real-time**: Socket.io for notifications and messaging
- **Authentication**: JWT tokens with bcryptjs hashing
- **Payments**: Stripe integration
- **AI**: OpenAI API for idea validation, scoring, and suggestions

## Architecture: Monorepo with Separate Apps
```
VentureLab/
├── apps/web          # React web application (port 3000)
├── apps/mobile       # React Native mobile app (Expo)
└── packages/backend  # Express API server (port 3002)
```

**Why this architecture?**
- Shared backend for both web and mobile clients
- Independent deployments (Vercel for web, EAS for mobile, Render for backend)
- Code reuse potential for shared utilities and types
- Clear separation of concerns

## Core Business Model
- **Free tier**: Create ideas, browse collaborators, messaging
- **Premium tier**: Advanced analytics, priority matching, NDA generation
- **Revenue**: Subscription fees + potential take-rate on successful collaborations

## Non-Negotiable Constraints
1. **Authentication is security-critical**: JWT must be validated on every request, tokens expire after 7 days
2. **Real-time messaging required**: Socket.io connections for instant notifications and collaboration
3. **Cross-platform support**: Both web and mobile must have feature parity
4. **Scalability from day 1**: Design for 10k+ concurrent users with Socket.io Redis adapter
5. **Data persistence**: All user data must be reliably persisted in MongoDB
6. **API response consistency**: All endpoints return `{ success: boolean, data?, error? }` format
