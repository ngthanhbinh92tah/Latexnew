const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const [useDefaultIds, setUseDefaultIds] = useState(false);",
  "const [useDefaultIds, setUseDefaultIds] = useState(true);"
);

fs.writeFileSync('src/App.tsx', code);
