/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',

  maxWorkers: 1,
  maxConcurrency: 1,

  setupFiles: ['dotenv/config'],
};
