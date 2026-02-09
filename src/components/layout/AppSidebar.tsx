import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Server, Database, Brain, FlaskConical,
  BarChart3, Key, Shield, FileText, Users, CreditCard, AlertTriangle,
  Settings, ChevronDown, ChevronRight, Cpu, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CURRENT_TENANT } from '@/lib/mock-data';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: '控制台', icon: LayoutDashboard, path: '/' },
  { label: '项目管理', icon: FolderOpen, path: '/projects' },
  {
    label: '模型库', icon: Brain, children: [
      { label: '模型列表', path: '/models' },
      { label: '数据集', path: '/datasets' },
    ]
  },
  {
    label: '推理与微调', icon: Cpu, children: [
      { label: '推理服务', path: '/services' },
      { label: '微调任务', path: '/finetune' },
      { label: '评估', path: '/evaluation' },
    ]
  },
  { label: 'API Keys', icon: Key, path: '/api-keys' },
  {
    label: '用量与成本', icon: BarChart3, children: [
      { label: '用量统计', path: '/usage' },
      { label: '配额与预算', path: '/quota' },
      { label: '告警管理', path: '/alerts' },
    ]
  },
  {
    label: '管理', icon: Settings, children: [
      { label: '成员管理', path: '/members' },
      { label: '审计日志', path: '/audit' },
    ]
  },
  {
    label: '平台管理', icon: Layers, children: [
      { label: '系统模型', path: '/platform/models' },
      { label: 'GPU 资源池', path: '/platform/resources' },
    ]
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['模型库', '推理与微调', '用量与成本', '管理']));

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isGroupActive = (item: NavItem) => item.children?.some(c => location.pathname === c.path);

  return (
    <aside className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-14 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Cpu className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground text-base tracking-tight">
          INFERA
        </span>
        <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-badge-blue-bg text-badge-blue-text font-medium">
          {CURRENT_TENANT.env}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-3">
        {NAV_ITEMS.map((item) => {
          if (item.path) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                  isActive(item.path)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          }

          const expanded = expandedGroups.has(item.label);
          const groupActive = isGroupActive(item);

          return (
            <div key={item.label} className="mb-0.5">
              <button
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full transition-colors',
                  groupActive ? 'text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">{item.label}</span>
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expanded && item.children && (
                <div className="ml-8 mt-0.5 space-y-0.5">
                  {item.children.map(child => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        'block px-3 py-1.5 rounded-md text-sm transition-colors',
                        isActive(child.path)
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
