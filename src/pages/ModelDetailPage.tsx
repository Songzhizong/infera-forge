import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, getModelTypeColor } from '@/components/shared/StatusBadge';
import { MODELS } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';

const MOCK_VERSIONS = [
  { id: 'mv-001', version: 'v1', sha256: 'a1b2c3d4e5...', size: '140GB', createdAt: '2026-01-15', createdBy: '张明远' },
  { id: 'mv-002', version: 'v2', sha256: 'f6g7h8i9j0...', size: '142GB', createdAt: '2026-01-28', createdBy: '李思琪' },
  { id: 'mv-003', version: 'v3', sha256: 'k1l2m3n4o5...', size: '141GB', createdAt: '2026-02-05', createdBy: '陈晓东' },
];

const MOCK_TAGS = [
  { name: 'prod', targetVersion: 'mv-002', updatedAt: '2026-02-01', updatedBy: '李思琪' },
  { name: 'latest', targetVersion: 'mv-003', updatedAt: '2026-02-05', updatedBy: '陈晓东' },
  { name: 'staging', targetVersion: 'mv-003', updatedAt: '2026-02-05', updatedBy: '陈晓东' },
];

export default function ModelDetailPage() {
  const { id } = useParams();
  const model = MODELS.find(m => m.id === id) || MODELS[0];
  const { canEdit } = useRole();
  const { toast } = useToast();
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [promoteTag, setPromoteTag] = useState<typeof MOCK_TAGS[0] | null>(null);

  const typeLabels = { system: '公共模型', private: '私有模型', shared: '租户共享' };

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title={model.name}
        breadcrumbs={[{ label: '模型库', path: '/models' }, { label: model.name }]}
        actions={canEdit ? (
          <Link to="/audit">
            <Button variant="outline" size="sm">查看审计记录</Button>
          </Link>
        ) : undefined}
      />

      {/* Model info header */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            ['类型', <StatusBadge label={typeLabels[model.type]} color={getModelTypeColor(model.type)} />],
            ['参数量', model.params],
            ['上下文长度', model.ctx],
            ['量化', model.quantization],
            ['格式', model.format],
            ['License', model.license],
          ].map(([label, value], i) => (
            <div key={i}>
              <div className="text-xs text-muted-foreground">{label as string}</div>
              <div className="text-sm font-medium mt-1">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border">
        <Tabs defaultValue="versions">
          <div className="border-b border-border px-4 pt-3">
            <TabsList className="bg-transparent h-9 p-0 gap-4">
              <TabsTrigger value="versions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">版本（不可变）</TabsTrigger>
              <TabsTrigger value="tags" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">Tags（可变指针）</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2">使用中</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="versions" className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>版本 ID</TableHead>
                  <TableHead>版本号</TableHead>
                  <TableHead>SHA256</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>创建者</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_VERSIONS.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">{v.id}</TableCell>
                    <TableCell className="font-medium">{v.version}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{v.sha256}</TableCell>
                    <TableCell>{v.size}</TableCell>
                    <TableCell>{v.createdAt}</TableCell>
                    <TableCell>{v.createdBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="tags" className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag 名称</TableHead>
                  <TableHead>指向版本</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead>操作者</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TAGS.map(t => (
                  <TableRow key={t.name}>
                    <TableCell><StatusBadge label={t.name} color={t.name === 'prod' ? 'green' : t.name === 'staging' ? 'orange' : 'blue'} /></TableCell>
                    <TableCell className="font-mono text-xs">{t.targetVersion}</TableCell>
                    <TableCell>{t.updatedAt}</TableCell>
                    <TableCell>{t.updatedBy}</TableCell>
                    <TableCell>
                      {canEdit ? (
                        <Button variant="outline" size="sm" onClick={() => { setPromoteTag(t); setPromoteOpen(true); }}>
                          Promote / Rollback
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">无编辑权限</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="usage" className="p-4">
            <div className="text-sm text-muted-foreground">
              当前版本被以下 Revision 引用：
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <span className="font-medium text-sm">nlp-inference / rev-003</span>
                <StatusBadge label="Ready" color="green" />
                <Link to="/services" className="ml-auto text-primary text-sm hover:underline flex items-center gap-1">
                  查看服务 <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Promote dialog */}
      <Dialog open={promoteOpen} onOpenChange={setPromoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag Promote / Rollback</DialogTitle>
            <DialogDescription>
              将 tag <strong>{promoteTag?.name}</strong> 指向新的 model_version_id
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p>当前指向：<strong className="font-mono">{promoteTag?.targetVersion}</strong></p>
              <p className="mt-2">此操作将：</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                <li>将 tag <strong>{promoteTag?.name}</strong> 指向目标 model_version_id</li>
                <li>写入审计日志记录此变更</li>
                <li>如果有门禁配置，将先执行回归检查</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-warning/30 bg-warning/5">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <span className="text-sm">Prod tag 变更将影响生产环境推理服务</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoteOpen(false)}>取消</Button>
            <Button onClick={() => { setPromoteOpen(false); toast({ title: 'Tag 已更新，审计日志已记录' }); }}>确认 Promote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
