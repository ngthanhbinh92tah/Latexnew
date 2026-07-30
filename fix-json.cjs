const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function fix() {
  const content = fs.readFileSync('src/App.tsx', 'utf8');
  const prompt = `
I accidentally deleted all occurrences of ")}", and ") : (" in my React App.tsx file.
This means many lines that contained these characters were replaced by empty lines.
Please output a JSON array of objects with 'line_number' and 'replacement' to fix the missing brackets in this file. The 'line_number' should be the exact 1-indexed line number of the EMPTY line that needs to be replaced. For example, if line 508 is empty and needs ")}", return {"line_number": 508, "replacement": "              )}"}.
Be careful to check ternary operators too! (e.g. replacing an empty line with ") : (").

Return ONLY valid JSON.
File content with line numbers:
${content.split('\n').map((line, i) => `${i+1}: ${line}`).join('\n')}
`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        temperature: 0,
        responseMimeType: "application/json"
    }
  });
  console.log(response.text);
}
fix().catch(console.error);
