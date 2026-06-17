import { Grid3X3 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { CageRivet } from '@/types';
import { message } from 'antd';

export default function Cage() {
  const {
    cageRivets,
    addCageRivet,
    updateCageRivet,
    deleteCageRivet,
    initMockData,
  } = useProcessStore();

  const columns: ColumnsType<CageRivet> = [
    {
      title: '保持架批次号',
      dataIndex: 'cageBatchNo',
      key: 'cageBatchNo',
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
      title: '设备编号',
      dataIndex: 'machineNo',
      key: 'machineNo',
      width: 110,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 90,
    },
    {
      title: '加工时间',
      dataIndex: 'processTime',
      key: 'processTime',
      width: 160,
    },
    {
      title: '兜孔直径(mm)',
      dataIndex: 'pocketDiameter',
      key: 'pocketDiameter',
      width: 120,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '兜孔间距(mm)',
      dataIndex: 'pocketDistance',
      key: 'pocketDistance',
      width: 120,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
  ];

  const fields = [
    { name: 'cageBatchNo', label: '保持架批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    { name: 'machineNo', label: '设备编号', type: 'text' as const, required: true },
    { name: 'operator', label: '操作员', type: 'text' as const, required: true },
    { name: 'processTime', label: '加工时间', type: 'datetime' as const, required: true },
    { name: 'pocketDiameter', label: '兜孔直径(mm)', type: 'number' as const, required: true },
    { name: 'pocketDistance', label: '兜孔间距(mm)', type: 'number' as const, required: true },
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
    <ProcessPage<CageRivet>
      title="保持架"
      description="管理保持架铆合记录，包括尺寸检测和质量检验"
      icon={Grid3X3}
      data={cageRivets}
      columns={columns}
      fields={fields}
      onAdd={addCageRivet}
      onUpdate={updateCageRivet}
      onDelete={deleteCageRivet}
      onRefresh={handleRefresh}
    />
  );
}
