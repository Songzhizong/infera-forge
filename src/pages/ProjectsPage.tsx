import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge, getEnvColor } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { useRole } from '@/contexts/RoleContext';
import { PROJECTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, MoreHorizontal, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function ProjectsPage() {
  const { canEdit, canManage } = useRole();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const filtered = PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProject = PROJECTS.find(p => p.id === deleteOpen);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="项目管理"
        description="管理所有项目及其环境"
        actions={canEdit ? (
          <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            新建项目
          </Button>
        ) : undefined}
      />

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar
            searchPlaceholder="搜索项目名称..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[{ key: 'env', label: '环境', options: [{ value: 'Prod', label: 'Prod' }, { value: 'Dev', label: 'Dev' }, { value: 'Test', label: 'Test' }] }]}
            onRefresh={() => toast({ title: '已刷新' })}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>项目名称</TableHead>
              <TableHead>环境</TableHead>
              <TableHead>服务数</TableHead>
              <TableHead>本月费用</TableHead>
              <TableHead>今日 Tokens</TableHead>
              <TableHead>错误率</TableHead>
              <TableHead>成员</TableHead>
              <TableHead className="w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link to="/services" className="font-medium text-foreground hover:text-primary transition-colors">
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell><StatusBadge label={p.env} color={getEnvColor(p.env)} /></TableCell>
                <TableCell>{p.services}</TableCell>
                <TableCell>{p.monthCost}</TableCell>
                <TableCell>{p.todayTokens}</TableCell>
                <TableCell>{p.errorRate}</TableCell>
                <TableCell>{p.members}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        {canManage && (
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(p.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除项目
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      {/* Create Project Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>创建一个新的项目来组织您的模型和服务</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>项目名称 <span className="text-destructive">*</span></Label>
              <Input placeholder="my-project" />
            </div>
            <div className="space-y-2">
              <Label>环境 <span className="text-destructive">*</span></Label>
              <Select defaultValue="Dev">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dev">Dev - 开发环境</SelectItem>
                  <SelectItem value="Test">Test - 测试环境</SelectItem>
                  <SelectItem value="Prod">Prod - 生产环境</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Prod 环境将自动启用更严格的安全策略（禁止记录 prompt、强制告警等）</p>
            </div>
            <div className="space-y-2">
              <Label>GPU 配额（可选）</Label>
              <Input type="number" placeholder="8" />
              <p className="text-xs text-muted-foreground">项目最大可用 GPU 数量，留空使用租户默认值</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => { setCreateOpen(false); toast({ title: '项目创建成功' }); }}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirm */}
      <Dialog open={!!deleteOpen} onOpenChange={() => { setDeleteOpen(null); setDeleteConfirm(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">删除项目</DialogTitle>
            <DialogDescription>
              此操作将永久删除项目 <strong>{deleteProject?.name}</strong> 及其所有资源。此操作不可逆。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>请输入项目名称 <strong>{deleteProject?.name}</strong> 以确认删除</Label>
              <Input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={deleteProject?.name} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(null); setDeleteConfirm(''); }}>取消</Button>
            <Button variant="destructive" disabled={deleteConfirm !== deleteProject?.name} onClick={() => { setDeleteOpen(null); setDeleteConfirm(''); toast({ title: '项目已删除' }); }}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
