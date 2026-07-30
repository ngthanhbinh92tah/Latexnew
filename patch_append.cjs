const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { Upload, FileText, Download, AlertTriangle, CheckCircle, Search, FileUp, Info, Trash2, ShieldCheck, SlidersHorizontal, Eye, Link, Layers, PlusCircle, Image as ImageIcon, Copy, Filter, Settings, X, Edit3 } from 'lucide-react';",
  "import { Upload, FileText, Download, AlertTriangle, CheckCircle, Search, FileUp, Info, Trash2, ShieldCheck, SlidersHorizontal, Eye, Link, Layers, PlusCircle, Image as ImageIcon, Copy, Filter, Settings, X, Edit3, FilePlus } from 'lucide-react';"
);

const appendButtonImage = `                {file && fileContent && (
                  <button
                    onClick={() => {
                      const newContent = fileContent + '\\n\\n' + generatedLatex;
                      setFileContent(newContent);
                      alert(\`Đã thêm nội dung vào cuối file \${file.name}. Vui lòng quay lại tab khác (hoặc xem lại phần Chọn file) để kiểm tra/tải xuống.\`);
                    }}
                    className="text-sm flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                    title={\`Ghi nối tiếp vào file \${file.name}\`}
                  >
                    <FilePlus className="w-4 h-4" />
                    Thêm vào file đã chọn
                  </button>
                )}
                <button
                  onClick={() => downloadFile(generatedLatex, 'image_converted.tex')}
                  className="text-sm flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >`;

content = content.replace(
  "                <button\n                  onClick={() => downloadFile(generatedLatex, 'image_converted.tex')}\n                  className=\"text-sm flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors\"\n                >",
  appendButtonImage
);

const appendButtonDoc = `                {file && fileContent && (
                  <button
                    onClick={() => {
                      const newContent = fileContent + '\\n\\n' + docGeneratedLatex;
                      setFileContent(newContent);
                      alert(\`Đã thêm nội dung vào cuối file \${file.name}. Vui lòng quay lại tab khác (hoặc xem lại phần Chọn file) để kiểm tra/tải xuống.\`);
                    }}
                    className="text-sm flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                    title={\`Ghi nối tiếp vào file \${file.name}\`}
                  >
                    <FilePlus className="w-4 h-4" />
                    Thêm vào file đã chọn
                  </button>
                )}
                <button
                  onClick={() => downloadFile(docGeneratedLatex, 'doc_converted.tex')}
                  className="text-sm flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                >`;

content = content.replace(
  "                <button\n                  onClick={() => downloadFile(docGeneratedLatex, 'doc_converted.tex')}\n                  className=\"text-sm flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors\"\n                >",
  appendButtonDoc
);

fs.writeFileSync('src/App.tsx', content);
