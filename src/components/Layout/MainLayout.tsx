import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Cog,
  Flame,
  Layers,
  CircleDot,
  Grid3X3,
  Wrench,
  Waves,
  Search,
  Users,
  Shield,
  LogOut,
  Bell,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    label: '首页仪表盘',
  },
  {
    key: '/turning',
    icon: <Cog size={18} />,
    label: '套圈车削',
  },
  {
    key: '/heat-treatment',
    icon: <Flame size={18} />,
    label: '热处理',
  },
  {
    key: '/grinding',
    icon: <Layers size={18} />,
    label: '磨加工',
  },
  {
    key: '/roller',
    icon: <CircleDot size={18} />,
    label: '滚子配套',
  },
  {
    key: '/cage',
    icon: <Grid3X3 size={18} />,
    label: '保持架',
  },
  {
    key: '/assembly',
    icon: <Wrench size={18} />,
    label: '轴承装配',
  },
  {
    key: '/vibration',
    icon: <Waves size={18} />,
    label: '振动检测',
  },
  {
    key: '/trace',
    icon: <Search size={18} />,
    label: '数据查询',
  },
  {
    key: 'system',
    icon: <Settings size={18} />,
    label: '系统管理',
    children: [
      {
        key: '/system/users',
        icon: <Users size={16} />,
        label: '用户管理',
      },
      {
        key: '/system/roles',
        icon: <Shield size={16} />,
        label: '角色配置',
      },
    ],
  },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <Users size={14} />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <Settings size={14} />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={14} />,
      label: '退出登录',
    },
  ];

  const selectedKeys = [location.pathname];
  const openKeys = location.pathname.startsWith('/system') ? ['system'] : [];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className="bg-neutral-600 border-r border-neutral-700"
      >
        <div className="flex items-center h-16 px-4 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Cog className="text-white" size={24} />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">轴承MES</span>
                <span className="text-neutral-400 text-xs">制造执行系统</span>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-none mt-2"
          style={{ background: '#1D2129' }}
        />
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="ml-2 text-sm">收起菜单</span>}
        </button>
      </Sider>
      
      <Layout className="bg-neutral-50">
        <Header className="bg-white border-b border-neutral-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <MenuIcon size={20} className="text-neutral-500" />
            </button>
            <div className="text-sm text-neutral-500">
              <span className="mr-4">{currentTime.format('YYYY年MM月DD日')}</span>
              <span>{currentTime.format('HH:mm')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Badge count={3} size="small">
                <Bell size={20} className="text-neutral-500" />
              </Badge>
            </button>
            
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 px-3 py-2 rounded-lg transition-colors">
                <Avatar size={36} className="bg-primary-500">
                  {currentUser?.realName?.charAt(0) || 'U'}
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-neutral-700">
                    {currentUser?.realName || '用户'}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {currentUser?.roleName || '访客'}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="p-6 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
