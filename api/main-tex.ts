import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: "Method not allowed" });

  try {
    const content = await fs.readFile(path.join(process.cwd(), 'main.tex'), 'utf8');
    res.status(200).json({ content });
  } catch (error) {
    console.error("Error reading main.tex:", error);
    res.status(500).json({ error: "Could not read main.tex" });
  }
}
