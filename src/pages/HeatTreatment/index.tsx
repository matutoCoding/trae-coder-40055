import { Flame } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { HeatProcess } from '@/types';
import { message } from 'antd';

export default function HeatTreatment() {
  const {
    heatProcesses,
    addHeatProcess,
    updateHeatProcess,
    deleteHeatProcess,
    initMockData,
  } = useProcessStore();

  const columns: ColumnsType<HeatProcess> = [
    {
      title: '批次号',
      dataIndex: 'ringBatchNo',
      key: 'ringBatchNo',
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
      title: '炉号',
      dataIndex: 'furnaceNo',
      key: 'furnaceNo',
      width: 110,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 90,
    },
    {
      title: '淬火时间',
      dataIndex: 'quenchingTime',
      key: 'quenchingTime',
      width: 160,
    },
    {
      title: '淬火温度(°C)',
      dataIndex: 'quenchingTemp',
      key: 'quenchingTemp',
      width: 120,
      render: (val) => <span className="font-mono text-warning-600">{val}</span>,
    },
    {
      title: '回火时间',
      dataIndex: 'temperingTime',
      key: 'temperingTime',
      width: 160,
    },
    {
      title: '回火温度(°C)',
      dataIndex: 'temperingTemp',
      key: 'temperingTemp',
      width: 120,
      render: (val) => <span className="font-mono text-warning-600">{val}</span>,
    },
    {
      title: '硬度(HRC)',
      dataIndex: 'hardness',
      key: 'hardness',
      width: 100,
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
    { name: 'ringBatchNo', label: '批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    { name: 'furnaceNo', label: '炉号', type: 'text' as const, required: true },
    { name: 'operator', label: '操作员', type: 'text' as const, required: true },
    { name: 'quenchingTime', label: '淬火时间', type: 'datetime' as const, required: true },
    { name: 'quenchingTemp', label: '淬火温度(°C)', type: 'number' as const, required: true },
    { name: 'temperingTime', label: '回火时间', type: 'datetime' as const, required: true },
    { name: 'temperingTemp', label: '回火温度(°C)', type: 'number' as const, required: true },
    { name: 'hardness', label: '硬度(HRC)', type: 'number' as const, required: true },
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
    <ProcessPage<HeatProcess>
      title="热处理"
      description="管理套圈淬回火工艺记录，包括温度监控和硬度检测数据"
      icon={Flame}
      data={heatProcesses}
      columns={columns}
      fields={fields}
      onAdd={addHeatProcess}
      onUpdate={updateHeatProcess}
      onDelete={deleteHeatProcess}
      onRefresh={handleRefresh}
    />
  );
}
