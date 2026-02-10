interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  details?: string;
  className?: string;
}

export function ProgressBar({ progress, label, details, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      {label && <div className="mb-2 text-sm font-semibold text-slate-900">{label}</div>}
      {details && <div className="mb-2 text-xs text-slate-600">{details}</div>}
      <div className="w-full h-2.5 overflow-hidden rounded-full bg-blue-100/90">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-1 text-xs font-medium text-slate-600">
        {Math.round(clamped)}%
      </div>
    </div>
  );
}
