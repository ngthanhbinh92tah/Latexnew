const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
let lines = content.split('\n');

const replaces = {
  'value={envs}': 'onChange={(e) => setEnvs(e.target.value)}',
  'value={similarityThreshold}': 'onChange={(e) => setSimilarityThreshold(Number(e.target.value))}',
  'value={filterIdList}': 'onChange={(e) => setFilterIdList(e.target.value)}',
  'value={docStartPage}': 'onChange={(e) => setDocStartPage(Number(e.target.value))}',
  'value={docEndPage}': 'onChange={(e) => setDocEndPage(Number(e.target.value))}',
  'value={generatedLatex}': 'onChange={(e) => setGeneratedLatex(e.target.value)}',
  'value={docGeneratedLatex}': 'onChange={(e) => setDocGeneratedLatex(e.target.value)}',
  'value={apiKey}': 'onChange={(e) => setApiKey(e.target.value)}',
  'value={mainTexContent}': 'onChange={(e) => setMainTexContent(e.target.value)}',
  'value={idListText}': 'onChange={(e) => setIdListText(e.target.value)}',
  'onClick={() => downloadFile(generatedLatex, \'generated_question.tex\')}': '',
  'onClick={() => downloadFile(docGeneratedLatex, \'document_questions.tex\')}': '',
};

for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (replaces[trimmed] !== undefined) {
    if (lines[i+1].trim() === '') {
       lines[i+1] = lines[i].replace(trimmed, replaces[trimmed]);
    }
  }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
