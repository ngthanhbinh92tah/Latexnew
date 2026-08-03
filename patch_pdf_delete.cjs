const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const searchStr = "await fs.writeFile(path.join(workDir, 'bt.tex'), latex, 'utf8');";
const replaceStr = "await fs.writeFile(path.join(workDir, 'bt.tex'), latex, 'utf8');\n      try { await fs.unlink(path.join(workDir, 'main.pdf')); } catch (e) {}";
code = code.replace(searchStr, replaceStr);
fs.writeFileSync('server.ts', code);
