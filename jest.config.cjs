// ecom2/jest.config.js

module.exports = {
  // Use jsdom to simulate a browser environment in Node.js
  testEnvironment: "jsdom",

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources
  moduleNameMapper: {
    // Handle CSS imports (and other style files) by mocking them
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle module path aliases
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // A map from regular expressions to paths to transformers. ts-jest will process .ts and .tsx files.
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Tell ts-jest to use the tsconfig.json in your app directory
        // This file contains the all-important "jsx": "react-jsx" setting
        tsconfig: "tsconfig.app.json",
      },
    ],
  },

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
};
