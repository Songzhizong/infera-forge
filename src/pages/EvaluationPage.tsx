import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';

const EVAL_RESULTS = [
  { model: 'NLP-Core-FT-v2:v3', benchmark: 'MMLU', score: 78.5, baseline: 75.2, pass: true },
  { model: 'NLP-Core-FT-v2:v3', benchmark: 'GSM8K', score: 65.1, baseline: 62.0, pass: true },
  { model: 'NLP-Core-FT-v2:v3', benchmark: 'HumanEval', score: 52.3, baseline: 55.0, pass: false },
  { model: 'ChatBot-Custom:v4', benchmark: 'MT-Bench', score: 8.2, baseline: 7.8, pass: true },
];

const REGRESSION_PROMPTS = [
  { id: 'rp-001', prompt: '请解释量子计算的基本原理', expectedKeywords: '量子比特,叠加,纠缠', threshold: 0.85 },
  { id: 'rp-002', prompt: '如何优化 Python 代码性能？', expectedKeywords: '算法,缓存,并发', threshold: 0.80 },
  { id: 'rp-003', prompt: '翻译以下内容为中文：The quick brown fox', expectedKeywords: '快速,棕色,狐狸', threshold: 0.90 },
];

export default function EvaluationPage() {
  const { canEdit } = useRole();
  const { toast } = useToast();
  const [playgroundOutputA, setPlaygroundOutputA] = useState('');
  const [playgroundOutputB, setPlaygroundOutputB] = useState('');

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader title="评估" description="模型自动评估、对比评估与回归门禁" />

      <Tabs defaultValue="auto">
        <TabsList>
          <TabsTrigger value="auto">自动评估</TabsTrigger>
          <TabsTrigger value="compare">对比评估</TabsTrigger>
          <TabsTrigger value="regression">回归集/门禁</TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="space-y-4 mt-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-section-title">运行自动评估</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>模型版本</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择模型版本" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v3">NLP-Core-FT-v2:v3 (mv-003)</SelectItem>
                    <SelectItem value="v4">ChatBot-Custom:v4 (mv-004)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Benchmark</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择评测集" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mmlu">MMLU</SelectItem>
                    <SelectItem value="gsm8k">GSM8K</SelectItem>
                    <SelectItem value="humaneval">HumanEval</SelectItem>
                    <SelectItem value="mtbench">MT-Bench</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {canEdit && <Button onClick={() => toast({ title: '评估任务已启动' })}>运行评估</Button>}
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-section-title">评估结果</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模型版本</TableHead>
                  <TableHead>Benchmark</TableHead>
                  <TableHead>得分</TableHead>
                  <TableHead>基线</TableHead>
                  <TableHead>结果</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EVAL_RESULTS.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.model}</TableCell>
                    <TableCell>{r.benchmark}</TableCell>
                    <TableCell className="font-mono">{r.score}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{r.baseline}</TableCell>
                    <TableCell>
                      <StatusBadge label={r.pass ? '通过' : '未通过'} color={r.pass ? 'green' : 'red'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4 mt-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-section-title">Side-by-Side Playground</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>模型 A</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v2">NLP-Core-FT-v2:v2</SelectItem>
                    <SelectItem value="v3">NLP-Core-FT-v2:v3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>模型 B</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v2">NLP-Core-FT-v2:v2</SelectItem>
                    <SelectItem value="v3">NLP-Core-FT-v2:v3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <textarea className="w-full min-h-[80px] rounded-lg border border-input bg-background p-3 text-sm resize-y" placeholder="输入测试 prompt..." />
            </div>
            <Button onClick={() => { setPlaygroundOutputA('模型 A 的回答：这是一个关于量子计算的详细解释...'); setPlaygroundOutputB('模型 B 的回答：量子计算是利用量子力学原理...'); }}>
              对比运行
            </Button>
            {playgroundOutputA && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-2">模型 A 输出</div>
                  <p className="text-sm">{playgroundOutputA}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">👍 更好</Button>
                    <Button variant="outline" size="sm">👎 更差</Button>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-2">模型 B 输出</div>
                  <p className="text-sm">{playgroundOutputB}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">👍 更好</Button>
                    <Button variant="outline" size="sm">👎 更差</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="regression" className="space-y-4 mt-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-section-title">回归集 Prompts</h3>
              {canEdit && <Button size="sm">添加 Prompt</Button>}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prompt</TableHead>
                  <TableHead>预期关键词</TableHead>
                  <TableHead>阈值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REGRESSION_PROMPTS.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[300px] truncate">{p.prompt}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.expectedKeywords}</TableCell>
                    <TableCell className="font-mono">{p.threshold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
            回归集将在 Tag Promote 时自动执行。如果回归不通过（低于阈值），将阻止 promote 操作。
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
