const fs = require('fs');
let code = fs.readFileSync('src/patch_ui.js', 'utf8');

const searchTail = `                      Câu hỏi tự luận
                    </label>
                  </div>
                </div>
              )}
              {activeTab === 'filter-by-id' && (`;

const replaceTail = `                      Câu hỏi tự luận
                    </label>
                  </div>
                </div>
                </div>
              )}
              {activeTab === 'filter-by-id' && (`;

code = code.replace(searchTail, replaceTail);
fs.writeFileSync('src/App.tsx', code);
