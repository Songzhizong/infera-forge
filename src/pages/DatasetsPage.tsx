import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { DATASETS } from '@/lib/mock-data';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function DatasetsPage() {
  const { canEdit } = useRole();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailDs, setDetailDs] = useState<typeof DATASETS[0] | null>(null);

  const filtered = DATASETS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="数据集"
        description="管理训练数据集及其版本"
        actions={canEdit ? (
          <Button className="gap-1.5" onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4" />
            上传数据集
          </Button>
        ) : undefined}
      />

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar searchPlaceholder="搜索数据集..." searchValue={search} onSearchChange={setSearch} onRefresh={() => toast({ title: '已刷新' })} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>数据集名称</TableHead>
              <TableHead>版本数</TableHead>
              <TableHead>最新版本</TableHead>
              <TableHead>行数</TableHead>
              <TableHead>Token 统计</TableHead>
              <TableHead>项目</TableHead>
              <TableHead>更新时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(d => (
              <TableRow key={d.id} className="cursor-pointer" onClick={() => setDetailDs(d)}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{d.versions}</TableCell>
                <TableCell className="font-mono text-xs">{d.latestVersion}</TableCell>
                <TableCell>{d.rows.toLocaleString()}</TableCell>
                <TableCell>{d.tokens}</TableCell>
                <TableCell className="text-muted-foreground">{d.project}</TableCell>
                <TableCell className="text-muted-foreground">{d.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      {/* Dataset detail */}
      <Dialog open={!!detailDs} onOpenChange={() => setDetailDs(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>数据集：{detailDs?.name}</DialogTitle>
          </DialogHeader>
          {detailDs && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">版本数：</span>{detailDs.versions}</div>
                <div><span className="text-muted-foreground">总行数：</span>{detailDs.rows.toLocaleString()}</div>
                <div><span className="text-muted-foreground">Token 统计：</span>{detailDs.tokens}</div>
                <div><span className="text-muted-foreground">项目：</span>{detailDs.project}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">版本列表</h4>
                <div className="space-y-2">
                  {Array.from({ length: Math.min(detailDs.versions, 3) }, (_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-border text-sm">
                      <span className="font-mono text-xs">dsv-{String(detailDs.versions - i).padStart(3, '0')}</span>
                      <span className="text-muted-foreground">{(detailDs.rows - i * 5000).toLocaleString()} rows</span>
                      <span className="font-mono text-xs text-muted-foreground ml-auto">sha256: {Math.random().toString(36).slice(2, 10)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传数据集版本</DialogTitle>
            <DialogDescription>上传新版本将自动生成 dataset_version_id</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>数据集 <span className="text-destructive">*</span></Label>
              <Input placeholder="选择或创建数据集" />
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">拖拽文件至此或点击上传</p>
              <p className="text-xs text-muted-foreground mt-1">支持 JSONL、CSV、Parquet</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>取消</Button>
            <Button onClick={() => { setUploadOpen(false); toast({ title: '数据集版本已上传' }); }}>上传</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
