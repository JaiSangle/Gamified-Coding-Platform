const { VM } = require('vm2');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Evaluates code submission against test cases in a secure sandbox
 * 
 * @param {Object} params
 * @param {string} params.code - The submitted code to evaluate
 * @param {Array} params.testCases - Array of test cases with input and expected output
 * @param {string} params.language - Programming language of the submission
 * @returns {Promise<Object>} Evaluation results including status and score
 */
async function evaluateCode({ code, testCases, language = 'javascript' }) {
  const results = {
    status: 'fail',
    score: 0,
    totalTests: testCases.length,
    passedTests: 0,
    failedTests: [],
    executionTime: 0,
    error: null
  };

  try {
    // Validate inputs
    if (!code || !testCases || !Array.isArray(testCases)) {
      throw new Error('Invalid input parameters');
    }

    // Create sandboxed VM with restricted access
    const vm = new VM({
      timeout: 5000, // 5 second timeout
      sandbox: {
        console: {
          log: (...args) => logger.info('Code output:', ...args),
          error: (...args) => logger.error('Code error:', ...args)
        }
      },
      eval: false,
      wasm: false,
      fixAsync: true
    });

    // Start timing execution
    const startTime = process.hrtime();

    // Execute each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = await executeTestCase(vm, code, testCase, i + 1);
      
      if (testResult.passed) {
        results.passedTests++;
      } else {
        results.failedTests.push({
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: testResult.output,
          error: testResult.error
        });
      }
    }

    // Calculate execution time
    const [seconds, nanoseconds] = process.hrtime(startTime);
    results.executionTime = seconds + nanoseconds / 1e9;

    // Calculate score (percentage of passed tests)
    results.score = Math.round((results.passedTests / results.totalTests) * 100);
    results.status = results.score === 100 ? 'pass' : 'fail';

    logger.info('Code evaluation completed', {
      status: results.status,
      score: results.score,
      passedTests: results.passedTests,
      totalTests: results.totalTests,
      executionTime: results.executionTime
    });

    return results;

  } catch (error) {
    logger.error('Code evaluation failed:', error);
    results.error = error.message;
    return results;
  }
}

/**
 * Executes a single test case in the sandboxed environment
 * 
 * @param {VM} vm - VM2 instance
 * @param {string} code - The code to execute
 * @param {Object} testCase - Test case with input and expected output
 * @param {number} testNumber - Test case number for logging
 * @returns {Promise<Object>} Test case execution results
 */
async function executeTestCase(vm, code, testCase, testNumber) {
  const result = {
    passed: false,
    output: null,
    error: null
  };

  try {
    // Wrap the code in a function that accepts test input
    const wrappedCode = `
      ${code}
      try {
        const result = solution(${JSON.stringify(testCase.input)});
        console.log('Test ${testNumber} output:', result);
        result;
      } catch (error) {
        console.error('Test ${testNumber} error:', error);
        throw error;
      }
    `;

    // Execute the code in the sandbox
    const output = await vm.run(wrappedCode);

    // Compare output with expected result
    result.output = output;
    result.passed = deepEqual(output, testCase.expectedOutput);

    logger.info(`Test case ${testNumber} ${result.passed ? 'passed' : 'failed'}`, {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: output
    });

  } catch (error) {
    result.error = error.message;
    logger.error(`Test case ${testNumber} execution error:`, error);
  }

  return result;
}

/**
 * Deep equality comparison for test results
 * 
 * @param {*} actual - Actual output
 * @param {*} expected - Expected output
 * @returns {boolean} Whether the values are equal
 */
function deepEqual(actual, expected) {
  if (actual === expected) return true;
  if (actual === null || expected === null || typeof actual !== 'object' || typeof expected !== 'object') {
    return actual === expected;
  }

  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);

  if (actualKeys.length !== expectedKeys.length) return false;

  return actualKeys.every(key => {
    if (!expectedKeys.includes(key)) return false;
    return deepEqual(actual[key], expected[key]);
  });
}

module.exports = {
  evaluateCode
}; 