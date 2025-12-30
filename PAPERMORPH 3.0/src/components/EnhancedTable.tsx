import React, { useMemo, useState } from 'react';

type Column<T> = { key: keyof T; label: string };

export function EnhancedTable<T extends Record<string, any>>({
  columns,
  data,
}: {
  columns: Column<T>[];
  data: T[];
}) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const f = filter.toLowerCase().trim();
    if (!f) return data;
    return data.filter((row) =>
      columns.some((c) => String(row[c.key]).toLowerCase().includes(f))
    );
  }, [data, filter, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va === vb) return 0;
      return va > vb ? 1 : -1;
    });
    if (sortDir === 'desc') sorted.reverse();
    return sorted;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="w-full rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-3 gap-2">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search table..."
          className="input-base max-w-xs"
          aria-label="Search table data"
        />
        <div className="text-xs text-muted-foreground">Rows: {sorted.length}</div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="text-left px-3 py-2 text-sm font-medium cursor-pointer select-none hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort(col.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(col.key);
                    }
                  }}
                  aria-label={`Sort by ${col.label} ${sortKey === col.key ? (sortDir === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {sortKey === col.key && <span className="text-xs text-muted-foreground">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-surface-hover'}>
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-3 py-2 text-sm align-top">
                    {String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnhancedTable;
