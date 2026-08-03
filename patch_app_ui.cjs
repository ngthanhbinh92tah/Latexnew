const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchState = `  const [filterIdList, setFilterIdList] = useState<string>('');
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);`;

const replaceState = `  const [filterIdList, setFilterIdList] = useState<string>('');
  const [filterSelections, setFilterSelections] = useState<Record<string, {checked: boolean, count: string}>>({});
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);

  const availableIds = useMemo(() => {
    if (!idListText) return [];
    const lines = idListText.split('\\n').map(l => l.trim()).filter(Boolean);
    const ids: { id: string, desc: string, fullLine: string }[] = [];
    lines.forEach(line => {
      const match = line.match(/^(\\[[^\\]]+\\])(.*)/);
      if (match) {
         ids.push({ id: match[1].trim(), desc: match[2].trim(), fullLine: line });
      }
    });
    return ids;
  }, [idListText]);

  const hasSelectedIds = filterIdList.trim().length > 0 || availableIds.some(id => filterSelections[id.id]?.checked);`;

code = code.replace(searchState, replaceState);

const searchFilterFn = `  const handleFilter = () => {
    if (filterFilesContent.length === 0 || !filterIdList) return;
    setIsFiltering(true);
    
    setTimeout(() => {
      const result = filterQuestionsByIds(filterFilesContent, envs, filterIdList, filterIncludeEssay, filterIncludeMultipleChoice);`;

const replaceFilterFn = `  const handleFilter = () => {
    let combinedFilterIds = filterIdList.trim();
    if (availableIds.length > 0) {
      const selectedFromList = availableIds
        .filter(item => filterSelections[item.id]?.checked)
        .map(item => {
          const count = filterSelections[item.id]?.count;
          return count ? \`\${item.id} \${count}\` : item.id;
        })
        .join('\\n');
      if (selectedFromList) {
        combinedFilterIds = combinedFilterIds ? \`\${selectedFromList}\\n\${combinedFilterIds}\` : selectedFromList;
      }
    }

    if (filterFilesContent.length === 0 || !combinedFilterIds) {
      alert("Vui lòng nhập hoặc chọn ID cần lọc.");
      return;
    }
    setIsFiltering(true);
    
    setTimeout(() => {
      const result = filterQuestionsByIds(filterFilesContent, envs, combinedFilterIds, filterIncludeEssay, filterIncludeMultipleChoice);`;

code = code.replace(searchFilterFn, replaceFilterFn);

const searchButton = `disabled={filterFilesContent.length === 0 || isFiltering || !filterIdList}`;
const replaceButton = `disabled={filterFilesContent.length === 0 || isFiltering || !hasSelectedIds}`;

code = code.replace(searchButton, replaceButton);

const searchUI = `              {activeTab === 'filter-by-id' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Danh sách ID cần lọc (mỗi ID một dòng)
                  </label>
                  <textarea`;

const replaceUI = `              {activeTab === 'filter-by-id' && (
                <div className="space-y-4">
                  {availableIds.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Chọn ID từ danh sách (Tab 2)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const allChecked = availableIds.every(id => filterSelections[id.id]?.checked);
                            const newSelections = { ...filterSelections };
                            availableIds.forEach(id => {
                              newSelections[id.id] = { ...newSelections[id.id], checked: !allChecked };
                            });
                            setFilterSelections(newSelections);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded"
                        >
                          {availableIds.every(id => filterSelections[id.id]?.checked) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-slate-50">
                        {availableIds.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border-b border-slate-100 last:border-b-0 hover:bg-slate-100 transition-colors">
                            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                              <input 
                                type="checkbox"
                                checked={!!filterSelections[item.id]?.checked}
                                onChange={(e) => {
                                  setFilterSelections(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], checked: e.target.checked }
                                  }));
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                              />
                              <div className="truncate text-sm">
                                <span className="font-bold text-slate-700 mr-2">{item.id}</span>
                                <span className="text-slate-500">{item.desc}</span>
                              </div>
                            </label>
                            <div className="ml-4 flex items-center gap-2 shrink-0">
                              <span className="text-xs text-slate-500">SL:</span>
                              <input 
                                type="number" 
                                min="1"
                                placeholder="Tất cả"
                                value={filterSelections[item.id]?.count || ''}
                                onChange={(e) => {
                                  setFilterSelections(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], count: e.target.value, checked: true }
                                  }));
                                }}
                                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {availableIds.length > 0 ? "Hoặc nhập ID bổ sung (mỗi ID một dòng)" : "Danh sách ID cần lọc (mỗi ID một dòng)"}
                    </label>
                    <textarea`;

code = code.replace(searchUI, replaceUI);

const searchUITail = `                      Câu hỏi tự luận (không thêm A, B, C, D)
                    </label>
                  </div>
                </div>
              )}`;
const replaceUITail = `                      Câu hỏi tự luận (không thêm A, B, C, D)
                    </label>
                  </div>
                  </div>
                </div>
              )}`;
// We need to make sure we replace the closing div correctly because we changed `<div>` to `<div className="space-y-4">` and added another `<div>` for the textarea wrapper. Let's use string manipulation instead for the tail or be more precise.
fs.writeFileSync('src/patch_ui.js', code);
