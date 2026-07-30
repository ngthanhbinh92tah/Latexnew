const fs = require('fs');
let lines = fs.readFileSync('server.ts', 'utf8').split('\n');

for (let i=0; i<lines.length; i++) {
  if (lines[i].includes("5. Sử dụng \\\\dfrac")) {
    lines[i] = "5. Sử dụng \\\\dfrac thay cho \\\\frac đối với tất cả các phân số.\\n6. XÓA BỎ các từ bắt đầu câu hỏi như \\\"Câu 1:\\\", \\\"Câu 2\\\", v.v. (Ví dụ: \\\"Câu 4\\\" thì bỏ đi).\\n7. KHÔNG ghi dấu \\\".\\\" sau các phương án A, B, C, D ở trong lệnh \\\\choice.";
  }
  if (lines[i].includes("6. Only output the LaTeX code.")) {
    lines[i] = lines[i].replace("6. Only output the LaTeX code.", "8. Only output the LaTeX code.");
  }
}

fs.writeFileSync('server.ts', lines.join('\n'));
