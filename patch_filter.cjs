const fs = require('fs');
let content = fs.readFileSync('src/utils/latexParser.ts', 'utf8');

content = content.replace(
  "export function filterQuestionsByIds(files: {name: string, content: string}[], environments: string, idsText: string): FilterResult {",
  "export function filterQuestionsByIds(files: {name: string, content: string}[], environments: string, idsText: string, includeEssay: boolean = true, includeMultipleChoice: boolean = true): FilterResult {"
);

content = content.replace(
  "    parsed.chunks.forEach(chunk => {\n      if (chunk.type === 'question') {\n        totalCount++;\n        const firstLineEnd = chunk.content.indexOf('\\n');\n        const firstLine = firstLineEnd !== -1 ? chunk.content.slice(0, firstLineEnd) : chunk.content;",
  "    parsed.chunks.forEach(chunk => {\n      if (chunk.type === 'question') {\n        totalCount++;\n        \n        const isMultipleChoice = /\\\\(choice|motcot|haicot|bacot|boncot|igchoice)\\b/.test(chunk.content);\n        const isEssay = !isMultipleChoice;\n        \n        if (isMultipleChoice && !includeMultipleChoice) return;\n        if (isEssay && !includeEssay) return;\n\n        const firstLineEnd = chunk.content.indexOf('\\n');\n        const firstLine = firstLineEnd !== -1 ? chunk.content.slice(0, firstLineEnd) : chunk.content;"
);

fs.writeFileSync('src/utils/latexParser.ts', content);
