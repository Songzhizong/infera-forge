import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, getServiceStateColor } from '@/components/shared/StatusBadge';
import { SERVICES } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, RotateCcw, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const METRICS_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  ttft: Math.round(50 + Math.random() * 80),
  tpot: Math.round(10 + Math.random() * 30),
  qps: Math.round(100 + Math.random() * 200),
  gpu: Math.round(60 + Math.random() * 35),
}));

const REVISIONS = [
  { id: 'rev-003', model: 'NLP-Core-FT-v2:v3 (mv-003)', gpu: 'A100-80G x2', traffic: 90, createdAt: '2026-02-09 10:30', status: 'active' },
  { id: 'rev-002', model: 'NLP-Core-FT-v2:v2 (mv-002)', gpu: 'A100-80G x2', traffic: 10, createdAt: '2026-02-05 14:00', status: 'active' },
  { id: 'rev-001', model: 'NLP-Core-FT-v2:v1 (mv-001)', gpu: 'A100-40G x2', traffic: 0, createdAt: '2026-01-28 09:00', status: 'inactive' },
];

const LOGS = [
  { time: '12:30:15.234', level: 'INFO', message: 'Request completed in 125ms, tokens: 342' },
  { time: '12:30:14.892', level: 'INFO', message: 'Request completed in 98ms, tokens: 128' },
  { time: '12:30:12.456', level: 'WARN', message: 'High GPU memory usage: 92%' },
  { time: '12:30:10.123', level: 'INFO', message: 'Request completed in 156ms, tokens: 512' },
  { time: '12:29:58.789', level: 'ERROR', message: 'Request timeout after 30000ms' },
  { time: '12:29:45.567', level: 'INFO', message: 'Autoscaler: scaling up to 3 replicas' },
];

export default function ServiceDetailPage() {
  const { id } = useParams();
  const service = SERVICES.find(s => s.id === id) || SERVICES[0];
  const { canEdit } = useRole();
  const { toast } = useToast();
  const [rollbackOpen, setRollbackOpen] = useState(false);
  const [trafficWeight, setTrafficWeight] = useState([90]);
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title={service.name}
        breadcrumbs={[{ label: '推理服务', path: '/services' }, { label: service.name }]}
        actions={canEdit ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Play className="w-4 h-4 mr-1" />启用</Button>
            <Button variant="outline" size="sm"><Square className="w-4 h-4 mr-1" />停用</Button>
            <Button variant="outline" size="sm"><RotateCcw className="w-4 h-4 mr-1" />重启</Button>
            <Link to="/audit"><Button variant="outline" size="sm">审计记录</Button></Link>
          </div>
        ) : undefined}
      />

      {/* Overview card */}
      <div className="bg-card rounded-xl border border-border p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">状态</div>
          <StatusBadge label={service.currentState} color={getServiceStateColor(service.currentState)} className="mt-1" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Endpoint</div>
          <div className="flex items-center gap-1 mt-1">
            <code className="text-xs font-mono">https://{service.name}.infera.dev/v1</code>
            <button onClick={() => toast({ title: '已复制' })}><Copy className="w-3 h-3 text-muted-foreground" /></button>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">当前 Revision</div>
          <div className="text-sm font-medium mt-1">{service.revision}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">GPU</div>
          <div className="text-sm font-medium mt-1">{service.gpu}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border">
        <Tabs defaultValue="metrics">
          <div className="border-b border-border px-4 pt-3">
            <TabsList className="bg-transparent h-9 p-0 gap-4">
              {['metrics', 'revisions', 'traffic', 'logs', 'playground'].map(t => (
                <TabsTrigger key={t} value={t} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2 capitalize">
                  {{ metrics: '监控', revisions: 'Revisions', traffic: '流量分配', logs: '日志', playground: 'Playground' }[t]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="metrics" className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3">TTFT / TPOT (ms)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={METRICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="ttft" stroke="hsl(var(--primary))" strokeWidth={2} name="TTFT" dot={false} />
                    <Line type="monotone" dataKey="tpot" stroke="hsl(var(--success))" strokeWidth={2} name="TPOT" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">GPU 利用率 (%)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={METRICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="gpu" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" strokeWidth={2} name="GPU" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="revisions" className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Revision</TableHead>
                  <TableHead>模型版本</TableHead>
                  <TableHead>GPU</TableHead>
                  <TableHead>流量</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REVISIONS.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">{r.id}</TableCell>
                    <TableCell className="text-sm">{r.model}</TableCell>
                    <TableCell>{r.gpu}</TableCell>
                    <TableCell>{r.traffic > 0 ? `${r.traffic}%` : '-'}</TableCell>
                    <TableCell>{r.createdAt}</TableCell>
                    <TableCell>
                      {canEdit && r.status === 'inactive' && (
                        <Button variant="outline" size="sm" onClick={() => setRollbackOpen(true)}>回滚到此版本</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="traffic" className="p-6 space-y-4">
            <h4 className="text-sm font-medium">灰度流量分配</h4>
            <div className="space-y-4 max-w-md">
              <div className="flex items-center justify-between text-sm">
                <span>rev-003 (新版)</span>
                <span className="font-mono font-medium">{trafficWeight[0]}%</span>
              </div>
              <Slider value={trafficWeight} onValueChange={setTrafficWeight} max={100} step={5} />
              <div className="flex items-center justify-between text-sm">
                <span>rev-002 (旧版)</span>
                <span className="font-mono font-medium">{100 - trafficWeight[0]}%</span>
              </div>
              {canEdit && (
                <Button onClick={() => toast({ title: `流量已更新：rev-003 ${trafficWeight[0]}% / rev-002 ${100 - trafficWeight[0]}%` })}>
                  应用流量配置
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="p-0">
            <div className="p-3 border-b border-border flex gap-2">
              <Input placeholder="搜索关键词..." className="max-w-[200px] h-8" />
              <select className="h-8 rounded-md border border-input bg-background px-2 text-sm">
                <option>ALL</option>
                <option>ERROR</option>
                <option>WARN</option>
                <option>INFO</option>
              </select>
            </div>
            <div className="font-mono text-xs divide-y divide-border">
              {LOGS.map((log, i) => (
                <div key={i} className="px-4 py-2 flex gap-3 hover:bg-accent/50">
                  <span className="text-muted-foreground shrink-0">{log.time}</span>
                  <span className={`shrink-0 w-12 ${log.level === 'ERROR' ? 'text-destructive' : log.level === 'WARN' ? 'text-warning' : 'text-muted-foreground'}`}>
                    {log.level}
                  </span>
                  <span className="text-foreground">{log.message}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playground" className="p-6 space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-lg border border-info/30 bg-info/5 text-sm">
              <AlertTriangle className="w-4 h-4 text-info shrink-0 mt-0.5" />
              <span>Prod 环境默认不记录 Playground 中的 prompt 内容。如需采样保留，请在设置中配置。</span>
            </div>
            <div className="space-y-2">
              <Label>输入 Prompt</Label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-input bg-background p-3 text-sm resize-y"
                placeholder="请输入测试 prompt..."
                value={playgroundInput}
                onChange={e => setPlaygroundInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setPlaygroundOutput('这是一个示例响应。模型成功处理了您的请求，生成了 42 个 tokens，耗时 125ms。')}>发送请求</Button>
              <Button variant="outline">清空</Button>
            </div>
            {playgroundOutput && (
              <div className="space-y-2">
                <Label>响应</Label>
                <div className="rounded-lg border border-border bg-muted p-4 text-sm whitespace-pre-wrap">{playgroundOutput}</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Rollback confirm */}
      <Dialog open={rollbackOpen} onOpenChange={setRollbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认回滚</DialogTitle>
            <DialogDescription>将服务回滚到 rev-001，此操作将创建新的 revision</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRollbackOpen(false)}>取消</Button>
            <Button onClick={() => { setRollbackOpen(false); toast({ title: '回滚已启动' }); }}>确认回滚</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
