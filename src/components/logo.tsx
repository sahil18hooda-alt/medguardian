import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <HeartPulse className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold font-headline text-foreground whitespace-nowrap">
        HealthAssist AI
      </h1>
    </div>
  );
}
