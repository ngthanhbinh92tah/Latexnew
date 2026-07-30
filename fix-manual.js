const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Replace empty lines that we know need event handlers or closing brackets
// I will output lines around the errors first
