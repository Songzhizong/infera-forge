import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Role } from '@/lib/mock-data';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  canEdit: boolean;
  canManage: boolean;
  canViewFinance: boolean;
  canViewModels: boolean;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<Role, { canEdit: boolean; canManage: boolean; canViewFinance: boolean; canViewModels: boolean; isAdmin: boolean }> = {
  tenant_admin: { canEdit: true, canManage: true, canViewFinance: true, canViewModels: true, isAdmin: true },
  tenant_finance: { canEdit: false, canManage: false, canViewFinance: true, canViewModels: false, isAdmin: false },
  tenant_member: { canEdit: false, canManage: false, canViewFinance: false, canViewModels: true, isAdmin: false },
  project_owner: { canEdit: true, canManage: true, canViewFinance: true, canViewModels: true, isAdmin: false },
  project_developer: { canEdit: true, canManage: false, canViewFinance: false, canViewModels: true, isAdmin: false },
  project_viewer: { canEdit: false, canManage: false, canViewFinance: false, canViewModels: true, isAdmin: false },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('tenant_admin');
  const perms = ROLE_PERMISSIONS[role];

  return (
    <RoleContext.Provider value={{ role, setRole, ...perms }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
}

export const ROLE_LABELS: Record<Role, string> = {
  tenant_admin: '租户管理员',
  tenant_finance: '财务角色',
  tenant_member: '租户成员',
  project_owner: '项目 Owner',
  project_developer: '项目 Developer',
  project_viewer: '项目 Viewer',
};
