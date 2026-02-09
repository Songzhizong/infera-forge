import { cn } from '@/lib/utils';

type BadgeColor = 'blue' | 'green' | 'orange' | 'gray' | 'red' | 'purple';

interface StatusBadgeProps {
  label: string;
  color: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  blue: 'bg-badge-blue-bg text-badge-blue-text',
  green: 'bg-badge-green-bg text-badge-green-text',
  orange: 'bg-badge-orange-bg text-badge-orange-text',
  gray: 'bg-badge-gray-bg text-badge-gray-text',
  red: 'bg-badge-red-bg text-badge-red-text',
  purple: 'bg-badge-purple-bg text-badge-purple-text',
};

export function StatusBadge({ label, color, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClasses[color],
      className
    )}>
      {label}
    </span>
  );
}

// Helper for service states
export function getServiceStateColor(state: string): BadgeColor {
  switch (state) {
    case 'Ready': return 'green';
    case 'Starting':
    case 'Downloading': return 'blue';
    case 'Pending': return 'orange';
    case 'Inactive': return 'gray';
    case 'Failed': return 'red';
    default: return 'gray';
  }
}

// Helper for env badges
export function getEnvColor(env: string): BadgeColor {
  switch (env) {
    case 'Prod': return 'red';
    case 'Test': return 'orange';
    case 'Dev': return 'blue';
    default: return 'gray';
  }
}

// Helper for finetune status
export function getFineTuneStatusColor(status: string): BadgeColor {
  switch (status) {
    case 'Succeeded': return 'green';
    case 'Running': return 'blue';
    case 'Queued': return 'orange';
    case 'Failed': return 'red';
    case 'Canceled': return 'gray';
    default: return 'gray';
  }
}

export function getModelTypeColor(type: string): BadgeColor {
  switch (type) {
    case 'system': return 'blue';
    case 'private': return 'purple';
    case 'shared': return 'green';
    default: return 'gray';
  }
}
