const { generateHint } = require('../../services/hintGenerator');
const Challenge = require('../../models/Challenge');

describe('Hint Generator Service', () => {
  let testChallenge;

  beforeEach(async () => {
    testChallenge = await Challenge.create({
      title: 'Test Challenge',
      description: 'Write a function that doubles a number',
      difficulty: 'easy',
      language: 'javascript',
      testCases: [
        { input: 5, expectedOutput: 10 },
        { input: 0, expectedOutput: 0 }
      ]
    });
  });

  describe('generateHint', () => {
    it('should generate a non-empty hint for valid input', async () => {
      const hint = await generateHint(
        testChallenge._id,
        'function solution(n) { return n; }',
        'javascript'
      );

      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
      expect(hint).toContain('hint');
    });

    it('should generate different hints for different code submissions', async () => {
      const hint1 = await generateHint(
        testChallenge._id,
        'function solution(n) { return n; }',
        'javascript'
      );

      const hint2 = await generateHint(
        testChallenge._id,
        'function solution(n) { return n + 1; }',
        'javascript'
      );

      expect(hint1).not.toBe(hint2);
    });

    it('should handle empty code submission', async () => {
      const hint = await generateHint(
        testChallenge._id,
        '',
        'javascript'
      );

      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
      expect(hint).toContain('start');
    });

    it('should handle invalid challenge ID', async () => {
      await expect(generateHint(
        'invalid_id',
        'function solution(n) { return n; }',
        'javascript'
      )).rejects.toThrow();
    });

    it('should handle different programming languages', async () => {
      const hint = await generateHint(
        testChallenge._id,
        'def solution(n): return n',
        'python'
      );

      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
      expect(hint).toContain('hint');
    });

    it('should generate appropriate hints based on code complexity', async () => {
      const simpleHint = await generateHint(
        testChallenge._id,
        'function solution(n) { return n; }',
        'javascript'
      );

      const complexHint = await generateHint(
        testChallenge._id,
        'function solution(n) { return n * 2 + Math.pow(n, 2); }',
        'javascript'
      );

      expect(simpleHint.length).toBeLessThan(complexHint.length);
    });
  });
}); 