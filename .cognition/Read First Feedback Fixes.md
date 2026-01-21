# VentureLab User Feedback Fixes - Implementation Plan

## Executive Summary

Based on comprehensive codebase exploration, I've identified root causes for all 7 user-reported issues. This plan addresses critical bugs (percentages, auto-redirects, API mismatches) and adds missing features (collaboration terms, template visibility).

## Issues & Root Causes

### 1. ✅ Valuation Percentages (6500% → 65%)

**Root Cause**: Double multiplication

- Backend returns scores as 0-100 (deterministicEvaluationService.ts:35)
- Frontend multiplies by 100 again (IdeaDetailPage.tsx:331, 349)
- Result: 65 × 100 = 6500%

### 2. ✅ Valuation Visibility (Auto-redirect bug)

**Root Cause**: Race condition in setTimeout

- CreateIdeaPage.tsx:124-133 schedules redirect before state update completes
- Modal shows briefly then immediately redirects to dashboard
- User can't read validation results

### 3. ✅ Suggestions Not Appearing

**Root Cause**: Data format mismatch

- Backend returns: `{ suggestions: [...] }` (ideas.ts:282-285)
- Frontend expects: `{ titleSuggestions, descriptionSuggestions, categorySuggestion }`
- UI renders but shows nothing

### 4. ✅ Templates Missing from Create Idea

**Root Cause**: Wrong API base URL

- CreateIdeaPage.tsx:33 uses `fetch('/api/templates')` (relative path)
- Should use `api.getTemplates()` with proper base URL
- Fetch fails → empty templates → UI doesn't render

### 5. ✅ Collaboration Terms Missing

**Root Cause**: Not implemented

- Only has role + message fields
- No expectations, commitments, time commitment, or compensation

### 6. ✅ Sample Ideas Feature

**Root Cause**: Feature exists, needs removal

- Root package.json has `db:clear-and-samples` script
- Should remove sample generation entirely

### 7. ✅ AI Honesty Labels

**Root Cause**: Missing "Coming Soon" indicators

- AI features present but not labeled as deterministic/placeholder
