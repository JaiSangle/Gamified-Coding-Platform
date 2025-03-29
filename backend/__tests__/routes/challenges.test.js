const request = require('supertest');
const app = require('../../server');
const Challenge = require('../../models/Challenge');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('Challenges API', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    // Generate auth token
    authToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create test challenges
    await Challenge.create([
      {
        title: 'Test Challenge 1',
        description: 'Test Description 1',
        difficulty: 'easy',
        language: 'javascript',
        testCases: [
          { input: 5, expectedOutput: 10 }
        ]
      },
      {
        title: 'Test Challenge 2',
        description: 'Test Description 2',
        difficulty: 'medium',
        language: 'javascript',
        testCases: [
          { input: 10, expectedOutput: 20 }
        ]
      }
    ]);
  });

  describe('GET /api/challenges', () => {
    it('should return all challenges', async () => {
      const response = await request(app)
        .get('/api/challenges')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should filter challenges by difficulty', async () => {
      const response = await request(app)
        .get('/api/challenges?difficulty=easy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].difficulty).toBe('easy');
    });

    it('should filter challenges by language', async () => {
      const response = await request(app)
        .get('/api/challenges?language=javascript')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data.every(c => c.language === 'javascript')).toBe(true);
    });

    it('should return 401 for unauthorized requests', async () => {
      const response = await request(app)
        .get('/api/challenges');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/challenges/:challengeId/submit', () => {
    let challengeId;

    beforeEach(async () => {
      const challenge = await Challenge.findOne({ title: 'Test Challenge 1' });
      challengeId = challenge._id;
    });

    it('should evaluate code submission successfully', async () => {
      const response = await request(app)
        .post(`/api/challenges/${challengeId}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'function solution(n) { return n * 2; }'
        });

      expect(response.status).toBe(200);
      expect(response.body.evaluation.status).toBe('pass');
      expect(response.body.evaluation.score).toBe(100);
      expect(response.body.progress.pointsEarned).toBeGreaterThan(0);
    });

    it('should handle incorrect code submission', async () => {
      const response = await request(app)
        .post(`/api/challenges/${challengeId}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'function solution(n) { return n; }'
        });

      expect(response.status).toBe(200);
      expect(response.body.evaluation.status).toBe('fail');
      expect(response.body.evaluation.score).toBeLessThan(100);
    });

    it('should handle invalid code submission', async () => {
      const response = await request(app)
        .post(`/api/challenges/${challengeId}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'invalid javascript code'
        });

      expect(response.status).toBe(200);
      expect(response.body.evaluation.status).toBe('fail');
      expect(response.body.evaluation.error).toBeDefined();
    });
  });
}); 