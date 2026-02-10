import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PanelCardProps {
  children: ReactNode;
  className?: string;
}

export function PanelCard({ children, className }: PanelCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/60 bg-white/90 shadow-[0_14px_40px_rgba(4,25,58,0.12)] backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
