/**
 * Style Dictionary config
 * This transforms our design tokens from the token-transformer output
 * to formats we can use in our codebase (Tailwind config).
 */

// Create the configuration object
const styleDictionaryConfig = {
  source: ['src/styles/transformed-tokens.json'],
  platforms: {
    tailwind: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tailwind-theme.mjs',
          format: 'javascript/es6',
          options: {
            showFileHeader: true,
            outputReferences: false
          }
        }
      ]
    }
  }
};

export default styleDictionaryConfig; 