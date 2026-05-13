import type { ReactNode } from "react";

interface TableProps {
  headers?: ReactNode[];
  rows?: ReactNode[][];
  children?: ReactNode;
}

export function Table({ headers, rows, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="forbot-base-table w-full text-sm">
        {headers && (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {rows ? (
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
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
