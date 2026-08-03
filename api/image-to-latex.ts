import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

function getAiClient(req: VercelRequest) {
  const userApiKey = req.headers['x-api-key'] as string;
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing API Key.");
  return new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, ids, isEssay } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    let idsPrompt = "";
    if (ids && Array.isArray(ids) && ids.length > 0) {
      idsPrompt = `\n\nAdditionally, I have a list of IDs. Assign the most appropriate ID to the question, replacing '?' with B/H/V/C based on difficulty.\nIDs available:\n${ids.join('\n')}`;
    }

    const formatExample = isEssay
      ? `\\begin{ex}\n%[ID-Here-If-Available]\nnội dung câu hỏi\n\\loigiai{\nNội dung lời giải chi tiết ở đây\n}\n\\end{ex}`
      : `\\begin{ex}\n%[ID-Here-If-Available]\nnội dung câu hỏi\n\\choice\n{Đáp án A}\n{\\True Đáp án B đúng}\n{Đáp án C}\n{Đáp án D}\n\\loigiai{\nNội dung lời giải chi tiết ở đây\n}\n\\end{ex}`;

    const specificRules = isEssay
      ? `4. This is an essay question. DO NOT include multiple-choice options.`
      : `4. Use \\choice macro with 4 options, add \\True to the correct one.`;

    const prompt = `Convert the math/physics question in this image to LaTeX code, solve it, and provide the solution.
Format EXACTLY like this:
${formatExample}
Rules:
1. Wrap in \\begin{ex} \\end{ex}.
2. The line immediately after \\begin{ex} MUST be a comment line starting with "%" followed by the ID in brackets, with NOTHING else on that line, exactly like: %[ID-Here-If-Available]. Never omit the "%" character. If no ID is available, still write "%[]" as a placeholder.
3. Use $...$ or $$...$$ for math.
${specificRules}
5. Detailed solution inside \\loigiai{ ... }.
6. Use \\dfrac instead of \\frac.
7. Remove "Câu 1:", "Câu 2" prefixes.
8. No "." after A/B/C/D in \\choice.
9. Output only LaTeX code, no markdown fences.${idsPrompt}`;

    const response = await getAiClient(req).models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } }],
      config: { temperature: 0.1 },
    });

    let latex = response.text?.trim() || "";
    latex = latex.replace(/^```latex\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");

    res.status(200).json({ latex });
  } catch (error) {
    console.error("Error converting image to latex:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
