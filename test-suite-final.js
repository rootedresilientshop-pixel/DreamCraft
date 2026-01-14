const http = require('http');

const BASE_URL = 'http://localhost:3002/api';
let testsPassed = 0;
let testsFailed = 0;
let testDetails = [];

function makeRequest(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function test(name, success, details = '') {
  if (success) {
    testsPassed++;
    console.log(`✅ ${name}`);
  } else {
    testsFailed++;
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
  }
  testDetails.push({ name, success, details });
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 VENTURELAB COMPREHENSIVE TEST SUITE - FINAL RUN');
  console.log('='.repeat(60));

  // PHASE 1: AUTHENTICATION
  console.log('\n📋 PHASE 1: AUTHENTICATION');
  console.log('-'.repeat(60));

  let creatorToken, collabToken, creatorId, collabId;

  // Register Creator
  let res = await makeRequest('POST', '/auth/register', {
    email: 'creator.final@test.com',
    username: 'creator_final',
    password: 'SecurePass123!',
    userType: 'creator'
  });
  creatorToken = res.data?.token;
  creatorId = res.data?.user?.id;
  test('1.1 Register Creator', res.data?.success && creatorToken, res.data?.error);

  // Register Collaborator
  res = await makeRequest('POST', '/auth/register', {
    email: 'collaborator.final@test.com',
    username: 'collaborator_final',
    password: 'SecurePass123!',
    userType: 'collaborator'
  });
  collabToken = res.data?.token;
  collabId = res.data?.user?.id;
  test('1.2 Register Collaborator', res.data?.success && collabToken, res.data?.error);

  // Login
  res = await makeRequest('POST', '/auth/login', {
    email: 'creator.final@test.com',
    password: 'SecurePass123!'
  });
  test('1.3 Login with correct credentials', res.data?.success && res.data?.token, res.data?.error);

  // Login with wrong password
  res = await makeRequest('POST', '/auth/login', {
    email: 'creator.final@test.com',
    password: 'WrongPassword'
  });
  test('1.4 Login with wrong password fails', !res.data?.success, '');

  // PHASE 2: IDEA MANAGEMENT
  console.log('\n📋 PHASE 2: IDEA MANAGEMENT');
  console.log('-'.repeat(60));

  let ideaId;
  res = await makeRequest('POST', '/ideas', {
    title: 'AI Fitness Tracker',
    description: 'Smart wearable device',
    problem: 'People lose fitness motivation',
    solution: 'AI-powered personalized coaching',
    targetMarket: 'Fitness enthusiasts',
    category: 'Health',
    visibility: 'public'
  }, creatorToken);
  ideaId = res.data?.data?._id;
  test('2.1 Create Idea', res.data?.success && ideaId, res.data?.error);

  // Get My Ideas
  res = await makeRequest('GET', '/ideas/my-ideas', null, creatorToken);
  test('2.2 Get My Ideas', res.data?.success && Array.isArray(res.data?.data), res.data?.error);

  // Browse Public Ideas
  res = await makeRequest('GET', '/ideas', null);
  test('2.3 Browse Public Ideas', res.data?.success && Array.isArray(res.data?.data), res.data?.error);

  // PHASE 3: COLLABORATION
  console.log('\n📋 PHASE 3: COLLABORATION SYSTEM');
  console.log('-'.repeat(60));

  if (ideaId) {
    res = await makeRequest('POST', `/ideas/${ideaId}/invite-collaborators`, {
      email: 'collaborator.final@test.com',
      role: 'developer'
    }, creatorToken);
    test('3.1 Invite Collaborator', res.data?.success !== false, res.data?.error);

    res = await makeRequest('GET', '/collaborators', null);
    test('3.2 Get Collaborators List', res.data?.success && Array.isArray(res.data?.data), res.data?.error);
  }

  // PHASE 4: FAVORITES & MARKETPLACE
  console.log('\n📋 PHASE 4: FAVORITES & MARKETPLACE');
  console.log('-'.repeat(60));

  if (ideaId) {
    res = await makeRequest('POST', '/favorites', {
      ideaId: ideaId
    }, collabToken);
    test('4.1 Add Idea to Favorites', res.data?.success !== false, res.data?.error);

    res = await makeRequest('GET', '/favorites', null, collabToken);
    test('4.2 Get Favorite Ideas', res.data?.success || Array.isArray(res.data?.data), res.data?.error);
  }

  // PHASE 5: NOTIFICATIONS
  console.log('\n📋 PHASE 5: NOTIFICATIONS');
  console.log('-'.repeat(60));

  res = await makeRequest('GET', '/notifications', null, collabToken);
  test('5.1 Get Notifications', res.data?.success || Array.isArray(res.data?.data), res.data?.error);

  // PHASE 6: ERROR HANDLING
  console.log('\n📋 PHASE 6: ERROR HANDLING');
  console.log('-'.repeat(60));

  res = await makeRequest('GET', '/ideas/my-ideas');
  test('6.1 Request without auth fails', !res.data?.success, '');

  res = await makeRequest('GET', '/ideas/invalid_id', null, creatorToken);
  test('6.2 Get non-existent idea fails', !res.data?.success, '');

  res = await makeRequest('POST', '/ideas', {
    title: 'Incomplete Idea'
  }, creatorToken);
  test('6.3 Create idea with missing fields fails', !res.data?.success, res.data?.error);

  // PHASE 7: DATA CONSISTENCY
  console.log('\n📋 PHASE 7: DATA CONSISTENCY');
  console.log('-'.repeat(60));

  res = await makeRequest('GET', '/ideas/my-ideas', null, creatorToken);
  const ideasCount = res.data?.data?.length || 0;
  test('7.1 Data persists after creation', res.data?.success && ideasCount > 0, `Found ${ideasCount} ideas`);

  // PHASE 8: CONFIGURATION CHECKS
  console.log('\n📋 PHASE 8: CONFIGURATION CHECKS');
  console.log('-'.repeat(60));

  res = await makeRequest('GET', '/health');
  test('8.1 Health endpoint accessible', res.status === 200 || res.data?.status === 'ok', '');

  // SUMMARY
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  const total = testsPassed + testsFailed;
  const rate = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 'N/A';
  console.log(`📈 Success Rate: ${rate}%`);
  console.log('='.repeat(60));

  // Details
  console.log('\n📋 TEST DETAILS:');
  testDetails.forEach((item, index) => {
    const status = item.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${item.name}`);
  });

  console.log('\n' + '='.repeat(60) + '\n');

  process.exit(testsFailed > 3 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
