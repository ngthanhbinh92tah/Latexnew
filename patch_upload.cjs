const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="font-medium text-blue-700">{file.name}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-blue-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadFile(fileContent, file.name); }}
                            className="text-xs flex items-center gap-1 bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                            title="Tải xuống file hiện tại (có thể đã được nối thêm câu hỏi)"
                          >
                            <Download className="w-3 h-3" /> Tải xuống
                          </button>
                        </div>
                      </div>`;

content = content.replace(
  "                    {file ? (\n                      <div className=\"flex flex-col items-center\">\n                        <FileText className=\"w-8 h-8 text-blue-500 mb-2\" />\n                        <span className=\"font-medium text-blue-700\">{file.name}</span>\n                        <span className=\"text-xs text-blue-500 mt-1\">\n                          {(file.size / (1024 * 1024)).toFixed(2)} MB\n                        </span>\n                      </div>",
  replacement
);

fs.writeFileSync('src/App.tsx', content);
