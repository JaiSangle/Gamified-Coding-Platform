const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate a hint for a coding challenge using OpenAI
 * 
 * @param {Object} params - Parameters for generating the hint
 * @param {string} params.challengeDescription - Description of the challenge
 * @param {string} params.userCode - User's current code (optional)
 * @param {string} params.difficulty - Challenge difficulty level
 * @param {string} params.language - Programming language
 * @param {number} params.hintLevel - Progressive hint level (1 for subtle hints, 2 for more explicit, 3 for detailed guidance)
 * @returns {Promise<string>} - A helpful hint for solving the challenge
 */
async function generateHint({ 
  challengeDescription, 
  userCode = '', 
  difficulty = 'medium', 
  language = 'javascript',
  hintLevel = 1
}) {
  try {
    // Validate OpenAI API key
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Construct the prompt based on parameters
    const hintStrength = hintLevel === 1 ? 'subtle' : hintLevel === 2 ? 'clear' : 'detailed';
    
    // Build prompt
    const messages = [
      {
        role: 'system',
        content: `You are a helpful coding instructor that provides ${hintStrength} hints to students. 
                  You should guide learners without giving away complete solutions. 
                  For level ${hintLevel} hints, provide ${hintStrength} guidance appropriate for ${difficulty} difficulty challenges.
                  Your hints should be concise, educational, and promote learning.`
      },
      {
        role: 'user',
        content: `I'm working on this ${language} challenge:
                  "${challengeDescription}"
                  
                  ${userCode ? `Here's my current code:\n\`\`\`${language}\n${userCode}\n\`\`\`\n` : ''}
                  
                  Please provide a ${hintStrength} hint to help me progress without giving away the full solution.`
      }
    ];

    // Make API request to OpenAI
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo', // You can change to other models as needed
        messages,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Extract the hint from the response
    const hint = response.data.choices[0].message.content.trim();
    
    // Log hint generation (but not the hint itself in production)
    console.log(`Hint generated for challenge. Hint level: ${hintLevel}`);
    
    return hint;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // OpenAI API error response
      console.error('OpenAI API error:', error.response.data);
      throw new Error(`AI hint generation failed: ${error.response.data.error?.message || 'Unknown API error'}`);
    } else if (error.request) {
      // Network error
      console.error('Network error when contacting OpenAI API:', error.message);
      throw new Error('Failed to connect to AI service. Please try again later.');
    } else {
      // Other errors
      console.error('Error generating hint:', error.message);
      throw new Error('Failed to generate hint: ' + error.message);
    }
  }
}

/**
 * Simple fallback hint generator when AI service is unavailable
 * 
 * @param {Object} params - Parameters for generating the hint
 * @returns {string} - A generic hint
 */
function getFallbackHint({ difficulty = 'medium', hintLevel = 1 }) {
  const fallbackHints = {
    easy: [
      "Try breaking down the problem into smaller steps.",
      "Review the basic syntax of the language you're using.",
      "Think about the input and output requirements carefully."
    ],
    medium: [
      "Consider the edge cases in your solution.",
      "There might be a more efficient algorithm to solve this.",
      "Think about how to optimize your data structures."
    ],
    hard: [
      "This problem likely requires an advanced algorithm technique.",
      "Consider time and space complexity tradeoffs in your approach.",
      "Break this complex problem into subproblems you can solve individually."
    ]
  };

  // Get appropriate hints for the difficulty level
  const hints = fallbackHints[difficulty] || fallbackHints.medium;
  
  // Return a hint based on the hint level (or a random one if level is out of range)
  return hints[Math.min(hintLevel - 1, hints.length - 1)] || hints[Math.floor(Math.random() * hints.length)];
}

module.exports = {
  generateHint,
  getFallbackHint
}; 