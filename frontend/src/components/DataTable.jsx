export default function DataTable({
  columns,
  rows,
  sortBy,
  order,
  onSort,
  rowKey = 'id',
  emptyMessage = 'Nothing to show yet.',
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button type="button" className="th-sort" onClick={() => onSort(col.key)}>
                    {col.label}
                    {sortBy === col.key && (
                      <span className="sort-arrow">{order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}
