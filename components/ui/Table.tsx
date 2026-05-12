import type { ReactNode } from "react";

interface TableProps {
  headers?: ReactNode[];
  rows?: ReactNode[][];
  children?: ReactNode;
}

export function Table({ headers, rows, children }: TableProps) {
  return (
    <div className="my-5 overflow-x-auto rounded-md border border-[var(--forbot-line)]">
      <table className="min-w-full border-collapse text-sm">
        {headers && (
          <thead className="bg-[var(--forbot-green-soft)] text-left">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-3 py-2 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {rows ? (
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[var(--forbot-line)]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          children
        )}
      </table>
    </div>
  );
}
