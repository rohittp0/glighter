interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="p-4">
      {label && <div className="mb-2 text-sm font-medium text-gray-900">{label}</div>}
      <div className="w-full h-2 bg-surface rounded overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600 font-medium">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
