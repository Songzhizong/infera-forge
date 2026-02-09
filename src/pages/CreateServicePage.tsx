import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, Clock } from 'lucide-react';

const STEPS = ['基础信息', '模型选择', '资源配置', '弹性与策略'];

export default function CreateServicePage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scaleToZero, setScaleToZero] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <PageHeader
        title="创建推理服务"
        breadcrumbs={[{ label: '推理服务', path: '/services' }, { label: '创建服务' }]}
      />

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                i < step ? 'bg-primary border-primary text-primary-foreground' :
                i === step ? 'border-primary text-primary' :
                'border-border text-muted-foreground'
              )}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </button>
            <span className={cn('text-sm', i === step ? 'font-medium text-foreground' : 'text-muted-foreground')}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className={cn('w-12 h-0.5', i < step ? 'bg-primary' : 'bg-border')} />}
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>服务名称 <span className="text-destructive">*</span></Label>
              <Input placeholder="my-inference-service" defaultValue="nlp-new-service" />
            </div>
            <div className="space-y-2">
              <Label>环境 <span className="text-destructive">*</span></Label>
              <Select defaultValue="Dev">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dev">Dev</SelectItem>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="Prod">Prod</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Input placeholder="服务用途描述" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>选择模型 <span className="text-destructive">*</span></Label>
              <Select defaultValue="model-001">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="model-001">Qwen2.5-72B (System)</SelectItem>
                  <SelectItem value="model-002">Llama-3.1-70B (System)</SelectItem>
                  <SelectItem value="model-004">NLP-Core-FT-v2 (Private)</SelectItem>
                  <SelectItem value="model-005">ChatBot-Custom (Private)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>版本选择方式</Label>
              <Select defaultValue="tag">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tag">使用 Tag（推荐）</SelectItem>
                  <SelectItem value="version">指定 Version ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tag</Label>
              <Select defaultValue="prod">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prod">prod</SelectItem>
                  <SelectItem value="latest">latest</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p>Tag <strong>prod</strong> 当前解析为 <strong className="font-mono">model_version_id = mv-002</strong></p>
              <p className="text-xs text-muted-foreground mt-1">此 version_id 将用于部署和审计记录</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Runtime <span className="text-destructive">*</span></Label>
              <Select defaultValue="vllm">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vllm">vLLM</SelectItem>
                  <SelectItem value="tgi">TGI (Text Generation Inference)</SelectItem>
                  <SelectItem value="triton">Triton Inference Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GPU 型号 <span className="text-destructive">*</span></Label>
                <Select defaultValue="a100-80">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a100-80">NVIDIA A100 80GB</SelectItem>
                    <SelectItem value="a100-40">NVIDIA A100 40GB</SelectItem>
                    <SelectItem value="l40s">NVIDIA L40S</SelectItem>
                    <SelectItem value="h100">NVIDIA H100</SelectItem>
                    <SelectItem value="t4">NVIDIA T4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>GPU 数量</Label>
                <Input type="number" defaultValue="2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CPU (核)</Label>
                <Input type="number" defaultValue="16" />
              </div>
              <div className="space-y-2">
                <Label>内存 (GB)</Label>
                <Input type="number" defaultValue="64" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>网络暴露</Label>
              <Select defaultValue="private">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">仅私网</SelectItem>
                  <SelectItem value="public">公网（需配置 Allowlist）</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>最小副本数</Label>
                <Input type="number" defaultValue="1" />
              </div>
              <div className="space-y-2">
                <Label>最大副本数</Label>
                <Input type="number" defaultValue="4" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <div className="text-sm font-medium">Scale-to-Zero</div>
                <div className="text-xs text-muted-foreground">无流量时自动缩容至 0 副本</div>
              </div>
              <Switch checked={scaleToZero} onCheckedChange={setScaleToZero} />
            </div>
            {scaleToZero && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-info/30 bg-info/5">
                <Clock className="w-4 h-4 text-info shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">冷启动提示</p>
                  <p className="text-muted-foreground mt-0.5">启用 Scale-to-Zero 后，首次请求将触发冷启动（约 30s-2min），期间请求将排队等待。建议在 Prod 环境谨慎使用。</p>
                </div>
              </div>
            )}
            <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
              <p className="font-medium">成本预估</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>GPU (A100-80G x2):</span><span>¥28.5/小时</span>
                <span>预计月费（24/7）:</span><span>¥20,520</span>
                {scaleToZero && <><span>启用 Scale-to-Zero:</span><span className="text-success">预计节省 30-60%</span></>}
              </div>
            </div>
            {scaleToZero && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-warning/30 bg-warning/5">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  冷启动期间的请求将收到 HTTP 503 或增加延迟。客户端需处理 <strong>429 retry-after</strong> 和 <strong>503</strong> 状态码。
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step > 0 ? setStep(step - 1) : navigate('/services')}>
          {step === 0 ? '取消' : '上一步'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>下一步</Button>
        ) : (
          <Button onClick={() => { toast({ title: '服务创建成功，正在部署...' }); navigate('/services'); }}>
            创建服务
          </Button>
        )}
      </div>
    </div>
  );
}
