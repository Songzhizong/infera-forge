import { PageHeader } from '@/components/shared/PageHeader';
import { useRole } from '@/contexts/RoleContext';
import { USAGE_DATA } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const BY_SERVICE = [
  { name: 'chat-service', tokens: '28.5M', cost: '¥11,400', gpuHours: 156 },
  { name: 'nlp-inference', tokens: '12.2M', cost: '¥4,880', gpuHours: 68 },
  { name: 'translate-api', tokens: '9.8M', cost: '¥3,920', gpuHours: 52 },
  { name: 'recommend-svc', tokens: '7.1M', cost: '¥2,840', gpuHours: 38 },
  { name: 'vision-api', tokens: '3.4M', cost: '¥1,360', gpuHours: 18 },
];

export default function UsagePage() {
  const { canViewFinance } = useRole();
  const { toast } = useToast();

  if (!canViewFinance) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-medium">无权限查看</h2>
          <p className="text-sm text-muted-foreground mt-1">当前角色无法查看用量与成本数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="用量与成本"
        description="查看平台资源使用情况与费用明细"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast({ title: '导出中...' })}>
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        }
      />

      <div className="flex gap-3 items-center">
        <Select defaultValue="service">
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="project">按项目</SelectItem>
            <SelectItem value="service">按服务</SelectItem>
            <SelectItem value="key">按 API Key</SelectItem>
            <SelectItem value="model">按模型版本</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="day">
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">小时</SelectItem>
            <SelectItem value="day">天</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-section-title mb-4">Token 消耗趋势</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={USAGE_DATA.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => [`${(v / 1000000).toFixed(2)}M`, 'Tokens']} />
              <Bar dataKey="tokens" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-section-title mb-4">GPU 使用时长 (小时)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={USAGE_DATA.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Area type="monotone" dataKey="gpuHours" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.1)" strokeWidth={2} name="GPU Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-section-title">按服务明细</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务名称</TableHead>
              <TableHead>Token 消耗</TableHead>
              <TableHead>费用</TableHead>
              <TableHead>GPU 时长 (h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BY_SERVICE.map(s => (
              <TableRow key={s.name}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.tokens}</TableCell>
                <TableCell>{s.cost}</TableCell>
                <TableCell>{s.gpuHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
