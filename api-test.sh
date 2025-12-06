#!/bin/bash

# DreamCraft API Functional Testing Script
# This tests all critical API endpoints in production

# Color output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL - Using production Render backend
API_BASE="https://dreamcraft-f8w8.onrender.com/api"

# Test credentials (use existing or create new)
TEST_EMAIL="apitest_$(date +%s)@dreamcraft.test"
TEST_PASSWORD="TestPass123!@#"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}DreamCraft API Functional Testing${NC}"
echo -e "${YELLOW}========================================${NC}"
echo "API Base: $API_BASE"
echo "Test Email: $TEST_EMAIL"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}[TEST 1] Health Check${NC}"
HEALTH=$(curl -s -w "\n%{http_code}" "$API_BASE/../health")
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
BODY=$(echo "$HEALTH" | sed '$d')
echo "Response: $BODY"
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

# Test 2: Register
echo -e "${YELLOW}[TEST 2] Register - Create new account${NC}"
REGISTER=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"username\":\"apitest_user\",\"password\":\"$TEST_PASSWORD\"}")
HTTP_CODE=$(echo "$REGISTER" | tail -n1)
BODY=$(echo "$REGISTER" | sed '$d')
echo "Response: $BODY"
if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
  echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"
else
  echo -e "Status: ${RED}$HTTP_CODE${NC}\n"
fi

# Wait a moment for DB to persist
sleep 1

# Test 3: Login
echo -e "${YELLOW}[TEST 3] Login - Authenticate user${NC}"
LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
HTTP_CODE=$(echo "$LOGIN" | tail -n1)
BODY=$(echo "$LOGIN" | sed '$d')
echo "Response: $BODY"

# Extract token for authenticated requests
TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "Token extracted: ${GREEN}${TOKEN:0:20}...${NC}"
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

# Test 4: List Public Ideas (no auth required)
echo -e "${YELLOW}[TEST 4] GET /ideas - List public ideas${NC}"
IDEAS=$(curl -s -w "\n%{http_code}" "$API_BASE/ideas")
HTTP_CODE=$(echo "$IDEAS" | tail -n1)
BODY=$(echo "$IDEAS" | sed '$d')
echo "Response (first 200 chars): ${BODY:0:200}..."
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

# Test 5: Create Idea (authenticated)
echo -e "${YELLOW}[TEST 5] POST /ideas - Create new idea${NC}"
CREATE_IDEA=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/ideas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Idea from API",
    "description": "This is a test idea created via API",
    "category": "Technology",
    "visibility": "public"
  }')
HTTP_CODE=$(echo "$CREATE_IDEA" | tail -n1)
BODY=$(echo "$CREATE_IDEA" | sed '$d')
echo "Response: $BODY"

# Extract idea ID for further tests
IDEA_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "Idea ID: ${GREEN}${IDEA_ID:0:20}...${NC}"
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

# Test 6: Get Idea by ID
if [ ! -z "$IDEA_ID" ]; then
  echo -e "${YELLOW}[TEST 6] GET /ideas/:id - Retrieve created idea${NC}"
  GET_IDEA=$(curl -s -w "\n%{http_code}" "$API_BASE/ideas/$IDEA_ID")
  HTTP_CODE=$(echo "$GET_IDEA" | tail -n1)
  BODY=$(echo "$GET_IDEA" | sed '$d')
  echo "Response (first 200 chars): ${BODY:0:200}..."
  echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"
else
  echo -e "${RED}[TEST 6] SKIPPED - No idea ID${NC}\n"
fi

# Test 7: Search Collaborators
echo -e "${YELLOW}[TEST 7] GET /collaborators - Search collaborators${NC}"
COLLAB=$(curl -s -w "\n%{http_code}" "$API_BASE/collaborators?q=test")
HTTP_CODE=$(echo "$COLLAB" | tail -n1)
BODY=$(echo "$COLLAB" | sed '$d')
echo "Response (first 200 chars): ${BODY:0:200}..."
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

# Test 8: Get Current User Profile (authenticated)
echo -e "${YELLOW}[TEST 8] GET /collaborators/me - Current user profile${NC}"
ME=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$API_BASE/collaborators/me")
HTTP_CODE=$(echo "$ME" | tail -n1)
BODY=$(echo "$ME" | sed '$d')
echo "Response: $BODY"
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

# Test 9: Error Handling - Bad Login
echo -e "${YELLOW}[TEST 9] Error Handling - Bad credentials${NC}"
BAD_LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@test.com","password":"WrongPassword123"}')
HTTP_CODE=$(echo "$BAD_LOGIN" | tail -n1)
BODY=$(echo "$BAD_LOGIN" | sed '$d')
echo "Response: $BODY"
echo -e "Status: ${YELLOW}$HTTP_CODE${NC} (should be 401)\n"

# Test 10: Error Handling - Missing Fields
echo -e "${YELLOW}[TEST 10] Error Handling - Missing password field${NC}"
MISSING_FIELD=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}')
HTTP_CODE=$(echo "$MISSING_FIELD" | tail -n1)
BODY=$(echo "$MISSING_FIELD" | sed '$d')
echo "Response: $BODY"
echo -e "Status: ${YELLOW}$HTTP_CODE${NC} (should be 400)\n"

# Test 11: Error Handling - Unauthorized (no token)
echo -e "${YELLOW}[TEST 11] Error Handling - Unauthorized access${NC}"
NO_AUTH=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/ideas" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test"}')
HTTP_CODE=$(echo "$NO_AUTH" | tail -n1)
BODY=$(echo "$NO_AUTH" | sed '$d')
echo "Response: $BODY"
echo -e "Status: ${YELLOW}$HTTP_CODE${NC} (should be 401 or 403)\n"

# Test 12: Marketplace List
echo -e "${YELLOW}[TEST 12] GET /marketplace - List marketplace ideas${NC}"
MARKET=$(curl -s -w "\n%{http_code}" "$API_BASE/marketplace")
HTTP_CODE=$(echo "$MARKET" | tail -n1)
BODY=$(echo "$MARKET" | sed '$d')
echo "Response (first 200 chars): ${BODY:0:200}..."
echo -e "Status: ${GREEN}$HTTP_CODE${NC}\n"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Testing Complete${NC}"
echo -e "${YELLOW}========================================${NC}"
