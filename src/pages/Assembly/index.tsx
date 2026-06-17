import { Wrench } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { BearingAssembly } from '@/types';
import { message, Tag } from 'antd';

export default function Assembly() {
  const {
    bearingAssemblies,
    addBearingAssembly,
    updateBearingAssembly,
    deleteBearingAssembly,
    initMockData,
  } = useProcessStore();

  const columns: ColumnsType<BearingAssembly> = [
    {
      title: '装配批次号',
      dataIndex: 'assemblyBatch',
      key: 'assemblyBatch',
      width: 140,
      render: (text) => <span className="font-mono text-primary-600 font-medium">{text}</span>,
    },
    {
      title: '轴承类型',
      dataIndex: 'bearingTypeName',
      key: 'bearingTypeName',
      width: 120,
    },
    {
      title: '轴承型号',
      dataIndex: 'bearingModel',
      key: 'bearingModel',
      width: 100,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '内圈批次',
      dataIndex: 'innerRingBatch',
      key: 'innerRingBatch',
      width: 120,
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: '外圈批次',
      dataIndex: 'outerRingBatch',
      key: 'outerRingBatch',
      width: 120,
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: '滚子组号',
      dataIndex: 'rollerGroupNo',
      key: 'rollerGroupNo',
      width: 100,
      render: (text) => <span className="font-mono text-warning-600">{text}</span>,
    },
    {
      title: '保持架批次',
      dataIndex: 'cageBatch',
      key: 'cageBatch',
      width: 120,
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: '径向游隙(mm)',
      dataIndex: 'radialClearance',
      key: 'radialClearance',
      width: 120,
      render: (val) => <span className="font-mono text-success-600">{val}</span>,
    },
    {
      title: '数量(套)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 90,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '清洗注脂',
      dataIndex: 'cleaningGreasing',
      key: 'cleaningGreasing',
      width: 90,
      render: (val) => val ? <Tag color="success">已完成</Tag> : <Tag color="default">未完成</Tag>,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 90,
    },
    {
      title: '装配时间',
      dataIndex: 'assemblyTime',
      key: 'assemblyTime',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
  ];

  const fields = [
    { name: 'assemblyBatch', label: '装配批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    { name: 'bearingModel', label: '轴承型号', type: 'text' as const, required: true },
    { name: 'innerRingBatch', label: '内圈批次', type: 'text' as const, required: true },
    { name: 'outerRingBatch', label: '外圈批次', type: 'text' as const, required: true },
    { name: 'rollerGroupNo', label: '滚子组号', type: 'text' as const, required: true },
    { name: 'cageBatch', label: '保持架批次', type: 'text' as const, required: true },
    { name: 'radialClearance', label: '径向游隙(mm)', type: 'number' as const, required: true },
    { name: 'quantity', label: '数量(套)', type: 'number' as const, required: true },
    {
      name: 'cleaningGreasing',
      label: '清洗注脂',
      type: 'select' as const,
      required: true,
      options: [
        { label: '已完成', value: true },
        { label: '未完成', value: false },
      ],
    },
    { name: 'operator', label: '操作员', type: 'text' as const, required: true },
    { name: 'assemblyTime', label: '装配时间', type: 'datetime' as const, required: true },
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      required: true,
      options: [
        { label: '待处理', value: 'pending' },
        { label: '处理中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '合格', value: 'qualified' },
        { label: '不合格', value: 'unqualified' },
      ],
    },
  ];

  const handleRefresh = () => {
    initMockData();
    message.success('数据已刷新');
  };

  return (
    <ProcessPage<BearingAssembly>
      title="轴承装配"
      description="管理轴承游隙选配、合套装配、清洗注脂等装配工序记录"
      icon={Wrench}
      data={bearingAssemblies}
      columns={columns}
      fields={fields}
      onAdd={addBearingAssembly}
      onUpdate={updateBearingAssembly}
      onDelete={deleteBearingAssembly}
      onRefresh={handleRefresh}
    />
  );
}
