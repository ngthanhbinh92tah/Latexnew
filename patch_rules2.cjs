const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/5\. Sử dụng \\\\dfrac thay cho \\\\frac đối với tất cả các phân số\.\\n6\. XÓA BỎ các từ bắt đầu câu hỏi như \\"Câu 1:\\", \\"Câu 2\\", v\.v\. \(Ví dụ: \\"Câu 4\\" thì bỏ đi\)\.\\n7\. KHÔNG ghi dấu \\"\.\\" sau các phương án A, B, C, D ở trong lệnh \\\\choice\./g, 
"5. Sử dụng \\\\dfrac thay cho \\\\frac đối với tất cả các phân số.\n6. XÓA BỎ các từ bắt đầu câu hỏi như \"Câu 1:\", \"Câu 2\", v.v. (Ví dụ: \"Câu 4\" thì bỏ đi).\n7. KHÔNG ghi dấu \".\" sau các phương án A, B, C, D ở trong lệnh \\choice.");

fs.writeFileSync('server.ts', content);
