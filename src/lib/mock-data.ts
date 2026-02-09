// ============ MOCK DATA FOR INFERA PLATFORM ============

export type Role = 'tenant_admin' | 'tenant_finance' | 'tenant_member' | 'project_owner' | 'project_developer' | 'project_viewer';

export const CURRENT_TENANT = {
  id: 'tenant-001',
  name: 'Infera',
  env: 'DEV' as const,
};

export const PROJECTS = [
  { id: 'proj-001', name: 'NLP-Core', env: 'Prod', services: 5, monthCost: '¥12,480', todayTokens: '2.4M', errorRate: '0.12%', members: 8, updatedAt: '2026-02-09' },
  { id: 'proj-002', name: 'Vision-Lab', env: 'Dev', services: 3, monthCost: '¥4,320', todayTokens: '890K', errorRate: '0.05%', members: 4, updatedAt: '2026-02-08' },
  { id: 'proj-003', name: 'ChatBot-Prod', env: 'Prod', services: 8, monthCost: '¥28,650', todayTokens: '5.1M', errorRate: '0.23%', members: 12, updatedAt: '2026-02-09' },
  { id: 'proj-004', name: 'Search-Engine', env: 'Test', services: 2, monthCost: '¥1,890', todayTokens: '340K', errorRate: '0.01%', members: 3, updatedAt: '2026-02-07' },
  { id: 'proj-005', name: 'DataAnalytics', env: 'Dev', services: 1, monthCost: '¥560', todayTokens: '120K', errorRate: '0%', members: 2, updatedAt: '2026-02-06' },
  { id: 'proj-006', name: 'Translation-SVC', env: 'Prod', services: 4, monthCost: '¥8,920', todayTokens: '1.8M', errorRate: '0.08%', members: 6, updatedAt: '2026-02-09' },
  { id: 'proj-007', name: 'ContentGen', env: 'Test', services: 2, monthCost: '¥2,100', todayTokens: '450K', errorRate: '0.15%', members: 5, updatedAt: '2026-02-08' },
  { id: 'proj-008', name: 'RecommendSys', env: 'Prod', services: 6, monthCost: '¥15,300', todayTokens: '3.2M', errorRate: '0.19%', members: 9, updatedAt: '2026-02-09' },
];

export const MODELS = [
  { id: 'model-001', name: 'Qwen2.5-72B', type: 'system' as const, owner: 'System', visibility: 'public', license: 'Apache-2.0', ctx: '128K', params: '72B', quantization: 'FP16', versions: 3, tags: ['prod', 'latest'], format: 'safetensors' },
  { id: 'model-002', name: 'Llama-3.1-70B', type: 'system' as const, owner: 'System', visibility: 'public', license: 'Llama-3.1', ctx: '128K', params: '70B', quantization: 'FP16', versions: 5, tags: ['prod', 'latest', 'staging'], format: 'safetensors' },
  { id: 'model-003', name: 'DeepSeek-V3', type: 'system' as const, owner: 'System', visibility: 'public', license: 'MIT', ctx: '64K', params: '671B', quantization: 'FP8', versions: 2, tags: ['latest'], format: 'safetensors' },
  { id: 'model-004', name: 'NLP-Core-FT-v2', type: 'private' as const, owner: 'proj-001', visibility: 'project', license: '-', ctx: '32K', params: '7B', quantization: 'INT8', versions: 8, tags: ['prod', 'latest', 'staging'], format: 'safetensors' },
  { id: 'model-005', name: 'ChatBot-Custom', type: 'private' as const, owner: 'proj-003', visibility: 'project', license: '-', ctx: '16K', params: '14B', quantization: 'FP16', versions: 4, tags: ['prod', 'latest'], format: 'gguf' },
  { id: 'model-006', name: 'Shared-Embedding-v1', type: 'shared' as const, owner: 'tenant-001', visibility: 'tenant', license: 'Internal', ctx: '8K', params: '1.5B', quantization: 'FP32', versions: 2, tags: ['latest'], format: 'safetensors' },
  { id: 'model-007', name: 'Mistral-7B', type: 'system' as const, owner: 'System', visibility: 'public', license: 'Apache-2.0', ctx: '32K', params: '7B', quantization: 'FP16', versions: 6, tags: ['prod', 'latest'], format: 'safetensors' },
  { id: 'model-008', name: 'Vision-FT-v3', type: 'private' as const, owner: 'proj-002', visibility: 'project', license: '-', ctx: '4K', params: '3B', quantization: 'INT4', versions: 3, tags: ['staging', 'latest'], format: 'bin' },
];

export type ServiceState = 'Pending' | 'Downloading' | 'Starting' | 'Ready' | 'Inactive' | 'Failed';

export const SERVICES = [
  { id: 'svc-001', name: 'nlp-inference', project: 'NLP-Core', env: 'Prod', currentState: 'Ready' as ServiceState, desiredState: 'Ready', runtime: 'vLLM', revision: 'rev-003', qps: 245, errorRate: '0.12%', latencyP95: '180ms', model: 'NLP-Core-FT-v2', gpu: 'A100-80G x2', updatedAt: '2026-02-09 10:30' },
  { id: 'svc-002', name: 'chat-service', project: 'ChatBot-Prod', env: 'Prod', currentState: 'Ready' as ServiceState, desiredState: 'Ready', runtime: 'TGI', revision: 'rev-007', qps: 1200, errorRate: '0.23%', latencyP95: '95ms', model: 'ChatBot-Custom', gpu: 'A100-80G x4', updatedAt: '2026-02-09 11:15' },
  { id: 'svc-003', name: 'vision-api', project: 'Vision-Lab', env: 'Dev', currentState: 'Starting' as ServiceState, desiredState: 'Ready', runtime: 'vLLM', revision: 'rev-001', qps: 0, errorRate: '0%', latencyP95: '-', model: 'Vision-FT-v3', gpu: 'L40S x1', updatedAt: '2026-02-09 12:00' },
  { id: 'svc-004', name: 'search-embed', project: 'Search-Engine', env: 'Test', currentState: 'Inactive' as ServiceState, desiredState: 'Inactive', runtime: 'Triton', revision: 'rev-002', qps: 0, errorRate: '0%', latencyP95: '-', model: 'Shared-Embedding-v1', gpu: 'T4 x1', updatedAt: '2026-02-08 16:45' },
  { id: 'svc-005', name: 'translate-api', project: 'Translation-SVC', env: 'Prod', currentState: 'Ready' as ServiceState, desiredState: 'Ready', runtime: 'vLLM', revision: 'rev-005', qps: 580, errorRate: '0.08%', latencyP95: '120ms', model: 'Qwen2.5-72B', gpu: 'A100-80G x2', updatedAt: '2026-02-09 09:00' },
  { id: 'svc-006', name: 'content-gen', project: 'ContentGen', env: 'Test', currentState: 'Failed' as ServiceState, desiredState: 'Ready', runtime: 'TGI', revision: 'rev-001', qps: 0, errorRate: '100%', latencyP95: '-', model: 'Llama-3.1-70B', gpu: 'A100-40G x2', updatedAt: '2026-02-09 08:20' },
  { id: 'svc-007', name: 'recommend-svc', project: 'RecommendSys', env: 'Prod', currentState: 'Ready' as ServiceState, desiredState: 'Ready', runtime: 'vLLM', revision: 'rev-004', qps: 890, errorRate: '0.19%', latencyP95: '150ms', model: 'Mistral-7B', gpu: 'L40S x2', updatedAt: '2026-02-09 11:45' },
  { id: 'svc-008', name: 'data-analytics', project: 'DataAnalytics', env: 'Dev', currentState: 'Pending' as ServiceState, desiredState: 'Ready', runtime: 'vLLM', revision: 'rev-001', qps: 0, errorRate: '0%', latencyP95: '-', model: 'DeepSeek-V3', gpu: 'H100 x8', updatedAt: '2026-02-09 12:30' },
];

export const API_KEYS = [
  { id: 'key-001', name: 'prod-inference', scopes: ['inference:invoke'], rpm: 1000, dailyTokens: '10M', expiresAt: '2026-06-30', status: 'active' as const, createdAt: '2026-01-15', project: 'NLP-Core' },
  { id: 'key-002', name: 'chat-frontend', scopes: ['inference:invoke'], rpm: 5000, dailyTokens: '50M', expiresAt: '2026-12-31', status: 'active' as const, createdAt: '2026-01-20', project: 'ChatBot-Prod' },
  { id: 'key-003', name: 'dev-testing', scopes: ['inference:invoke', 'model:read'], rpm: 100, dailyTokens: '1M', expiresAt: '2026-03-31', status: 'active' as const, createdAt: '2026-02-01', project: 'Vision-Lab' },
  { id: 'key-004', name: 'legacy-key', scopes: ['inference:invoke'], rpm: 500, dailyTokens: '5M', expiresAt: '2025-12-31', status: 'revoked' as const, createdAt: '2025-06-01', project: 'NLP-Core' },
  { id: 'key-005', name: 'search-api', scopes: ['inference:invoke', 'model:read', 'service:read'], rpm: 2000, dailyTokens: '20M', expiresAt: '2026-09-30', status: 'active' as const, createdAt: '2026-01-25', project: 'Search-Engine' },
  { id: 'key-006', name: 'translate-prod', scopes: ['inference:invoke'], rpm: 3000, dailyTokens: '30M', expiresAt: '2026-08-15', status: 'active' as const, createdAt: '2026-02-05', project: 'Translation-SVC' },
];

export const DATASETS = [
  { id: 'ds-001', name: 'customer-support-qa', versions: 5, latestVersion: 'dsv-005', rows: 125000, tokens: '48M', updatedAt: '2026-02-08', project: 'ChatBot-Prod' },
  { id: 'ds-002', name: 'product-reviews-zh', versions: 3, latestVersion: 'dsv-003', rows: 89000, tokens: '32M', updatedAt: '2026-02-06', project: 'NLP-Core' },
  { id: 'ds-003', name: 'translation-pairs-en-zh', versions: 7, latestVersion: 'dsv-007', rows: 250000, tokens: '95M', updatedAt: '2026-02-09', project: 'Translation-SVC' },
  { id: 'ds-004', name: 'code-instructions', versions: 2, latestVersion: 'dsv-002', rows: 45000, tokens: '18M', updatedAt: '2026-02-04', project: 'ContentGen' },
  { id: 'ds-005', name: 'image-captions-v2', versions: 4, latestVersion: 'dsv-004', rows: 67000, tokens: '22M', updatedAt: '2026-02-07', project: 'Vision-Lab' },
];

export type FineTuneStatus = 'Queued' | 'Running' | 'Succeeded' | 'Failed' | 'Canceled';

export const FINETUNE_JOBS = [
  { id: 'ft-001', name: 'chatbot-sft-v2', baseModel: 'Qwen2.5-72B', dataset: 'customer-support-qa', status: 'Succeeded' as FineTuneStatus, progress: 100, createdAt: '2026-02-05 14:30', duration: '4h 32m', cost: '¥1,280', outputModel: 'ChatBot-Custom:v4' },
  { id: 'ft-002', name: 'nlp-lora-exp1', baseModel: 'Llama-3.1-70B', dataset: 'product-reviews-zh', status: 'Running' as FineTuneStatus, progress: 67, createdAt: '2026-02-09 08:00', duration: '-', cost: '¥890 (预估)', outputModel: '-' },
  { id: 'ft-003', name: 'translate-ft-v7', baseModel: 'Qwen2.5-72B', dataset: 'translation-pairs-en-zh', status: 'Failed' as FineTuneStatus, progress: 34, createdAt: '2026-02-08 20:00', duration: '1h 15m', cost: '¥320', outputModel: '-', failReason: 'OOM: GPU 显存不足，建议使用 A100-80G 或降低 batch_size' },
  { id: 'ft-004', name: 'vision-sft-v3', baseModel: 'Mistral-7B', dataset: 'image-captions-v2', status: 'Queued' as FineTuneStatus, progress: 0, createdAt: '2026-02-09 12:00', duration: '-', cost: '¥650 (预估)', outputModel: '-' },
  { id: 'ft-005', name: 'code-instruct-ft', baseModel: 'DeepSeek-V3', dataset: 'code-instructions', status: 'Canceled' as FineTuneStatus, progress: 12, createdAt: '2026-02-07 16:00', duration: '28m', cost: '¥85', outputModel: '-' },
];

export const AUDIT_LOGS = [
  { id: 'audit-001', action: 'service.deploy', resourceType: 'InferenceService', resourceId: 'svc-001', actor: '张明远', actorType: 'user', ip: '10.0.1.42', timestamp: '2026-02-09 12:30:15', project: 'NLP-Core', details: '部署推理服务 nlp-inference rev-003' },
  { id: 'audit-002', action: 'model.tag.promote', resourceType: 'ModelTag', resourceId: 'model-004', actor: '李思琪', actorType: 'user', ip: '10.0.1.56', timestamp: '2026-02-09 11:45:02', project: 'NLP-Core', details: '将 tag prod 指向 version mv-008' },
  { id: 'audit-003', action: 'apikey.create', resourceType: 'APIKey', resourceId: 'key-006', actor: '王建华', actorType: 'user', ip: '10.0.2.18', timestamp: '2026-02-09 10:20:33', project: 'Translation-SVC', details: '创建 API Key translate-prod' },
  { id: 'audit-004', action: 'finetune.create', resourceType: 'FineTuneJob', resourceId: 'ft-002', actor: '陈晓东', actorType: 'user', ip: '10.0.1.78', timestamp: '2026-02-09 08:00:01', project: 'NLP-Core', details: '创建微调任务 nlp-lora-exp1' },
  { id: 'audit-005', action: 'service.traffic.update', resourceType: 'InferenceService', resourceId: 'svc-002', actor: 'ci-bot', actorType: 'service_account', ip: '10.0.3.5', timestamp: '2026-02-08 23:15:44', project: 'ChatBot-Prod', details: '灰度切流 rev-006:90% → rev-007:10%' },
  { id: 'audit-006', action: 'member.invite', resourceType: 'ProjectMember', resourceId: 'proj-003', actor: '张明远', actorType: 'user', ip: '10.0.1.42', timestamp: '2026-02-08 17:30:22', project: 'ChatBot-Prod', details: '邀请 刘芳 为 Developer' },
  { id: 'audit-007', action: 'apikey.revoke', resourceType: 'APIKey', resourceId: 'key-004', actor: '李思琪', actorType: 'user', ip: '10.0.1.56', timestamp: '2026-02-08 14:12:08', project: 'NLP-Core', details: '吊销 API Key legacy-key' },
  { id: 'audit-008', action: 'model.upload', resourceType: 'ModelVersion', resourceId: 'model-008', actor: '赵宇航', actorType: 'user', ip: '10.0.2.33', timestamp: '2026-02-08 10:05:17', project: 'Vision-Lab', details: '上传模型版本 Vision-FT-v3:v3' },
  { id: 'audit-009', action: 'dataset.upload', resourceType: 'DatasetVersion', resourceId: 'ds-003', actor: 'data-pipeline', actorType: 'service_account', ip: '10.0.3.12', timestamp: '2026-02-07 22:00:00', project: 'Translation-SVC', details: '上传数据集版本 dsv-007' },
  { id: 'audit-010', action: 'quota.update', resourceType: 'ProjectQuota', resourceId: 'proj-001', actor: '王建华', actorType: 'user', ip: '10.0.2.18', timestamp: '2026-02-07 15:40:55', project: 'NLP-Core', details: '更新项目配额：GPU 上限 8 → 12' },
];

export const ALERTS = [
  { id: 'alert-001', type: 'error_rate', severity: 'critical', title: '错误率异常升高', service: 'content-gen', value: '100%', threshold: '5%', triggeredAt: '2026-02-09 08:22', status: 'firing' },
  { id: 'alert-002', type: 'latency', severity: 'warning', title: 'P95 延迟超过阈值', service: 'nlp-inference', value: '180ms', threshold: '150ms', triggeredAt: '2026-02-09 10:15', status: 'firing' },
  { id: 'alert-003', type: 'budget', severity: 'warning', title: '月度预算达到 80%', project: 'ChatBot-Prod', value: '¥22,920', threshold: '¥28,650 (80%)', triggeredAt: '2026-02-08 09:00', status: 'resolved' },
  { id: 'alert-004', type: 'pending_timeout', severity: 'critical', title: '服务 Pending 超时', service: 'data-analytics', value: '30min', threshold: '15min', triggeredAt: '2026-02-09 13:00', status: 'firing' },
  { id: 'alert-005', type: 'cold_start', severity: 'info', title: '冷启动次数增加', service: 'search-embed', value: '12次/小时', threshold: '5次/小时', triggeredAt: '2026-02-08 14:30', status: 'resolved' },
];

export const TENANT_MEMBERS = [
  { id: 'u-001', name: '张明远', email: 'zhangmy@infera.dev', role: 'Tenant Admin', department: '技术部', phone: '13800001001', status: 'active' },
  { id: 'u-002', name: '李思琪', email: 'lisq@infera.dev', role: 'Tenant Admin', department: '技术部', phone: '13800001002', status: 'active' },
  { id: 'u-003', name: '王建华', email: 'wangjh@infera.dev', role: 'Finance', department: '财务部', phone: '13800001003', status: 'active' },
  { id: 'u-004', name: '陈晓东', email: 'chenxd@infera.dev', role: 'Member', department: '算法部', phone: '13800001004', status: 'active' },
  { id: 'u-005', name: '刘芳', email: 'liuf@infera.dev', role: 'Member', department: '产品部', phone: '13800001005', status: 'active' },
  { id: 'u-006', name: '赵宇航', email: 'zhaoyh@infera.dev', role: 'Member', department: '算法部', phone: '13800001006', status: 'active' },
  { id: 'u-007', name: '黄丽娟', email: 'huanglj@company.com', role: 'Member', department: '运维部', phone: '13800001007', status: 'disabled' },
  { id: 'u-008', name: 'ci-bot', email: 'ci-bot@infera.dev', role: 'Member', department: '-', phone: '-', status: 'active', isServiceAccount: true },
];

export const USAGE_DATA = {
  daily: [
    { date: '02-03', tokens: 4200000, cost: 1680, gpuHours: 24 },
    { date: '02-04', tokens: 3800000, cost: 1520, gpuHours: 22 },
    { date: '02-05', tokens: 5100000, cost: 2040, gpuHours: 28 },
    { date: '02-06', tokens: 4500000, cost: 1800, gpuHours: 25 },
    { date: '02-07', tokens: 3200000, cost: 1280, gpuHours: 18 },
    { date: '02-08', tokens: 5800000, cost: 2320, gpuHours: 32 },
    { date: '02-09', tokens: 6100000, cost: 2440, gpuHours: 35 },
  ],
};
