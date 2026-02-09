import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Shield } from 'lucide-react';

export default function PlatformPlaceholder({ title }: { title: string }) {
  return (
    <div className="animate-fade-in">
      <PageHeader title={title} description="平台管理功能" />
      <div className="bg-card rounded-xl border border-border">
        <EmptyState
          icon={<Shield className="w-12 h-12" />}
          title="平台管理入口"
          description="此功能仅对平台管理员可见，当前版本为占位页面"
        />
      </div>
    </div>
  );
}
