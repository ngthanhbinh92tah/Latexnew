const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function list() {
  const models = await ai.models.list();
  console.log(models);
}
list().catch(console.error);
