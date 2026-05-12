interface ProgressProps {
  current: number;
  total: number;
  title?: string;
}

export function Progress({ current, total, title }: ProgressProps) {
  if (total <= 0) return null;

  const safeCurrent = Math.min(Math.max(current, 0), total);
  const percentage = Math.round((safeCurrent / total) * 100);

  return (
    <section className="forbot-progress mb-5" aria-label={title ?? "Postęp kursu"}>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-600">
        <span>{title ?? "Postęp kursu"}</span>
        <span>
          {safeCurrent}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[var(--forbot-green)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}
