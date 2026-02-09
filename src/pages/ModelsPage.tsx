import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge, getModelTypeColor } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { useRole } from '@/contexts/RoleContext';
import { MODELS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Upload, ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function ModelsPage() {
  const { canEdit, canViewModels } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  if (!canViewModels) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-medium text-foreground">无权限访问</h2>
          <p className="text-sm text-muted-foreground mt-1">当前角色无法查看模型库，请联系管理员</p>
        </div>
      </div>
    );
  }

  const filtered = MODELS.filter(m => {
    if (tab === 'system' && m.type !== 'system') return false;
    if (tab === 'private' && m.type !== 'private') return false;
    if (tab === 'shared' && m.type !== 'shared') return false;
    return m.name.toLowerCase().includes(search.toLowerCase());
  });

  const typeLabels = { system: '公共模型', private: '私有模型', shared: '租户共享' };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="模型库"
        description="管理系统模型、私有模型和共享模型"
        actions={canEdit ? (
          <Button className="gap-1.5" onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4" />
            上传模型
          </Button>
        ) : undefined}
      />

      <div className="bg-card rounded-xl border border-border">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="border-b border-border px-4 pt-3">
            <TabsList className="bg-transparent h-9 p-0 gap-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">
                全部 ({MODELS.length})
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">
                公共模型
              </TabsTrigger>
              <TabsTrigger value="private" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">
                私有模型
              </TabsTrigger>
              <TabsTrigger value="shared" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">
                租户共享
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <FilterBar searchPlaceholder="搜索模型名称..." searchValue={search} onSearchChange={setSearch} onRefresh={() => toast({ title: '已刷新' })} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模型名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>参数量</TableHead>
                <TableHead>上下文</TableHead>
                <TableHead>量化</TableHead>
                <TableHead>版本数</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>License</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/models/${m.id}`)}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell><StatusBadge label={typeLabels[m.type]} color={getModelTypeColor(m.type)} /></TableCell>
                  <TableCell>{m.params}</TableCell>
                  <TableCell>{m.ctx}</TableCell>
                  <TableCell>{m.quantization}</TableCell>
                  <TableCell>{m.versions}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {m.tags.map(t => (
                        <StatusBadge key={t} label={t} color={t === 'prod' ? 'green' : t === 'staging' ? 'orange' : 'blue'} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{m.license}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
        </Tabs>
      </div>

      {/* Upload model dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>上传模型</DialogTitle>
            <DialogDescription>上传新的模型版本到模型库</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Tabs defaultValue="web">
              <TabsList className="w-full">
                <TabsTrigger value="web" className="flex-1">Web 上传</TabsTrigger>
                <TabsTrigger value="cli" className="flex-1">CLI 上传</TabsTrigger>
              </TabsList>
              <TabsContent value="web" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>模型名称 <span className="text-destructive">*</span></Label>
                  <Input placeholder="my-model-v2" />
                </div>
                <div className="space-y-2">
                  <Label>模型格式 <span className="text-destructive">*</span></Label>
                  <div className="text-xs text-muted-foreground mb-1">支持: safetensors, gguf, bin</div>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">拖拽文件至此或点击上传</p>
                    <p className="text-xs text-muted-foreground mt-1">上传完成后将自动计算 SHA256</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="cli" className="mt-4">
                <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                  <p className="text-muted-foreground mb-2"># 安装 CLI</p>
                  <p>pip install infera-cli</p>
                  <p className="text-muted-foreground mt-3 mb-2"># 上传模型</p>
                  <p>infera model upload \</p>
                  <p className="pl-4">--name my-model \</p>
                  <p className="pl-4">--path ./model-files/ \</p>
                  <p className="pl-4">--format safetensors</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>取消</Button>
            <Button onClick={() => { setUploadOpen(false); toast({ title: '模型上传已开始' }); }}>上传</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
