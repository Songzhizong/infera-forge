import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useRole } from '@/contexts/RoleContext';
import { ALERTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Shield, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function QuotaAlertsPage() {
  const { canManage } = useRole();
  const { toast } = useToast();
  const [ruleOpen, setRuleOpen] = useState(false);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="配额、预算与告警" description="管理资源配额、预算策略和告警规则" />

      <Tabs defaultValue="quota">
        <TabsList>
          <TabsTrigger value="quota">配额</TabsTrigger>
          <TabsTrigger value="budget">预算</TabsTrigger>
          <TabsTrigger value="alerts">告警</TabsTrigger>
        </TabsList>

        <TabsContent value="quota" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard title="租户 GPU 配额" value="32 / 64" icon={Shield} color="blue" description="已使用 / 总配额" />
            <KPICard title="项目数配额" value="8 / 20" icon={Shield} color="green" description="已创建 / 上限" />
            <KPICard title="API Key 数量" value="6 / 50" icon={Shield} color="orange" description="已创建 / 上限" />
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-section-title mb-4">项目级配额</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目</TableHead>
                  <TableHead>GPU 配额</TableHead>
                  <TableHead>服务数上限</TableHead>
                  <TableHead>Key 数上限</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>NLP-Core</TableCell><TableCell>12</TableCell><TableCell>10</TableCell><TableCell>20</TableCell></TableRow>
                <TableRow><TableCell>ChatBot-Prod</TableCell><TableCell>16</TableCell><TableCell>15</TableCell><TableCell>30</TableCell></TableRow>
                <TableRow><TableCell>Vision-Lab</TableCell><TableCell>4</TableCell><TableCell>5</TableCell><TableCell>10</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="mt-4 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-section-title">预算策略</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>日预算上限 (¥)</Label>
                <Input type="number" defaultValue="5000" disabled={!canManage} />
              </div>
              <div className="space-y-2">
                <Label>月预算上限 (¥)</Label>
                <Input type="number" defaultValue="100000" disabled={!canManage} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div><div className="text-sm font-medium">80% 预算预警</div><div className="text-xs text-muted-foreground">达到预算 80% 时发送告警</div></div>
                <Switch defaultChecked disabled={!canManage} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div><div className="text-sm font-medium">100% 预算阻断</div><div className="text-xs text-muted-foreground">超过预算时阻断新请求</div></div>
                <Switch disabled={!canManage} />
              </div>
            </div>
            {canManage && <Button onClick={() => toast({ title: '预算策略已更新' })}>保存</Button>}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-3 gap-4 flex-1 mr-4">
              <KPICard title="触发中" value={ALERTS.filter(a => a.status === 'firing').length} icon={AlertTriangle} color="red" />
              <KPICard title="已恢复" value={ALERTS.filter(a => a.status === 'resolved').length} icon={Bell} color="green" />
              <KPICard title="总告警" value={ALERTS.length} icon={Bell} color="blue" />
            </div>
          </div>
          {canManage && (
            <Button className="gap-1.5" onClick={() => setRuleOpen(true)}>
              <Plus className="w-4 h-4" />
              添加告警规则
            </Button>
          )}
          <div className="bg-card rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>告警类型</TableHead>
                  <TableHead>严重度</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>当前值</TableHead>
                  <TableHead>阈值</TableHead>
                  <TableHead>触发时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ALERTS.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="text-xs">{a.type}</TableCell>
                    <TableCell>
                      <StatusBadge label={a.severity} color={a.severity === 'critical' ? 'red' : a.severity === 'warning' ? 'orange' : 'blue'} />
                    </TableCell>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell className="font-mono text-sm">{a.value}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{a.threshold}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{a.triggeredAt}</TableCell>
                    <TableCell>
                      <StatusBadge label={a.status === 'firing' ? '触发中' : '已恢复'} color={a.status === 'firing' ? 'red' : 'green'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={ruleOpen} onOpenChange={setRuleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>添加告警规则</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>告警类型</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="error_rate">错误率</SelectItem>
                  <SelectItem value="latency">延迟</SelectItem>
                  <SelectItem value="budget">预算</SelectItem>
                  <SelectItem value="pending">Pending 超时</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>阈值</Label>
              <Input placeholder="如 5%、200ms、¥10000" />
            </div>
            <div className="space-y-2">
              <Label>关联资源</Label>
              <Input placeholder="服务名或项目名" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRuleOpen(false)}>取消</Button>
            <Button onClick={() => { setRuleOpen(false); toast({ title: '告警规则已添加' }); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
