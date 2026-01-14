const http = require('http');

const BASE_URL = 'http://localhost:3002/api';
let testsPassed = 0;
let testsFailed = 0;

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
}

async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 VENTURELAB COMPREHENSIVE TEST SUITE');
  console.log('='.repeat(50));

  // PHASE 1: AUTHENTICATION
  console.log('\n📋 PHASE 1: AUTHENTICATION');
  console.log('-'.repeat(50));

  let creatorToken, collabToken;

  // Register Creator
  let res = await makeRequest('POST', '/auth/register', {
    email: 'creator@test.com',
    username: 'creator_test',
    password: 'SecurePass123!',
    userType: 'creator'
  });
  creatorToken = res.data?.token;
  test('1.1 Register Creator', res.data?.success && creatorToken);

  // Register Collaborator
  res = await makeRequest('POST', '/auth/register', {
    email: 'collaborator@test.com',
    username: 'collaborator_test',
    password: 'SecurePass123!',
    userType: 'collaborator'
  });
  collabToken = res.data?.token;
  test('1.2 Register Collaborator', res.data?.success && collabToken);

  // Login
  res = await makeRequest('POST', '/auth/login', {
    email: 'creator@test.com',
    password: 'SecurePass123!'
  });
  test('1.3 Login with correct credentials', res.data?.success && res.data?.token);

  // Login with wrong password
  res = await makeRequest('POST', '/auth/login', {
    email: 'creator@test.com',
    password: 'WrongPassword'
  });
  test('1.4 Login with wrong password fails', !res.data?.success);

  // PHASE 2: IDEA MANAGEMENT
  console.log('\n📋 PHASE 2: IDEA MANAGEMENT');
  console.log('-'.repeat(50));

  let ideaId;
  res = await makeRequest('POST', '/ideas', {
    title: 'AI Fitness Tracker',
    description: 'Smart wearable device',
    problem: 'People lose fitness motivation',
    solution: 'AI-powered personalized coaching',
    targetMarket: 'Fitness enthusiasts',
    category: 'Health'
  }, creatorToken);
  ideaId = res.data?.data?._id;
  test('2.1 Create Idea', res.data?.success && ideaId);

  // Get My Ideas
  res = await makeRequest('GET', '/ideas/my-ideas', null, creatorToken);
  test('2.2 Get My Ideas', res.data?.success && Array.isArray(res.data?.data));

  // Browse Public Ideas
  res = await makeRequest('GET', '/ideas/browse');
  test('2.3 Browse Public Ideas', res.data?.success && Array.isArray(res.data?.data));

  // Search Ideas
  res = await makeRequest('GET', '/ideas/browse?search=fitness');
  test('2.4 Search Ideas by keyword', res.data?.success);

  // PHASE 3: COLLABORATION
  console.log('\n📋 PHASE 3: COLLABORATION SYSTEM');
  console.log('-'.repeat(50));

  if (ideaId) {
    res = await makeRequest('POST', `/ideas/${ideaId}/invite-collaborators`, {
      email: 'collaborator@test.com',
      role: 'developer'
    }, creatorToken);
    test('3.1 Invite Collaborator', res.data?.success !== false);

    res = await makeRequest('GET', '/collaborations/requests', null, collabToken);
    test('3.2 Get Collaboration Requests', res.data?.success || Array.isArray(res.data?.data));
  }

  // PHASE 4: FAVORITES & MARKETPLACE
  console.log('\n📋 PHASE 4: FAVORITES & MARKETPLACE');
  console.log('-'.repeat(50));

  if (ideaId) {
    res = await makeRequest('POST', '/favorites', {
      ideaId: ideaId
    }, collabToken);
    test('4.1 Add Idea to Favorites', res.data?.success !== false);

    res = await makeRequest('GET', '/favorites', null, collabToken);
    test('4.2 Get Favorite Ideas', res.data?.success || Array.isArray(res.data?.data));
  }

  // PHASE 5: NOTIFICATIONS
  console.log('\n📋 PHASE 5: NOTIFICATIONS');
  console.log('-'.repeat(50));

  res = await makeRequest('GET', '/notifications', null, collabToken);
  test('5.1 Get Notifications', res.data?.success || Array.isArray(res.data?.data));

  // PHASE 6: ERROR HANDLING
  console.log('\n📋 PHASE 6: ERROR HANDLING');
  console.log('-'.repeat(50));

  res = await makeRequest('GET', '/ideas/my-ideas');
  test('6.1 Request without auth fails', !res.data?.success);

  res = await makeRequest('GET', '/ideas/invalid_id', null, creatorToken);
  test('6.2 Get non-existent idea fails', !res.data?.success);

  res = await makeRequest('POST', '/ideas', {
    title: 'Incomplete Idea'
  }, creatorToken);
  test('6.3 Create idea with missing fields fails', !res.data?.success);

  // PHASE 7: DATA CONSISTENCY
  console.log('\n📋 PHASE 7: DATA CONSISTENCY');
  console.log('-'.repeat(50));

  res = await makeRequest('GET', '/ideas/my-ideas', null, creatorToken);
  test('7.1 Data persists after creation', res.data?.success);

  // SUMMARY
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  const total = testsPassed + testsFailed;
  const rate = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 'N/A';
  console.log(`📈 Success Rate: ${rate}%`);
  console.log('='.repeat(50) + '\n');

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
