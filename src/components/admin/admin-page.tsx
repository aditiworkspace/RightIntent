export function AdminPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="mb-8 pb-6 border-b border-[var(--line)]">
        <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--terra)]">
          {eyebrow}
        </span>
        <h1 className="font-[family-name:var(--serif)] text-[clamp(32px,3.5vw,46px)] font-normal tracking-tight text-[var(--ink)] mt-1 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-[var(--muted)] max-w-2xl m-0 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function AdminTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-[var(--line)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--paper)]/60">
              {columns.map((column) => (
                <th
                  key={column}
                  className="py-3.5 px-5 font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(28,38,34,0.06)] text-[13px]">
            {rows.length ? (
              rows.map((row, index) => (
                <tr
                  key={`${row[0]}-${index}`}
                  className="hover:bg-[rgba(28,38,34,0.02)] transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className="py-4 px-5 font-[family-name:var(--sans)] text-[var(--ink)]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-[var(--muted)] font-[family-name:var(--mono)] text-[12px]"
                >
                  No records found in this collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
