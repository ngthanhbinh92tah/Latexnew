const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchState = `  const [filterSelections, setFilterSelections] = useState<Record<string, {checked: boolean, count: string}>>({});
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);`;

const replaceState = `  const [filterSelections, setFilterSelections] = useState<Record<string, {checked: boolean, count: string}>>({});
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);
  const [filterClass, setFilterClass] = useState<string>('');`;

code = code.replace(searchState, replaceState);

const searchList = `                    {availableIds.length > 0 ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-slate-50">
                        {availableIds.map((item, idx) => (`;

const replaceList = `                    {availableIds.length > 0 && (
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
                    )}
                    {availableIds.length > 0 ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-slate-50">
                        {availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true).map((item, idx) => (`;

code = code.replace(searchList, replaceList);

const searchSelectAll = `                            const allChecked = availableIds.every(id => filterSelections[id.id]?.checked);
                            const newSelections = { ...filterSelections };
                            availableIds.forEach(id => {
                              newSelections[id.id] = { ...newSelections[id.id], checked: !allChecked };
                            });
                            setFilterSelections(newSelections);`;

const replaceSelectAll = `                            const filteredList = availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true);
                            const allChecked = filteredList.every(id => filterSelections[id.id]?.checked);
                            const newSelections = { ...filterSelections };
                            filteredList.forEach(id => {
                              newSelections[id.id] = { ...newSelections[id.id], checked: !allChecked };
                            });
                            setFilterSelections(newSelections);`;
                            
code = code.replace(searchSelectAll, replaceSelectAll);

const searchSelectAllBtn = `                          {availableIds.every(id => filterSelections[id.id]?.checked) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>`;

const replaceSelectAllBtn = `                          {(availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true).length > 0 && availableIds.filter(item => filterClass ? item.id.startsWith(\`[\${filterClass}\`) : true).every(id => filterSelections[id.id]?.checked)) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>`;

code = code.replace(searchSelectAllBtn, replaceSelectAllBtn);

fs.writeFileSync('src/App.tsx', code);
