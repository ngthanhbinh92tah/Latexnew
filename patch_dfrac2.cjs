const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /4\. Provide a detailed, step-by-step solution wrapped inside \\loigiai\{ \.\.\. \} placed before \\end\{ex\}\.\n5\. Only output the LaTeX code\./g,
  "4. Provide a detailed, step-by-step solution wrapped inside \\loigiai{ ... } placed before \\end{ex}.\n5. Use \\dfrac instead of \\frac for all fractions.\n6. Only output the LaTeX code."
);

fs.writeFileSync('server.ts', content);
