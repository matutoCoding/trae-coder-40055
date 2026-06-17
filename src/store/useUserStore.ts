import { create } from 'zustand';
import type { SysUser, SysRole } from '@/types';
import { generateSysUsers } from '@/utils/mock';

interface UserState {
  users: SysUser[];
  roles: SysRole[];
  currentUser: SysUser | null;
  
  initMockData: () => void;
  setCurrentUser: (user: SysUser | null) => void;
  addUser: (data: Omit<SysUser, 'id'>) => void;
  updateUser: (id: string, data: Partial<SysUser>) => void;
  deleteUser: (id: string) => void;
  addRole: (data: Omit<SysRole, 'id'>) => void;
  updateRole: (id: string, data: Partial<SysRole>) => void;
  deleteRole: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useUserStore = create<UserState>((set) => ({
  users: [],
  roles: [
    {
      id: '1',
      roleName: '系统管理员',
      permissions: ['*'],
    },
    {
      id: '2',
      roleName: '生产主管',
      permissions: ['view', 'create', 'edit', 'export', 'manage'],
    },
    {
      id: '3',
      roleName: '车间操作员',
      permissions: ['view', 'create', 'edit'],
    },
    {
      id: '4',
      roleName: '质量检验员',
      permissions: ['view', 'create', 'edit', 'export'],
    },
  ],
  currentUser: null,

  initMockData: () => {
    const users = generateSysUsers();
    set({
      users,
      currentUser: users[0],
    });
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  addUser: (data) => set((state) => ({
    users: [{ ...data, id: generateId() }, ...state.users],
  })),
  updateUser: (id, data) => set((state) => ({
    users: state.users.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((item) => item.id !== id),
  })),

  addRole: (data) => set((state) => ({
    roles: [{ ...data, id: generateId() }, ...state.roles],
  })),
  updateRole: (id, data) => set((state) => ({
    roles: state.roles.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteRole: (id) => set((state) => ({
    roles: state.roles.filter((item) => item.id !== id),
  })),
}));
