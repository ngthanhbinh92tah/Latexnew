const fs = require('fs');
let lines = fs.readFileSync('server.ts', 'utf8').split('\n');

for (let i=0; i<lines.length; i++) {
  if (lines[i].includes("Sử dụng \\\\dfrac")) {
    lines[i] = "5. Sử dụng \\\\dfrac thay cho \\\\frac đối với tất cả các phân số.";
  }
}

fs.writeFileSync('server.ts', lines.join('\n'));
