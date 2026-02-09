import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { AUDIT_LOGS } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function AuditPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<typeof AUDIT_LOGS[0] | null>(null);

  const filtered = AUDIT_LOGS.filter(l =>
    l.action.includes(search) || l.details.includes(search) || l.actor.includes(search)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="审计日志" description="所有操作的审计追踪记录" />
      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar
            searchPlaceholder="搜索操作、用户、描述..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              { key: 'actorType', label: '操作者类型', options: [{ value: 'user', label: '用户' }, { value: 'service_account', label: 'Service Account' }] },
              { key: 'action', label: '操作', options: [
                { value: 'deploy', label: '部署' },
                { value: 'create', label: '创建' },
                { value: 'update', label: '更新' },
                { value: 'delete', label: '删除' },
              ]},
            ]}
            onRefresh={() => toast({ title: '已刷新' })}
            onExport={() => toast({ title: '导出中...' })}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>操作</TableHead>
              <TableHead>资源类型</TableHead>
              <TableHead>操作者</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>项目</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(l => (
              <TableRow key={l.id} className="cursor-pointer" onClick={() => setDetail(l)}>
                <TableCell className="font-mono text-xs">{l.action}</TableCell>
                <TableCell><StatusBadge label={l.resourceType} color="gray" /></TableCell>
                <TableCell className="font-medium">{l.actor}</TableCell>
                <TableCell>
                  <StatusBadge label={l.actorType === 'service_account' ? 'SA' : '用户'} color={l.actorType === 'service_account' ? 'purple' : 'blue'} />
                </TableCell>
                <TableCell className="text-muted-foreground">{l.project}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.ip}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{l.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      {/* Audit detail with diff */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>审计详情</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">操作：</span><span className="font-mono">{detail.action}</span></div>
                <div><span className="text-muted-foreground">资源：</span>{detail.resourceType}</div>
                <div><span className="text-muted-foreground">操作者：</span>{detail.actor}</div>
                <div><span className="text-muted-foreground">IP：</span><span className="font-mono">{detail.ip}</span></div>
                <div><span className="text-muted-foreground">时间：</span>{detail.timestamp}</div>
                <div><span className="text-muted-foreground">项目：</span>{detail.project}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">描述</div>
                <p className="text-sm text-muted-foreground">{detail.details}</p>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">变更 Diff</div>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs space-y-1">
                  <div className="text-destructive">- "tag": "prod" → "model_version_id": "mv-001"</div>
                  <div className="text-success">+ "tag": "prod" → "model_version_id": "mv-002"</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
