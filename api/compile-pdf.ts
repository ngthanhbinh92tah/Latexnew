import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { latex, mainTex } = req.body;
    if (!latex) return res.status(400).json({ error: "No latex content provided" });

    // Đọc các file phụ trợ đã có sẵn trong repo
    const mainTexContent = mainTex || await fs.readFile(path.join(process.cwd(), 'main.tex'), 'utf8');
    const exTestSty = await fs.readFile(path.join(process.cwd(), 'ex_test.sty'), 'utf8');
    const randomlistSty = await fs.readFile(path.join(process.cwd(), 'randomlist.sty'), 'utf8');
    const randomlistTex = await fs.readFile(path.join(process.cwd(), 'randomlist.tex'), 'utf8');

    // Gửi tất cả file cần thiết tới dịch vụ biên dịch LaTeX online
    const compileResponse = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [
          { main: true, path: 'main.tex', content: mainTexContent },
          { path: 'bt.tex', content: latex },
          { path: 'ex_test.sty', content: exTestSty },
          { path: 'randomlist.sty', content: randomlistSty },
          { path: 'randomlist.tex', content: randomlistTex },
        ],
      }),
    });

    if (!compileResponse.ok) {
      const errorText = await compileResponse.text();
      console.error("LaTeX compile error:", errorText);
      return res.status(500).json({ error: "Lỗi biên dịch LaTeX. Kiểm tra lại nội dung.", detail: errorText });
    }

    const pdfBuffer = Buffer.from(await compileResponse.arrayBuffer());
    const base64Pdf = pdfBuffer.toString('base64');

    res.status(200).json({ url: `data:application/pdf;base64,${base64Pdf}` });
  } catch (error) {
    console.error("Error compiling PDF:", error);
    res.status(500).json({ error: "Internal server error while compiling PDF" });
  }
}
