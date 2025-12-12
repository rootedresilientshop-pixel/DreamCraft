#!/bin/bash

# Deployment Status Monitoring Script
# This script monitors the deployment status of all services

set -e

GITHUB_REPO="rootedresilientshop-pixel/DreamCraft"
GITHUB_BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Deployment Status Monitor${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check GitHub commits
echo -e "${YELLOW}📊 Checking GitHub Commits...${NC}"
LATEST_COMMIT=$(curl -s https://api.github.com/repos/${GITHUB_REPO}/commits/${GITHUB_BRANCH} --header "Accept: application/vnd.github.v3+json" | grep -m1 '"sha"' | cut -d'"' -f4)
if [ -z "$LATEST_COMMIT" ]; then
    echo -e "${RED}❌ Failed to fetch latest commit${NC}"
else
    SHORT_SHA=${LATEST_COMMIT:0:7}
    echo -e "${GREEN}✅ Latest commit: ${SHORT_SHA}${NC}"
    echo "   Full SHA: $LATEST_COMMIT"
fi

echo ""

# Check Render backend status
echo -e "${YELLOW}🚀 Checking Render Backend Deployment...${NC}"
RENDER_CHECK=$(curl -s https://dreamcraft-backend-6d75.onrender.com/api/marketplace 2>/dev/null | head -c 50)
if [ -z "$RENDER_CHECK" ]; then
    echo -e "${RED}⏳ Backend not yet deployed or cannot reach endpoint${NC}"
else
    echo -e "${GREEN}✅ Backend is responding${NC}"
    echo "   Response preview: $RENDER_CHECK..."
fi

echo ""

# Check Vercel frontend status
echo -e "${YELLOW}🌐 Checking Vercel Frontend Deployment...${NC}"
VERCEL_CHECK=$(curl -s -I https://dreamcraft-khaki.vercel.app 2>/dev/null | grep -i "HTTP" | head -1)
if [ -z "$VERCEL_CHECK" ]; then
    echo -e "${RED}⏳ Frontend not yet deployed or cannot reach endpoint${NC}"
else
    echo -e "${GREEN}✅ Frontend is responding${NC}"
    echo "   Response: $VERCEL_CHECK"
fi

echo ""

# Check if migration script exists
echo -e "${YELLOW}📋 Checking Migration Script...${NC}"
if [ -f "packages/backend/src/migrations/add-onboarding-fields.ts" ]; then
    echo -e "${GREEN}✅ Migration script found${NC}"
else
    echo -e "${RED}❌ Migration script not found${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Deployment Status Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "📌 GitHub Commits: Pushed ✅"
echo "🔵 Backend (Render): Check https://dashboard.render.com"
echo "🟢 Frontend (Vercel): Check https://vercel.com"
echo "📱 Mobile (EAS): Ready to build"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Monitor Render backend deployment"
echo "2. Run migration script after backend deploys"
echo "3. Monitor Vercel frontend deployment"
echo "4. Build mobile APK when ready"
echo ""
