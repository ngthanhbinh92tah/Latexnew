import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient(req: express.Request) {
  const userApiKey = req.headers['x-api-key'] as string;
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing API Key. Please provide one in settings.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post("/api/match-ids", async (req, res) => {
    try {
      const { questions, ids } = req.body;

      if (!questions || !Array.isArray(questions) || !ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "Invalid input" });
      }
      
      if (ids.length === 0) {
        return res.status(400).json({ error: "No IDs provided" });
      }

      if (questions.length === 0) {
        return res.json({ matches: [] });
      }

      const prompt = `You are a math and physics teacher assistant. I have a list of LaTeX questions and a list of IDs (which may include descriptions).
Your task is to assign the most appropriate ID from the list to each question based on its content.
If an ID is already assigned in the question, or strongly implied by its content, match it.

Important Rules:
1. The available IDs may have descriptions next to them (e.g., "[6D1?1-1] Viết một tập hợp cho trước"). Use this description to understand the topic and find the best match for the question.
2. DIFFICULTY LEVEL SUBSTITUTION: Some IDs contain a '?' character (e.g., "[6D1?1-1]"). The '?' represents the difficulty level of the question. You MUST evaluate the question's difficulty and replace the '?' in the ID with ONE of the following letters:
   - 'B' (Nhận biết): Knowledge/Recall. Simple facts, definitions, direct identifications.
   - 'H' (Thông hiểu): Comprehension. Explaining concepts, simple one-step calculations, basic understanding.
   - 'V' (Vận dụng): Application. Applying formulas, solving standard multi-step problems.
   - 'C' (Vận dụng cao): Advanced Application. Complex problem solving, proofs, synthesis, challenging questions.
   For example, if a question matches the topic for "[6D1?1-1]" and is at the "Thông hiểu" level, your matchedId should be "[6D1H1-1]".
3. The 'matchedId' you return MUST ONLY be the final ID part itself, including the brackets if present (e.g., "[6D1H1-1]"). Do NOT include the description or the '?' in the 'matchedId' if you successfully replaced it.

IDs available:
${ids.join("\n")}

Questions:
${questions.map((q: any) => `Question ${q.id}: ${q.content}`).join("\n\n")}

Return a JSON array of matches, where each match has the question 'id' (number) and 'matchedId' (string, just the final substituted ID part).`;

      const response = await getAiClient(req).models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER, description: "The original question ID" },
                matchedId: { type: Type.STRING, description: "The selected ID from the available list" }
              },
              required: ["id", "matchedId"]
            }
          },
          temperature: 0.1
        },
      });

      const jsonStr = response.text?.trim() || "[]";
      const matches = JSON.parse(jsonStr);

      res.json({ matches });
    } catch (error) {
      console.error("Error matching IDs:", error);
      res.status(500).json({ error: "Internal server error matching IDs" });
    }
  });

  app.post("/api/image-to-latex", async (req, res) => {
    try {
      const { imageBase64, ids, isEssay } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

      let idsPrompt = "";
      if (ids && Array.isArray(ids) && ids.length > 0) {
        idsPrompt = `\n\nAdditionally, I have a list of IDs. You MUST assign the most appropriate ID from the list to the question based on its content.
Important Rules for ID matching:
1. The available IDs may have descriptions next to them. Use this description to understand the topic.
2. DIFFICULTY LEVEL SUBSTITUTION: Some IDs contain a '?' character (e.g., "[6D1?1-1]"). You MUST evaluate the question's difficulty and replace the '?' in the ID with ONE of the following letters:
   - 'B' (Nhận biết): Knowledge/Recall. Simple facts, definitions.
   - 'H' (Thông hiểu): Comprehension. Simple one-step calculations, basic understanding.
   - 'V' (Vận dụng): Application. Applying formulas, solving standard multi-step problems.
   - 'C' (Vận dụng cao): Advanced Application. Complex problem solving, proofs, challenging questions.
   For example, if a question matches "[6D1?1-1]" and is at the "Thông hiểu" level, the ID should be "[6D1H1-1]".
3. Output the matched ID as a comment on the line immediately following \\begin{ex} like this: % [6D1H1-1]

IDs available:
${ids.join('\n')}`;
      }

      const formatExample = isEssay 
        ? `\\begin{ex} 
 %[ID-Here-If-Available]
	nội dung câu hỏi
	\\loigiai{
        Nội dung lời giải chi tiết ở đây
    }
\\end{ex}` 
        : `\\begin{ex} 
 %[ID-Here-If-Available]
	nội dung câu hỏi
	\\choice
	{Đáp án A}
	{\\True Đáp án B đúng}
	{Đáp án C}
	{Đáp án D}
	\\loigiai{
        Nội dung lời giải chi tiết ở đây
    }
\\end{ex}`;

      const specificRules = isEssay
        ? `3. This is an essay question. DO NOT include any multiple-choice options (A, B, C, D) and DO NOT use the \\choice macro.`
        : `3. Use the exact \\choice macro with 4 arguments on separate lines for options. Add \\True inside the argument for the correct option as shown above.`;

      const prompt = `Convert the math/physics question in this image to LaTeX code, solve it, and provide the solution. 
Please follow these strict rules to format your LaTeX output EXACTLY like this structure:

${formatExample}

Rules:
1. Wrap the question in \\begin{ex} and \\end{ex} environment.
2. Use inline math $...$ and display math $$...$$ or \\[...\\] as appropriate.
${specificRules}
4. Provide a detailed, step-by-step solution wrapped inside \\loigiai{ ... } placed before \\end{ex}.
5. Sử dụng \\dfrac thay cho \\frac đối với tất cả các phân số.
6. XÓA BỎ các từ bắt đầu câu hỏi như "Câu 1:", "Câu 2", v.v. (Ví dụ: "Câu 4" thì bỏ đi).
7. KHÔNG ghi dấu "." sau các phương án A, B, C, D ở trong lệnh \\choice.
8. Only output the LaTeX code. Do not output any markdown formatting like \`\`\`latex or conversational text.
9. DO NOT generate any extra \\end{ex} or } at the beginning of the response. The response MUST strictly start with \\begin{ex} and end with \\end{ex}.${idsPrompt}`;

      const response = await getAiClient(req).models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          }
        ],
        config: {
          temperature: 0.1
        }
      });

      let latex = response.text?.trim() || "";
      // Strip markdown code blocks if the model still adds them
      latex = latex.replace(/^```latex\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");

      res.json({ latex });
    } catch (error) {
      console.error("Error converting image to latex:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  app.post("/api/doc-to-latex", async (req, res) => {
    try {
      const { fileBase64, mimeType, startPage, endPage, ids, isEssay } = req.body;

      if (!fileBase64) {
        return res.status(400).json({ error: "No file provided" });
      }

      const base64Data = fileBase64.replace(/^data:.*?;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      let finalMimeType = mimeType;
      let finalData = base64Data;
      let textContent = null;

      if (mimeType === 'application/pdf') {
        if (startPage || endPage) {
          const { PDFDocument } = await import('pdf-lib');
          const pdfDoc = await PDFDocument.load(buffer);
          const totalPages = pdfDoc.getPageCount();
          
          const start = startPage ? Math.max(1, parseInt(startPage)) : 1;
          const end = endPage ? Math.min(totalPages, parseInt(endPage)) : totalPages;
          
          if (start <= end) {
            const newPdf = await PDFDocument.create();
            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
            const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
            copiedPages.forEach((page) => newPdf.addPage(page));
            
            const newPdfBytes = await newPdf.save();
            finalData = Buffer.from(newPdfBytes).toString('base64');
          }
        }
      } else if (mimeType.includes('word') || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        textContent = result.value;
      }

      let idsPrompt = "";
      if (ids && Array.isArray(ids) && ids.length > 0) {
        idsPrompt = `\n\nAdditionally, I have a list of IDs. You MUST assign the most appropriate ID from the list to the question based on its content.
Important Rules for ID matching:
1. The available IDs may have descriptions next to them. Use this description to understand the topic.
2. DIFFICULTY LEVEL SUBSTITUTION: Some IDs contain a '?' character (e.g., "[6D1?1-1]"). You MUST evaluate the question's difficulty and replace the '?' in the ID with ONE of the following letters:
   - 'B' (Nhận biết): Knowledge/Recall. Simple facts, definitions.
   - 'H' (Thông hiểu): Comprehension. Simple one-step calculations, basic understanding.
   - 'V' (Vận dụng): Application. Applying formulas, solving standard multi-step problems.
   - 'C' (Vận dụng cao): Advanced Application. Complex problem solving, proofs, challenging questions.
   For example, if a question matches "[6D1?1-1]" and is at the "Thông hiểu" level, the ID should be "[6D1H1-1]".
3. Output the matched ID as a comment on the line immediately following \\begin{ex} like this: % [6D1H1-1]

IDs available:
${ids.join('\n')}`;
      }

      const formatExample = isEssay 
        ? `\\begin{ex} 
 %[ID-Here-If-Available]
	nội dung câu hỏi
	\\loigiai{
        Nội dung lời giải chi tiết ở đây
    }
\\end{ex}` 
        : `\\begin{ex} 
 %[ID-Here-If-Available]
	nội dung câu hỏi
	\\choice
	{Đáp án A}
	{\\True Đáp án B đúng}
	{Đáp án C}
	{Đáp án D}
	\\loigiai{
        Nội dung lời giải chi tiết ở đây
    }
\\end{ex}`;

      const specificRules = isEssay
        ? `3. This is an essay question. DO NOT include any multiple-choice options (A, B, C, D) and DO NOT use the \\choice macro.`
        : `3. Use the exact \\choice macro with 4 arguments on separate lines for options. Add \\True inside the argument for the correct option as shown above.`;

      const prompt = `Extract all math/physics questions from this document, convert them to LaTeX code, solve them, and provide the solution for each. 
Please follow these strict rules to format your LaTeX output EXACTLY like this structure:

${formatExample}

Rules:
1. Wrap each question in \\begin{ex} and \\end{ex} environment.
2. Use inline math $...$ and display math $...$ or \\[...\\] as appropriate.
${specificRules}
4. Provide a detailed, step-by-step solution wrapped inside \\loigiai{ ... } placed before \\end{ex}.
5. Sử dụng \\dfrac thay cho \\frac đối với tất cả các phân số.
6. XÓA BỎ các từ bắt đầu câu hỏi như "Câu 1:", "Câu 2", v.v. (Ví dụ: "Câu 4" thì bỏ đi).
7. KHÔNG ghi dấu "." sau các phương án A, B, C, D ở trong lệnh \\choice.
8. Only output the LaTeX code. Do not output any markdown formatting like \`\`\`latex or conversational text.
9. DO NOT generate any extra \\end{ex} or } at the beginning of the response. The response MUST strictly start with \\begin{ex} and end with \\end{ex}.${idsPrompt}`;

      const parts: any[] = [prompt];
      if (textContent) {
        parts.push({ text: textContent });
      } else {
        parts.push({
          inlineData: {
            data: finalData,
            mimeType: finalMimeType
          }
        });
      }

      const response = await getAiClient(req).models.generateContent({
        model: "gemini-2.5-flash",
        contents: parts,
        config: {
          temperature: 0.1
        }
      });

      let latex = response.text?.trim() || "";
      // Strip markdown code blocks if the model still adds them
      latex = latex.replace(/^\`\`\`latex\n?/, "").replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

      res.json({ latex });
    } catch (error) {
      console.error("Error converting document to latex:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/main-tex", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const content = await fs.readFile(path.join(process.cwd(), 'main.tex'), 'utf8');
      res.json({ content });
    } catch (error) {
      console.error("Error reading main.tex:", error);
      res.status(500).json({ error: "Could not read main.tex" });
    }
  });

  app.post("/api/compile-pdf", async (req, res) => {
    try {
      const { latex, mainTex } = req.body;
      if (!latex) {
        return res.status(400).json({ error: "No latex content provided" });
      }

      const fs = await import('fs/promises');
      const path = await import('path');
      const { exec } = await import('child_process');
      const util = await import('util');
      const execPromise = util.promisify(exec);

      const workDir = path.join(process.cwd(), 'latex_build');
      await fs.mkdir(workDir, { recursive: true });

      if (mainTex) {
        await fs.writeFile(path.join(workDir, 'main.tex'), mainTex, 'utf8');
      } else {
        await fs.copyFile(path.join(process.cwd(), 'main.tex'), path.join(workDir, 'main.tex'));
      }
      
      await fs.copyFile(path.join(process.cwd(), 'ex_test.sty'), path.join(workDir, 'ex_test.sty'));
      await fs.copyFile(path.join(process.cwd(), 'randomlist.sty'), path.join(workDir, 'randomlist.sty'));
      await fs.copyFile(path.join(process.cwd(), 'randomlist.tex'), path.join(workDir, 'randomlist.tex'));
      
      await fs.writeFile(path.join(workDir, 'bt.tex'), latex, 'utf8');
      try { await fs.unlink(path.join(workDir, 'main.pdf')); } catch (e) {}

      try {
        await execPromise('pdflatex -interaction=nonstopmode main.tex', { cwd: workDir, timeout: 20000 });
      } catch (e: any) {
        console.warn("pdflatex warning/error on first run:", e.message);
      }
      try {
        await execPromise('pdflatex -interaction=nonstopmode main.tex', { cwd: workDir, timeout: 20000 });
      } catch (e: any) {
        console.warn("pdflatex warning/error on second run:", e.message);
      }

      const pdfPath = path.join(workDir, 'main.pdf');
      const pdfId = `pdf_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      const outPdfPath = path.join(workDir, `${pdfId}.pdf`);
      await fs.copyFile(pdfPath, outPdfPath);
      
      res.json({ url: `/api/pdf/${pdfId}.pdf` });
    } catch (error) {
      console.error("Error compiling PDF:", error);
      res.status(500).json({ error: "Internal server error. Make sure pdflatex is installed." });
    }
  });

  app.get("/api/pdf/:filename", async (req, res) => {
    try {
      const path = await import('path');
      const fs = await import('fs/promises');
      const { filename } = req.params;
      const pdfPath = path.join(process.cwd(), 'latex_build', filename);
      
      try {
        await fs.access(pdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
        res.sendFile(pdfPath);
      } catch (e) {
        res.status(404).send("PDF not found");
      }
    } catch (error) {
      res.status(500).send("Error serving PDF");
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
