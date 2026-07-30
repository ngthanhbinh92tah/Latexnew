const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/const \[showPreviewModal.*?closePreviewModal.*?};/s, `
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

fs.writeFileSync('src/App.tsx', content);
