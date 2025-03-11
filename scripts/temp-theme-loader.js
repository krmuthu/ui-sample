
    const theme = require('../src/styles/tailwind-theme.js');
    fs.writeFileSync(
      '/Users/muthukumar/Dev/projects/clipper-ui/scripts/theme-data.json',
      JSON.stringify(theme, null, 2),
      'utf8'
    );
    