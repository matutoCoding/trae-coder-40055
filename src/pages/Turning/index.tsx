import { Cog } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { TurningProcess, ProcessStatus } from '@/types';
import { ringTypeTextMap } from '@/utils/mock';
import { message } from 'antd';

export default function Turning() {
  const {
    turningProcesses,
    addTurningProcess,
    updateTurningProcess,
    deleteTurningProcess,
    initMockData,
  } = useProcessStore();

  const columns: ColumnsType<TurningProcess> = [
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
      title: '圈类型',
      dataIndex: 'ringType',
      key: 'ringType',
      width: 80,
      render: (type) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${type === 'inner' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {ringTypeTextMap[type]}
        </span>
      ),
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
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '外径(mm)',
      dataIndex: 'outerDiameter',
      key: 'outerDiameter',
      width: 100,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '内径(mm)',
      dataIndex: 'innerDiameter',
      key: 'innerDiameter',
      width: 100,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '宽度(mm)',
      dataIndex: 'width',
      key: 'width',
      width: 100,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
      ellipsis: true,
      render: (text) => text || '-',
    },
  ];

  const fields = [
    { name: 'ringBatchNo', label: '批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    {
      name: 'ringType',
      label: '圈类型',
      type: 'select' as const,
      required: true,
      options: [
        { label: '内圈', value: 'inner' },
        { label: '外圈', value: 'outer' },
      ],
    },
    { name: 'machineNo', label: '设备编号', type: 'text' as const, required: true },
    { name: 'operator', label: '操作员', type: 'text' as const, required: true },
    { name: 'startTime', label: '开始时间', type: 'datetime' as const, required: true },
    { name: 'endTime', label: '结束时间', type: 'datetime' as const },
    { name: 'outerDiameter', label: '外径(mm)', type: 'number' as const, required: true },
    { name: 'innerDiameter', label: '内径(mm)', type: 'number' as const, required: true },
    { name: 'width', label: '宽度(mm)', type: 'number' as const, required: true },
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
    { name: 'remark', label: '备注', type: 'textarea' as const },
  ];

  const handleRefresh = () => {
    initMockData();
    message.success('数据已刷新');
  };

  return (
    <ProcessPage<TurningProcess>
      title="套圈车削"
      description="管理套圈车削加工记录，包括内外圈的车削加工参数和质量检测"
      icon={Cog}
      data={turningProcesses}
      columns={columns}
      fields={fields}
      onAdd={addTurningProcess}
      onUpdate={updateTurningProcess}
      onDelete={deleteTurningProcess}
      onRefresh={handleRefresh}
    />
  );
}
