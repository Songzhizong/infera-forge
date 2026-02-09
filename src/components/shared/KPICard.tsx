import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type KPIColor = 'blue' | 'green' | 'orange' | 'red';

interface KPICardProps {
  title: string;
  description?: string;
  value: string | number;
  icon: LucideIcon;
  color: KPIColor;
  trend?: string;
}

const colorMap: Record<KPIColor, { bg: string; icon: string }> = {
  blue: { bg: 'bg-kpi-blue-bg', icon: 'text-kpi-blue-icon' },
  green: { bg: 'bg-kpi-green-bg', icon: 'text-kpi-green-icon' },
  orange: { bg: 'bg-kpi-orange-bg', icon: 'text-kpi-orange-icon' },
  red: { bg: 'bg-kpi-red-bg', icon: 'text-kpi-red-icon' },
};

export function KPICard({ title, description, value, icon: Icon, color, trend }: KPICardProps) {
  const colors = colorMap[color];
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 animate-fade-in">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
        <Icon className={cn('w-6 h-6', colors.icon)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-muted-foreground">{title}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
        <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
        {trend && <div className="text-xs text-muted-foreground mt-0.5">{trend}</div>}
      </div>
    </div>
  );
}
