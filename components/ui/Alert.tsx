import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: ReactNode;
}

const CONFIG: Record<
  AlertType,
  {
    label: string;
    className: string;
    Icon: typeof Info;
  }
> = {
  info: {
    label: "Informacja",
    className: "border-sky-200 bg-sky-50 text-sky-950",
    Icon: Info,
  },
  success: {
    label: "Gotowe",
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    Icon: CheckCircle2,
  },
  warning: {
    label: "Uwaga",
    className: "border-amber-300 bg-amber-50 text-amber-950",
    Icon: TriangleAlert,
  },
  error: {
    label: "Problem",
    className: "border-red-300 bg-red-50 text-red-950",
    Icon: AlertCircle,
  },
};

export function Alert({ type = "info", title, children }: AlertProps) {
  const { Icon, className, label } = CONFIG[type];

  return (
    <aside
      role={type === "error" ? "alert" : "note"}
      className={`my-4 rounded-md border px-4 py-3 text-sm ${className}`}
    >
      <div className="flex gap-3">
        <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">{title ?? label}</p>
          <div className="mt-1 leading-6">{children}</div>
        </div>
      </div>
    </aside>
  );
}
