# DreamCraft

Idea-to-MVP ecosystem platform combining AI documentation, legal protection, and marketplace functionality.

## Project Structure

- **apps/mobile** - React Native/Expo mobile app (iOS/Android primary)
- **apps/web** - React web app (secondary)
- **packages/backend** - Node/Express API server
- **packages/shared** - Shared types and utilities

## Features

### Phase 1 (MVP)
- AI-guided idea documentation wizard
- User authentication (creators & collaborators)
- Database schema for ideas, users, transactions
- Idea valuation engine (AI-powered)
- Basic marketplace listings
- NDA generation system

### Phase 2
- Idea sales & partnership facilitation
- Collaborator subscriptions
- Payment processing (Stripe)
- Commission system

### Phase 3
- Legal document marketplace
- Platform equity stakes
- Advanced analytics

## Tech Stack

- **Mobile**: React Native, Expo, TypeScript
- **Web**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **AI**: OpenAI API
- **Payments**: Stripe
- **Auth**: JWT

## Getting Started

### Install Dependencies

```bash
npm install
npm run install-all
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### Running the Project

**Mobile App:**
```bash
npm run mobile
```

**Web App:**
```bash
npm run web
```

**Backend Server:**
```bash
npm run backend
```

## Business Model

### Revenue Streams

1. **Marketplace Commission** (20-30% on idea sales)
2. **Collaborator Subscriptions** ($19-199/mo)
3. **Creator Premium Tools** ($29-99 one-time)
4. **Legal Document Marketplace** ($49-299)
5. **Platform Equity Stakes** (2-5% on successful projects)
6. **Platform Idea Acquisitions** (Buy and resell ideas)
7. **Featured Listings & Ads** ($49-199/mo)
8. **Data & Insights** (B2B reports)
9. **Enterprise White-Label** ($50K-200K/year)

## Goals

**Month 6**: 1K documented ideas, 500 creators, 100 collaborators, $15K revenue

**Year 1**: 10K ideas, 5K creators, 500 collaborators, 500 transactions, $50K MRR

**Year 2**: 50K ideas, 25K creators, 2K collaborators, $200K MRR
# Deployment trigger
# Deploy trigger v2
# Fix API env var
