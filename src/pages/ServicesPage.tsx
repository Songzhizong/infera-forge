import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge, getServiceStateColor, getEnvColor } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { useRole } from '@/contexts/RoleContext';
import { SERVICES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Play, Square, RotateCcw, AlertTriangle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

export default function ServicesPage() {
  const { canEdit } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingAlert, setPendingAlert] = useState<typeof SERVICES[0] | null>(null);

  const filtered = SERVICES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="推理服务"
        description="管理模型推理服务的部署与监控"
        actions={canEdit ? (
          <Button className="gap-1.5" onClick={() => navigate('/services/create')}>
            <Plus className="w-4 h-4" />
            创建服务
          </Button>
        ) : undefined}
      />

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar
            searchPlaceholder="搜索服务名称..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              { key: 'state', label: '状态', options: [
                { value: 'Ready', label: 'Ready' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Failed', label: 'Failed' },
                { value: 'Inactive', label: 'Inactive' },
              ]},
              { key: 'env', label: '环境', options: [
                { value: 'Prod', label: 'Prod' },
                { value: 'Dev', label: 'Dev' },
                { value: 'Test', label: 'Test' },
              ]},
            ]}
            onRefresh={() => toast({ title: '已刷新' })}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务名称</TableHead>
              <TableHead>项目</TableHead>
              <TableHead>环境</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>QPS</TableHead>
              <TableHead>错误率</TableHead>
              <TableHead>P95 延迟</TableHead>
              <TableHead>GPU</TableHead>
              <TableHead className="w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => navigate(`/services/${s.id}`)}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.project}</TableCell>
                <TableCell><StatusBadge label={s.env} color={getEnvColor(s.env)} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge label={s.currentState} color={getServiceStateColor(s.currentState)} />
                    {s.currentState === 'Pending' && (
                      <button onClick={e => { e.stopPropagation(); setPendingAlert(s); }}>
                        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                      </button>
                    )}
                    {s.currentState === 'Inactive' && (
                      <span title="Scale-to-zero"><Clock className="w-3.5 h-3.5 text-muted-foreground" /></span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{s.runtime}</TableCell>
                <TableCell>{s.qps}</TableCell>
                <TableCell>{s.errorRate}</TableCell>
                <TableCell>{s.latencyP95}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.gpu}</TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/services/${s.id}`)}>查看详情</DropdownMenuItem>
                      {canEdit && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Play className="w-4 h-4 mr-2" />启用</DropdownMenuItem>
                          <DropdownMenuItem><Square className="w-4 h-4 mr-2" />停用</DropdownMenuItem>
                          <DropdownMenuItem><RotateCcw className="w-4 h-4 mr-2" />重启</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      {/* Pending timeout alert */}
      <Dialog open={!!pendingAlert} onOpenChange={() => setPendingAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              服务 Pending 超时
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 text-sm space-y-2">
              <p><strong>服务：</strong>{pendingAlert?.name}</p>
              <p><strong>请求资源：</strong>{pendingAlert?.gpu}</p>
              <p><strong>可能原因：</strong>当前资源池 GPU 资源不足</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">建议操作：</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>尝试更换为较小的 GPU 规格（如 L40S 替代 H100）</li>
                <li>切换到其他可用资源池</li>
                <li>等待资源释放后自动调度</li>
                <li>联系平台管理员扩容资源池</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingAlert(null)}>关闭</Button>
            <Button onClick={() => { setPendingAlert(null); toast({ title: '已提交资源申请' }); }}>申请扩容</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
