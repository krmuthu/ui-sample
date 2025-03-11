import StyleDictionary from 'style-dictionary';
import { transformTokens } from 'token-transformer';

// Custom format for Tailwind config
StyleDictionary.registerFormat({
  name: 'tailwind/theme',
  formatter: function({ dictionary }) {
    const transformedTokens = {};

    dictionary.allTokens.forEach(token => {
      const path = token.path;
      let current = transformedTokens;

      // Create nested structure
      path.forEach((part, index) => {
        if (index === path.length - 1) {
          // Transform the token value using token-transformer
          const transformedValue = transformTokens(token.value, {
            preserveRawValue: true,
            expandTypography: true,
            expandShadow: true,
            expandComposition: true,
            expandBorder: true
          });
          current[part] = transformedValue;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });

    return `export default ${JSON.stringify(transformedTokens, null, 2)}`;
  }
});

// Custom transform for color values
StyleDictionary.registerTransform({
  name: 'color/hex',
  type: 'value',
  matcher: token => token.type === 'color',
  transformer: token => token.value
});

// Create Style Dictionary config
const StyleDictionaryConfig = {
  source: ['src/styles/design-tokens.json'],
  platforms: {
    tailwind: {
      transforms: ['color/hex'],
      buildPath: 'src/styles/',
      files: [{
        destination: 'tailwind-tokens.js',
        format: 'tailwind/theme'
      }]
    }
  }
};

// Run Style Dictionary build
StyleDictionary.extend(StyleDictionaryConfig).buildAllPlatforms(); 