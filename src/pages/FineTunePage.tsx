import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusBadge, getFineTuneStatusColor } from '@/components/shared/StatusBadge';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { useRole } from '@/contexts/RoleContext';
import { FINETUNE_JOBS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function FineTunePage() {
  const { canEdit } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailJob, setDetailJob] = useState<typeof FINETUNE_JOBS[0] | null>(null);

  const filtered = FINETUNE_JOBS.filter(j =>
    j.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="微调任务"
        description="管理模型微调训练任务"
        actions={canEdit ? (
          <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            创建任务
          </Button>
        ) : undefined}
      />

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4">
          <FilterBar searchPlaceholder="搜索任务名称..." searchValue={search} onSearchChange={setSearch} onRefresh={() => toast({ title: '已刷新' })} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务名称</TableHead>
              <TableHead>Base 模型</TableHead>
              <TableHead>数据集</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>耗时</TableHead>
              <TableHead>成本</TableHead>
              <TableHead>产出模型</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(j => (
              <TableRow key={j.id} className="cursor-pointer" onClick={() => setDetailJob(j)}>
                <TableCell className="font-medium">{j.name}</TableCell>
                <TableCell>{j.baseModel}</TableCell>
                <TableCell>{j.dataset}</TableCell>
                <TableCell><StatusBadge label={j.status} color={getFineTuneStatusColor(j.status)} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={j.progress} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground">{j.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{j.duration}</TableCell>
                <TableCell>{j.cost}</TableCell>
                <TableCell>{j.outputModel !== '-' ? (
                  <button className="text-primary text-sm hover:underline" onClick={e => { e.stopPropagation(); navigate('/models'); }}>
                    {j.outputModel}
                  </button>
                ) : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationBar total={filtered.length} page={page} pageSize={20} onPageChange={setPage} />
      </div>

      {/* Create job */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>创建微调任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>任务名称 <span className="text-destructive">*</span></Label>
              <Input placeholder="my-finetune-job" />
            </div>
            <div className="space-y-2">
              <Label>Base 模型 <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择模型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="qwen">Qwen2.5-72B (tag: latest → mv-003)</SelectItem>
                  <SelectItem value="llama">Llama-3.1-70B (tag: latest → mv-005)</SelectItem>
                  <SelectItem value="mistral">Mistral-7B (tag: prod → mv-006)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">选择 Tag 后将解析为具体 model_version_id 用于训练</p>
            </div>
            <div className="space-y-2">
              <Label>数据集版本 <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择数据集" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ds1">customer-support-qa / dsv-005 (125K rows)</SelectItem>
                  <SelectItem value="ds2">product-reviews-zh / dsv-003 (89K rows)</SelectItem>
                  <SelectItem value="ds3">translation-pairs-en-zh / dsv-007 (250K rows)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Learning Rate</Label><Input defaultValue="2e-5" /></div>
              <div className="space-y-2"><Label>Batch Size</Label><Input type="number" defaultValue="8" /></div>
              <div className="space-y-2"><Label>Epochs</Label><Input type="number" defaultValue="3" /></div>
              <div className="space-y-2"><Label>GPU 类型</Label>
                <Select defaultValue="a100-80">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a100-80">A100-80G</SelectItem>
                    <SelectItem value="a100-40">A100-40G</SelectItem>
                    <SelectItem value="h100">H100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p className="font-medium">成本预估</p>
              <p className="text-muted-foreground mt-1">约 ¥1,280（基于 A100-80G x2, 4h 预计时长）</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => { setCreateOpen(false); toast({ title: '微调任务已创建' }); }}>创建任务</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job detail */}
      <Dialog open={!!detailJob} onOpenChange={() => setDetailJob(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>任务详情：{detailJob?.name}</DialogTitle>
          </DialogHeader>
          {detailJob && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">状态：</span><StatusBadge label={detailJob.status} color={getFineTuneStatusColor(detailJob.status)} /></div>
                <div><span className="text-muted-foreground">进度：</span>{detailJob.progress}%</div>
                <div><span className="text-muted-foreground">Base 模型：</span>{detailJob.baseModel}</div>
                <div><span className="text-muted-foreground">数据集：</span>{detailJob.dataset}</div>
                <div><span className="text-muted-foreground">耗时：</span>{detailJob.duration}</div>
                <div><span className="text-muted-foreground">成本：</span>{detailJob.cost}</div>
              </div>

              {detailJob.status === 'Failed' && detailJob.failReason && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-medium text-sm text-destructive">失败原因</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{detailJob.failReason}</p>
                </div>
              )}

              {detailJob.status === 'Succeeded' && (
                <div className="bg-success/5 border border-success/20 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">训练完成</p>
                    <p className="text-sm text-muted-foreground">产出模型版本：{detailJob.outputModel}</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto" onClick={() => { setDetailJob(null); navigate('/models'); }}>
                    查看模型
                  </Button>
                </div>
              )}

              {detailJob.status === 'Running' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">训练进度</div>
                  <Progress value={detailJob.progress} className="h-3" />
                  <p className="text-xs text-muted-foreground">Loss 曲线和详细日志可在任务日志中查看</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailJob(null)}>关闭</Button>
            {detailJob?.status === 'Succeeded' && canEdit && (
              <Button onClick={() => { setDetailJob(null); navigate('/models'); toast({ title: '已注册为模型版本' }); }}>注册为模型版本</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
