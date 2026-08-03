const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = `                  {availableIds.length > 0 && (
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
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-slate-50">`;

const replace = `                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Chọn ID từ danh sách (Tab 2)
                      </label>
                      {availableIds.length > 0 && (
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
                      )}
                    </div>
                    {availableIds.length > 0 ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-slate-50">`;

code = code.replace(search, replace);

const search2 = `                          </div>
                        ))}
                      </div>
                    </div>
                  )}`;

const replace2 = `                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 italic p-4 border border-slate-200 rounded-lg bg-slate-50">
                        Chưa có danh sách ID. Vui lòng sang tab "Gắn ID" để nhập danh sách.
                      </div>
                    )}
                  </div>`;

code = code.replace(search2, replace2);
fs.writeFileSync('src/App.tsx', code);
