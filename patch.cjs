const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/const \[showPreviewModal.*?closePreviewModal = \(\) => \{\n\s+setShowPreviewModal\(false\);\n\s+\};/s, `
  const handlePreviewPdf = async (content: string) => {
    setIsPreviewLoading(true);
    try {
      const response = await fetch('/api/compile-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex: content, mainTex: mainTexContent })
      });
      
      if (!response.ok) {
        throw new Error('Failed to compile PDF');
      }
      
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error compiling PDF:", error);
      alert("Đã xảy ra lỗi khi biên dịch PDF. Hãy chắc chắn rằng pdflatex đã được cài đặt và nội dung LaTeX hợp lệ.");
    } finally {
      setIsPreviewLoading(false);
    }
  };
`);

content = content.replace(/openPreviewModal/g, "handlePreviewPdf");

content = content.replace(/\{\/\* Preview Modal \*\/}.*?<\/div>\s*<\/div>\s*\)}/s, "");

content = content.replace(/\{\/\* Settings Modal \*\/\}.*?<\/div>\s*<\/div>\s*\)}/s, `
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <Settings className="w-5 h-5" /> Cài đặt hệ thống
            </h2>
            <div className="space-y-6 overflow-y-auto flex-1 pr-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Nhập API Key của bạn..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Key này sẽ được lưu tạm thời trên trình duyệt của bạn và gửi kèm trong các yêu cầu đến server để sử dụng thay cho Key mặc định của hệ thống.
                </p>
              </div>
              
              <div className="flex flex-col flex-1 min-h-[300px]">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Tùy chỉnh mẫu main.tex
                </label>
                <textarea
                  value={mainTexContent}
                  onChange={(e) => setMainTexContent(e.target.value)}
                  spellCheck={false}
                  className="flex-1 p-4 w-full h-full font-mono text-sm border border-slate-300 rounded-lg bg-slate-50 text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Nhập nội dung template LaTeX (main.tex)..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}`);

fs.writeFileSync('src/App.tsx', content);
