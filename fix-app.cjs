const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fix() {
  const content = fs.readFileSync('src/App.tsx', 'utf8');
  
  const prompt = `
I accidentally ran the following sed commands on my React App.tsx file:
sed -i 's/.*) : (.*//g' src/App.tsx
sed -i 's/.*)}.*//g' src/App.tsx

This deleted ANY line containing ") : (" or ")}". As a result, all my ternary operator else branches and JSX closing brackets (like \`)}\`) and inline event handlers (like \`onChange={(e) => setSomething(e.target.value)}\`) were replaced with empty lines!

Please carefully read the following broken App.tsx. The deleted lines are now empty lines. Your job is to reconstruct the missing closing brackets and missing event handlers, and return the FULL FIXED file. Do NOT change anything else, just fill in the blanks. Return only the raw code, with no markdown formatting or backticks.

Here is the broken App.tsx:
${content}
`;

  console.log("Sending to Gemini...");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        temperature: 0,
    }
  });

  const fixed = response.text.replace(/^```tsx?\n/, '').replace(/\n```$/, '');
  fs.writeFileSync('src/App.tsx', fixed);
  console.log("Fixed file saved!");
}

fix().catch(console.error);
