const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = `                      Câu hỏi tự luận
                    </label>
                  </div>
                </div>
              )}
              {activeTab === 'image-to-latex' && (`;

const replace = `                      Câu hỏi tự luận
                    </label>
                  </div>
                </div>
                </div>
              )}
              {activeTab === 'image-to-latex' && (`;

code = code.replace(search, replace);
fs.writeFileSync('src/App.tsx', code);
