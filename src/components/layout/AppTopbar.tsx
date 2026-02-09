import { Search, HelpCircle, Bell, ChevronDown } from 'lucide-react';
import { useRole, ROLE_LABELS } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import type { Role } from '@/lib/mock-data';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const ALL_ROLES: Role[] = ['tenant_admin', 'tenant_finance', 'tenant_member', 'project_owner', 'project_developer', 'project_viewer'];

const SEARCH_ITEMS = [
  { label: 'NLP-Core 项目', path: '/projects', type: '项目' },
  { label: 'ChatBot-Prod 项目', path: '/projects', type: '项目' },
  { label: 'Qwen2.5-72B 模型', path: '/models', type: '模型' },
  { label: 'nlp-inference 服务', path: '/services', type: '服务' },
  { label: 'chat-service 服务', path: '/services', type: '服务' },
  { label: '微调任务 nlp-lora-exp1', path: '/finetune', type: '任务' },
  { label: 'prod-inference Key', path: '/api-keys', type: 'Key' },
];

export function AppTopbar() {
  const { role, setRole } = useRole();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredResults = SEARCH_ITEMS.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-input bg-background text-muted-foreground text-sm hover:border-primary/30 transition-colors min-w-[240px]"
        >
          <Search className="w-4 h-4" />
          <span>搜索</span>
          <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>

        <div className="flex-1" />

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
              {ROLE_LABELS[role]}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs text-muted-foreground">切换角色视角</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_ROLES.map(r => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)} className={r === role ? 'bg-accent' : ''}>
                {ROLE_LABELS[r]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
        </Button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
          张
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[520px] p-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索项目、模型、服务、任务、Key..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 px-0"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto p-2">
            {filteredResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">无匹配结果</div>
            ) : (
              filteredResults.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { navigate(item.path); setSearchOpen(false); setSearchQuery(''); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-left text-sm"
                >
                  <span className="text-xs px-1.5 py-0.5 rounded bg-badge-blue-bg text-badge-blue-text font-medium">{item.type}</span>
                  <span>{item.label}</span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
