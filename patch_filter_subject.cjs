const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchState = `  const [filterClass, setFilterClass] = useState<string>('');`;
const replaceState = `  const [filterClass, setFilterClass] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [filterChapter, setFilterChapter] = useState<string>('');`;

code = code.replace(searchState, replaceState);

const searchList = `                    {availableIds.length > 0 && (
                      <div className="mb-3">
                        <select
                          value={filterClass}
                          onChange={(e) => setFilterClass(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        >
                          <option value="">Tất cả các lớp</option>
                          <option value="6">Lớp 6</option>
                          <option value="7">Lớp 7</option>
                          <option value="8">Lớp 8</option>
                          <option value="9">Lớp 9</option>
                          <option value="10">Lớp 10</option>
                          <option value="11">Lớp 11</option>
                          <option value="12">Lớp 12</option>
                        </select>
                      </div>
                    )}`;

const replaceList = `                    {availableIds.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div>
                          <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          >
                            <option value="">Tất cả lớp</option>
                            <option value="6">Lớp 6</option>
                            <option value="7">Lớp 7</option>
                            <option value="8">Lớp 8</option>
                            <option value="9">Lớp 9</option>
                            <option value="10">Lớp 10</option>
                            <option value="11">Lớp 11</option>
                            <option value="12">Lớp 12</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Phân môn (D, H...)"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value.toUpperCase())}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white placeholder:normal-case uppercase"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Chương (1, 2...)"
                            value={filterChapter}
                            onChange={(e) => setFilterChapter(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}`;

code = code.replace(searchList, replaceList);

const searchFilterLogic = `                        {availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true).map((item, idx) => (`;

const replaceFilterLogic = `                        {availableIds.filter(item => {
                          const match = item.id.match(/^\\[(\\d+)([A-Za-z]+)(\\d*)/);
                          if (!match) return true;
                          const [_, iClass, iSubj, iChap] = match;
                          if (filterClass && iClass !== filterClass) return false;
                          if (filterSubject && iSubj.toUpperCase() !== filterSubject.toUpperCase()) return false;
                          if (filterChapter && iChap !== filterChapter) return false;
                          return true;
                        }).map((item, idx) => (`;

code = code.replace(searchFilterLogic, replaceFilterLogic);

const searchSelectAllLogic = `                            const filteredList = availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true);`;

const replaceSelectAllLogic = `                            const filteredList = availableIds.filter(item => {
                              const match = item.id.match(/^\\[(\\d+)([A-Za-z]+)(\\d*)/);
                              if (!match) return true;
                              const [_, iClass, iSubj, iChap] = match;
                              if (filterClass && iClass !== filterClass) return false;
                              if (filterSubject && iSubj.toUpperCase() !== filterSubject.toUpperCase()) return false;
                              if (filterChapter && iChap !== filterChapter) return false;
                              return true;
                            });`;

code = code.replace(searchSelectAllLogic, replaceSelectAllLogic);

const searchSelectAllBtn = `                          {(availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true).length > 0 && availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true).every(id => filterSelections[id.id]?.checked)) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}`;

const replaceSelectAllBtn = `                          {(() => {
                            const filteredList = availableIds.filter(item => {
                              const match = item.id.match(/^\\[(\\d+)([A-Za-z]+)(\\d*)/);
                              if (!match) return true;
                              const [_, iClass, iSubj, iChap] = match;
                              if (filterClass && iClass !== filterClass) return false;
                              if (filterSubject && iSubj.toUpperCase() !== filterSubject.toUpperCase()) return false;
                              if (filterChapter && iChap !== filterChapter) return false;
                              return true;
                            });
                            return filteredList.length > 0 && filteredList.every(id => filterSelections[id.id]?.checked) ? 'Bỏ chọn tất cả' : 'Chọn tất cả';
                          })()}`;

code = code.replace(searchSelectAllBtn, replaceSelectAllBtn);

fs.writeFileSync('src/App.tsx', code);
