const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "{activeTab === 'image-to-latex' ? (",
  "{activeTab === 'image-to-latex' && ("
);

content = content.replace(
  "              ) : activeTab === 'doc-to-latex' ? (",
  "              )}\n              {activeTab === 'doc-to-latex' && ("
);

content = content.replace(
  "              ) : activeTab === 'filter-by-id' ? (",
  "              )}\n              {activeTab === 'filter-by-id' && ("
);

content = content.replace(
  "              ) : (",
  "              )}\n              {activeTab !== 'filter-by-id' && ("
);

fs.writeFileSync('src/App.tsx', content);
