import { Search, Filter, RefreshCw, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReactNode } from 'react';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  filters?: { key: string; label: string; options: { value: string; label: string }[] }[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  actions?: ReactNode;
}

export function FilterBar({
  searchPlaceholder = '搜索...',
  searchValue,
  onSearchChange,
  filters,
  filterValues = {},
  onFilterChange,
  onRefresh,
  onExport,
  actions,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {filters?.map(f => (
        <Select
          key={f.key}
          value={filterValues[f.key] || 'all'}
          onValueChange={v => onFilterChange?.(f.key, v)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部{f.label}</SelectItem>
            {f.options.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      <div className="flex-1" />

      {onRefresh && (
        <Button variant="outline" size="sm" className="h-9" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
      {onExport && (
        <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={onExport}>
          <Download className="w-4 h-4" />
          导出
        </Button>
      )}
      {actions}
    </div>
  );
}
