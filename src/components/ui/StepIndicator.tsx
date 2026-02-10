import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  labels: string[];
  className?: string;
}

export function StepIndicator({ currentStep, labels, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {labels.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <div
            key={label}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200',
              isActive && 'bg-cyan-500 text-white shadow-md shadow-cyan-600/30',
              isComplete && 'bg-blue-600 text-white',
              !isActive && !isComplete && 'bg-white/65 text-slate-700'
            )}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Step ${step}: ${label}`}
          >
            <span className="hidden sm:inline">{step}. </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}
