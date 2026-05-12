/**
 * Jak używać w lekcji MDX:
 *
 *   <Table
 *     caption="Porównanie platform"
 *     headers={["Cecha", "Arduino", "Raspberry Pi"]}
 *     rows={[
 *       ["Typ", "Mikrokontroler", "Mikrokomputer"],
 *       ["System", "Brak", "Linux"],
 *     ]}
 *   />
 *
 *   <Table caption="Porównanie platform">
 *     <thead>
 *       <tr><th>Cecha</th><th>Arduino</th></tr>
 *     </thead>
 *     <tbody>
 *       <tr><td>Typ</td><td>Mikrokontroler</td></tr>
 *     </tbody>
 *   </Table>
 *
 * <Table caption="…" headers={["…"]} rows={[["…"]]} />
 *
 * Responsive table for lesson content. Server Component.
 */
import type { ReactNode } from "react";

import { Table as BaseTable } from "@/components/ui/Table";

interface TableProps {
  caption?: string;
  headers?: ReactNode[];
  rows?: ReactNode[][];
  children?: ReactNode;
}

export function Table({ caption, headers, rows, children }: TableProps) {
  return (
    <figure className="my-6">
      {caption && (
        <figcaption className="forbot-table-caption">
          {caption}
        </figcaption>
      )}
      {children ? (
        <div className="forbot-table-wrap">
          <table className="forbot-table">{children}</table>
        </div>
      ) : (
        <BaseTable headers={headers} rows={rows} />
      )}
    </figure>
  );
}
