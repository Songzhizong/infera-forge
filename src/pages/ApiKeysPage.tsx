import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { useRole } from '@/contexts/RoleContext';
import { API_KEYS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Copy, RotateCcw, Trash2, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const SCOPES = [
  { id: 'inference:invoke', label: '推理调用', desc: '调用推理服务 API' },
  { id: 'model:read', label: '模型读取', desc: '查看模型信息' },
  { id: 'service:read', label: '服务读取', desc: '查看服务状态' },
  { id: 'service:manage', label: '服务管理', desc: '部署/停用服务' },
];

export default function ApiKeysPage() {
  const { canEdit } = useRole();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [keySaved, setKeySaved] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const filtered = API_KEYS.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="API Keys"
        description="管理推理服务的 API 访问密钥"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setHelpOpen(true)}>
              <HelpCircle className="w-4 h-4 mr-1" />
              错误码说明
            </Button>
            {canEdit && (
              <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4" />
                创建 Key
              </Button>
            )}
          </div>
        }
      />

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar searchPlaceholder="搜索 Key 名称..." searchValue={search} onSearchChange={setSearch} onRefresh={() => toast({ title: '已刷新' })} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>Scopes</TableHead>
              <TableHead>RPM 限制</TableHead>
              <TableHead>每日 Token</TableHead>
              <TableHead>过期时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>项目</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(k => (
              <TableRow key={k.id}>
                <TableCell className="font-medium">{k.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {k.scopes.map(s => <StatusBadge key={s} label={s} color="blue" />)}
                  </div>
                </TableCell>
                <TableCell>{k.rpm.toLocaleString()}</TableCell>
                <TableCell>{k.dailyTokens}</TableCell>
                <TableCell>{k.expiresAt}</TableCell>
                <TableCell>
                  <StatusBadge label={k.status === 'active' ? '活跃' : '已吊销'} color={k.status === 'active' ? 'green' : 'red'} />
                </TableCell>
                <TableCell className="text-muted-foreground">{k.project}</TableCell>
                <TableCell>
                  {canEdit && k.status === 'active' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="轮换" onClick={() => toast({ title: '新 Key 已生成' })}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="吊销" onClick={() => setRevokeOpen(k.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      {/* Create Key Dialog */}
      <Dialog open={createOpen} onOpenChange={v => { if (!v) { setCreateOpen(false); setCreatedKey(null); setKeySaved(false); } }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{createdKey ? 'Key 创建成功' : '创建 API Key'}</DialogTitle>
          </DialogHeader>
          {!createdKey ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Key 名称 <span className="text-destructive">*</span></Label>
                <Input placeholder="my-api-key" />
              </div>
              <div className="space-y-2">
                <Label>权限范围 (Scopes)</Label>
                <div className="space-y-2">
                  {SCOPES.map(s => (
                    <div key={s.id} className="flex items-center gap-2">
                      <Checkbox id={s.id} defaultChecked={s.id === 'inference:invoke'} />
                      <label htmlFor={s.id} className="text-sm">{s.label} <span className="text-muted-foreground">- {s.desc}</span></label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">默认仅授予 inference:invoke（最小权限原则）</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RPM 限制</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>每日 Token 上限</Label>
                  <Input placeholder="10M" defaultValue="10000000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>过期时间</Label>
                <Input type="date" defaultValue="2026-12-31" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
                <Button onClick={() => setCreatedKey('sk-inf-' + Math.random().toString(36).slice(2, 34))}>创建</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="bg-warning/5 border border-warning/30 rounded-lg p-4 text-sm">
                <p className="font-medium text-warning flex items-center gap-1">
                  <EyeOff className="w-4 h-4" />
                  此密钥仅展示一次，请立即保存
                </p>
                <p className="text-muted-foreground mt-1">关闭此对话框后将无法再次查看完整密钥</p>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                <code className="text-sm font-mono flex-1 break-all">{createdKey}</code>
                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => { navigator.clipboard.writeText(createdKey); toast({ title: '已复制到剪贴板' }); }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="saved" checked={keySaved} onCheckedChange={v => setKeySaved(!!v)} />
                <label htmlFor="saved" className="text-sm">我已安全保存此密钥</label>
              </div>
              <DialogFooter>
                <Button disabled={!keySaved} onClick={() => { setCreateOpen(false); setCreatedKey(null); setKeySaved(false); }}>
                  确认完成
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke confirm */}
      <Dialog open={!!revokeOpen} onOpenChange={() => setRevokeOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">吊销 API Key</DialogTitle>
            <DialogDescription>吊销后，使用此 Key 的所有请求将立即返回 403 错误。此操作不可逆。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeOpen(null)}>取消</Button>
            <Button variant="destructive" onClick={() => { setRevokeOpen(null); toast({ title: 'Key 已吊销' }); }}>确认吊销</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error codes help drawer */}
      <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
        <SheetContent className="w-[400px] sm:w-[480px]">
          <SheetHeader>
            <SheetTitle>API 错误码说明</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {[
              { code: '403', title: 'Forbidden', desc: 'Key 无效、已吊销或权限不足。请检查 Key 状态和 scopes。' },
              { code: '409', title: 'Conflict', desc: '资源冲突，例如模型版本正在被引用无法删除 (resource_in_use)。' },
              { code: '429', title: 'Too Many Requests', desc: '超过 RPM 或每日 Token 限制。响应头包含 retry-after 字段，请按此时间重试。' },
              { code: '503', title: 'Service Unavailable', desc: '服务不可用，可能正在冷启动或正在部署。请等待后重试。' },
            ].map(e => (
              <div key={e.code} className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge label={e.code} color={e.code === '403' || e.code === '503' ? 'red' : e.code === '429' ? 'orange' : 'blue'} />
                  <span className="font-medium text-sm">{e.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
