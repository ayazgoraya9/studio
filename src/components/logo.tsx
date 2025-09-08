import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export function Logo({ className, ...props }: LucideProps) {
  return (
    <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground", className)}>
        <ShoppingCart {...props} />
    </div>
  );
}
