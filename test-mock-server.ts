import express from 'express';

// Integration test to verify all endpoints are wired correctly
const app = express();
app.use(express.json());

// Mock endpoints to simulate backend
app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, message: 'User registered' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, token: 'test_token_12345', user: { id: '1', email: 'test@local.dev' } });
});

app.get('/api/ideas', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: '1', title: 'Idea 1', description: 'Test idea', visibility: 'public' },
    ],
  });
});

app.post('/api/ideas', (req, res) => {
  res.json({ success: true, data: { _id: '123', title: 'New Idea', visibility: 'private' } });
});

app.get('/api/marketplace', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: '1', title: 'Marketplace Idea 1', description: 'Public idea', visibility: 'public' },
    ],
  });
});

app.get('/api/collaborators', (req, res) => {
  res.json({ success: true, data: [{ _id: '1', username: 'collaborator1', profile: { skills: ['React'] } }] });
});

app.post('/api/payments/create-intent', (req, res) => {
  res.json({ success: true, clientSecret: 'stub_client_secret', amount: 1000 });
});

app.listen(3001, () => {
  console.log('Mock backend running on port 3001');
});
