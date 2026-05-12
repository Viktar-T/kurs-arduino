/**
 * Jak używać w lekcji MDX:
 *
 *   <Pinout
 *     board="Arduino UNO"
 *     pins={[{ pin: "D13", function: "LED_BUILTIN", note: "Dioda na płytce" }]}
 *   />
 *
 * Możesz też pominąć `pins` i wpisać własną treść między tagami.
 */
import type { ReactNode } from "react";

import { Table } from "@/components/ui/Table";

export interface PinoutPin {
  pin: string;
  function: string;
  note?: string;
}

interface PinoutProps {
  board?: string;
  pins?: PinoutPin[];
  children?: ReactNode;
}

export function Pinout({
  board = "Arduino UNO",
  pins = [],
  children,
}: PinoutProps) {
  if (pins.length === 0 && !children) return null;

  return (
    <section className="forbot-pinout my-6">
      <div className="mb-2">
        <p className="forbot-label text-xs font-semibold uppercase">
          Pinout
        </p>
        <p className="text-lg font-semibold">{board}</p>
      </div>
      {pins.length > 0 ? (
        <Table
          headers={["Pin", "Funkcja", "Notatka"]}
          rows={pins.map((pin) => [
            <span key="pin" className="font-mono font-semibold">
              {pin.pin}
            </span>,
            pin.function,
            pin.note ?? "",
          ])}
        />
      ) : (
        <div className="forbot-pinout-content">{children}</div>
      )}
    </section>
  );
}
