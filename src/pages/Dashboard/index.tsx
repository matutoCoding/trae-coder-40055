import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  Factory,
  CheckCircle,
  Clock,
  Layers,
  TrendingUp,
  Cog,
  Flame,
  CircleDot,
  Grid3X3,
  Wrench,
  Waves,
  LayoutDashboard,
} from 'lucide-react';
import { useProcessStore } from '@/store/useProcessStore';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import StatusTag from '@/components/StatusTag';

export default function Dashboard() {
  const { dashboardStats, refreshDashboard, initMockData, turningProcesses, heatProcesses, grindingProcesses } = useProcessStore();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      initMockData();
      hasInitialized.current = true;
    }
    const timer = setInterval(refreshDashboard, 30000);
    return () => clearInterval(timer);
  }, [initMockData, refreshDashboard]);

  if (!dashboardStats) return null;

  const productionTrendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['产量', '合格率'], right: 20 },
    grid: { left: 50, right: 50, bottom: 30, top: 50 },
    xAxis: {
      type: 'category',
      data: dashboardStats.productionTrend.map((d) => d.date),
      axisLine: { lineStyle: { color: '#C9CDD4' } },
    },
    yAxis: [
      { type: 'value', name: '产量(套)', axisLine: { lineStyle: { color: '#C9CDD4' } } },
      { type: 'value', name: '合格率(%)', min: 80, max: 100, axisLine: { lineStyle: { color: '#C9CDD4' } } },
    ],
    series: [
      {
        name: '产量',
        type: 'bar',
        data: dashboardStats.productionTrend.map((d) => d.output),
        itemStyle: { color: '#165DFF', borderRadius: [4, 4, 0, 0] },
      },
      {
        name: '合格率',
        type: 'line',
        yAxisIndex: 1,
        data: dashboardStats.qualityTrend.map((d) => d.rate),
        smooth: true,
        lineStyle: { color: '#00B42A', width: 3 },
        itemStyle: { color: '#00B42A' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 180, 42, 0.3)' },
              { offset: 1, color: 'rgba(0, 180, 42, 0)' },
            ],
          },
        },
      },
    ],
  };

  const moduleStatsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        data: dashboardStats.moduleStats,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: '{b}\n{d}%',
          fontSize: 12,
        },
        colors: ['#165DFF', '#00B42A', '#FF7D00', '#F53F3F', '#722ED1', '#14C9C9', '#F7BA1E'],
      },
    ],
  };

  const recentTasksColumns = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (text: string) => <span className="text-neutral-700">{text}</span>,
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text: string) => <span className="font-mono text-primary-600">{text}</span>,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusTag status={status} size="small" />,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <span className="text-neutral-500 text-sm">{text.split(' ')[1]}</span>,
    },
  ];

  const quickActions = [
    { title: '套圈车削', icon: Cog, count: turningProcesses.length, color: 'primary' as const, path: '/turning' },
    { title: '热处理', icon: Flame, count: heatProcesses.length, color: 'warning' as const, path: '/heat-treatment' },
    { title: '磨加工', icon: Layers, count: grindingProcesses.length, color: 'success' as const, path: '/grinding' },
    { title: '滚子配套', icon: CircleDot, count: 20, color: 'primary' as const, path: '/roller' },
    { title: '保持架', icon: Grid3X3, count: 20, color: 'success' as const, path: '/cage' },
    { title: '轴承装配', icon: Wrench, count: 20, color: 'warning' as const, path: '/assembly' },
    { title: '振动检测', icon: Waves, count: 20, color: 'primary' as const, path: '/vibration' },
  ];

  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="生产概览"
        description="实时监控轴承制造全流程生产状态"
        extra={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-success-600">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse-dot"></span>
              <span>系统运行正常</span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="今日产量"
          value={dashboardStats.todayProduction}
          unit="套"
          icon={Factory}
          trend={5.2}
          color="primary"
        />
        <StatCard
          title="产品合格率"
          value={`${dashboardStats.qualifiedRate}%`}
          icon={CheckCircle}
          trend={1.8}
          color="success"
        />
        <StatCard
          title="待处理任务"
          value={dashboardStats.pendingTasks}
          unit="项"
          icon={Clock}
          trend={-3.1}
          color="warning"
        />
        <StatCard
          title="进行中批次"
          value={dashboardStats.processingBatches}
          unit="批"
          icon={TrendingUp}
          trend={8.5}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="生产趋势" className="card border-none shadow-sm col-span-2" styles={{ body: { padding: 20 } }}>
          <ReactECharts option={productionTrendOption} style={{ height: 300 }} />
        </Card>
        
        <Card title="各模块工单分布" className="card border-none shadow-sm" styles={{ body: { padding: 20 } }}>
          <ReactECharts option={moduleStatsOption} style={{ height: 300 }} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="快捷入口" className="card border-none shadow-sm" styles={{ body: { padding: 20 } }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colorClasses: Record<string, string> = {
                primary: 'bg-primary-100 text-primary-600',
                success: 'bg-success-100 text-success-600',
                warning: 'bg-warning-100 text-warning-600',
                danger: 'bg-danger-100 text-danger-600',
              };
              const textColorClasses: Record<string, string> = {
                primary: 'text-primary-600',
                success: 'text-success-600',
                warning: 'text-warning-600',
                danger: 'text-danger-600',
              };
              return (
                <div
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 border border-neutral-100 hover:border-primary-200 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[action.color]} group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-2xl font-bold ${textColorClasses[action.color]} font-mono`}>{action.count}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{action.title}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="最近任务" className="card border-none shadow-sm" bodyStyle={{ padding: 0 }}>
          <Table
            columns={recentTasksColumns}
            dataSource={dashboardStats.recentTasks}
            rowKey="id"
            pagination={false}
            size="small"
            showHeader={true}
          />
        </Card>
      </div>
    </div>
  );
}
