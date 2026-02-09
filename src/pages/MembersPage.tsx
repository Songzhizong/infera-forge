import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { TENANT_MEMBERS } from '@/lib/mock-data';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MembersPage() {
  const { canManage } = useRole();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = TENANT_MEMBERS.filter(m =>
    m.name.includes(search) || m.email.includes(search)
  );

  const getRoleColor = (role: string) => {
    if (role === 'Tenant Admin') return 'blue';
    if (role === 'Finance') return 'orange';
    return 'gray';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="成员管理"
        description="管理租户和项目成员"
        actions={canManage ? (
          <Button className="gap-1.5" onClick={() => setInviteOpen(true)}>
            <Plus className="w-4 h-4" />
            邀请成员
          </Button>
        ) : undefined}
      />

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar
            searchPlaceholder="搜索姓名、邮箱..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[{ key: 'role', label: '角色', options: [
              { value: 'Tenant Admin', label: '超级管理员' },
              { value: 'Finance', label: '财务' },
              { value: 'Member', label: '普通员工' },
            ]}]}
            onRefresh={() => toast({ title: '已刷新' })}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(m => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {m.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge label={m.role === 'Tenant Admin' ? '超级管理员' : m.role === 'Finance' ? '财务' : '普通员工'} color={getRoleColor(m.role)} />
                </TableCell>
                <TableCell>{m.department}</TableCell>
                <TableCell className="font-mono text-sm">{m.phone}</TableCell>
                <TableCell>
                  <StatusBadge label={m.status === 'active' ? '活跃' : '已禁用'} color={m.status === 'active' ? 'green' : 'gray'} />
                </TableCell>
                <TableCell>
                  {canManage && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>重置密码</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">禁用账户</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀请成员</DialogTitle>
            <DialogDescription>通过邮箱邀请新成员加入租户</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>邮箱 <span className="text-destructive">*</span></Label>
              <Input placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label>角色 <span className="text-destructive">*</span></Label>
              <Select defaultValue="Member">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tenant Admin">超级管理员</SelectItem>
                  <SelectItem value="Finance">财务</SelectItem>
                  <SelectItem value="Member">普通成员</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>取消</Button>
            <Button onClick={() => { setInviteOpen(false); toast({ title: '邀请已发送' }); }}>发送邀请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
