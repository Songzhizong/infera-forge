import { KPICard } from '@/components/shared/KPICard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, getServiceStateColor, getFineTuneStatusColor } from '@/components/shared/StatusBadge';
import { useRole } from '@/contexts/RoleContext';
import { PROJECTS, SERVICES, ALERTS, FINETUNE_JOBS, USAGE_DATA } from '@/lib/mock-data';
import { Server, Brain, CreditCard, Zap, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { canViewFinance, canViewModels } = useRole();
  const activeServices = SERVICES.filter(s => s.currentState === 'Ready').length;
  const firingAlerts = ALERTS.filter(a => a.status === 'firing').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="控制台" description="Infera 平台概览" />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="项目数" value={PROJECTS.length} icon={Server} color="blue" trend="活跃项目" />
        {canViewModels && <KPICard title="在线服务" value={activeServices} icon={Activity} color="green" trend={`共 ${SERVICES.length} 个服务`} />}
        {canViewFinance && <KPICard title="本月费用" value="¥74,220" icon={CreditCard} color="orange" trend="较上月 +12.3%" />}
        <KPICard title="活跃告警" value={firingAlerts} icon={AlertTriangle} color="red" trend={`${ALERTS.length} 条总告警`} />
      </div>

      {/* Charts */}
      {canViewFinance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-section-title text-foreground mb-4">Token 用量趋势</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={USAGE_DATA.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`${(v / 1000000).toFixed(2)}M`, 'Tokens']} />
                <Area type="monotone" dataKey="tokens" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-section-title text-foreground mb-4">每日成本 (¥)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={USAGE_DATA.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => [`¥${v}`, '成本']} />
                <Area type="monotone" dataKey="cost" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active services */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-section-title text-foreground">推理服务状态</h3>
            <Link to="/services" className="text-sm text-primary hover:underline">查看全部</Link>
          </div>
          <div className="space-y-3">
            {SERVICES.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.project}</div>
                </div>
                <StatusBadge label={s.currentState} color={getServiceStateColor(s.currentState)} />
                <span className="text-xs text-muted-foreground w-16 text-right">{s.qps} QPS</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-section-title text-foreground">最近告警</h3>
            <Link to="/alerts" className="text-sm text-primary hover:underline">查看全部</Link>
          </div>
          <div className="space-y-3">
            {ALERTS.map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${a.severity === 'critical' ? 'text-destructive' : a.severity === 'warning' ? 'text-warning' : 'text-info'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.triggeredAt}</div>
                </div>
                <StatusBadge label={a.status === 'firing' ? '触发中' : '已恢复'} color={a.status === 'firing' ? 'red' : 'green'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
