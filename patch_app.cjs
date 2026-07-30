const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const [isFiltering, setIsFiltering] = useState(false);",
  "const [isFiltering, setIsFiltering] = useState(false);\n  const [filterIncludeEssay, setFilterIncludeEssay] = useState(true);\n  const [filterIncludeMultipleChoice, setFilterIncludeMultipleChoice] = useState(true);"
);

content = content.replace(
  "const result = filterQuestionsByIds(filterFilesContent, envs, filterIdList);",
  "const result = filterQuestionsByIds(filterFilesContent, envs, filterIdList, filterIncludeEssay, filterIncludeMultipleChoice);"
);

content = content.replace(
  "                    <span>Hệ thống sẽ lọc câu hỏi theo ID. Có thể chỉ định số lượng cần lấy sau ID (ví dụ: <b>[6D1H1-1] 5</b>). Dùng <b>?</b> hoặc <b>*</b> nếu thiếu dữ kiện (ví dụ: <b>[6D1?1-*] 2</b>).</span>\n                  </p>\n                </div>",
  "                    <span>Hệ thống sẽ lọc câu hỏi theo ID. Có thể chỉ định số lượng cần lấy sau ID (ví dụ: <b>[6D1H1-1] 5</b>). Dùng <b>?</b> hoặc <b>*</b> nếu thiếu dữ kiện (ví dụ: <b>[6D1?1-*] 2</b>).</span>\n                  </p>\n                  <div className=\"flex items-center gap-4 mt-3\">\n                    <label className=\"flex items-center gap-2 cursor-pointer text-sm text-slate-700\">\n                      <input \n                        type=\"checkbox\" \n                        checked={filterIncludeMultipleChoice} \n                        onChange={(e) => setFilterIncludeMultipleChoice(e.target.checked)}\n                        className=\"w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500\"\n                      />\n                      Câu hỏi trắc nghiệm\n                    </label>\n                    <label className=\"flex items-center gap-2 cursor-pointer text-sm text-slate-700\">\n                      <input \n                        type=\"checkbox\" \n                        checked={filterIncludeEssay} \n                        onChange={(e) => setFilterIncludeEssay(e.target.checked)}\n                        className=\"w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500\"\n                      />\n                      Câu hỏi tự luận\n                    </label>\n                  </div>\n                </div>"
);

fs.writeFileSync('src/App.tsx', content);
