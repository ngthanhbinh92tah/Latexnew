const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/8\. Only output the LaTeX code\. Do not output any markdown formatting like ```latex or conversational text\.\$\{idsPrompt\}/g,
"8. Only output the LaTeX code. Do not output any markdown formatting like ```latex or conversational text.\n9. DO NOT generate any extra \\\\end{ex} or } at the beginning of the response. The response MUST strictly start with \\\\begin{ex} and end with \\\\end{ex}.${idsPrompt}");
fs.writeFileSync('server.ts', code);
