const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/const \[showPreviewModal, setShowPreviewModal\] = useState\(false\);\n\s+const \[pdfPreviewUrl, setPdfPreviewUrl\] = useState<string \| null>\(null\);\n\s+const \[mainTexContent, setMainTexContent\] = useState<string>\(''\);\n\s+const \[currentLatexContent, setCurrentLatexContent\] = useState<string>\(''\);/s, "  const [mainTexContent, setMainTexContent] = useState<string>('');");

content = content.replace(/const handlePreviewPdf = \(content: string\) => \{.*?const handlePreviewPdf = async \(content: string, mainTex: string\) => \{/s, "const handlePreviewPdf = async (content: string, mainTex: string = mainTexContent) => {");

content = content.replace(/const blob = await response\.blob\(\);\n\s+const url = URL\.createObjectURL\(blob\);\n\s+setPdfPreviewUrl\(url\);/s, "const data = await response.json();\n      if (data.url) window.open(data.url, '_blank');");

content = content.replace(/const closePreviewModal.*?};/s, "");

fs.writeFileSync('src/App.tsx', content);
