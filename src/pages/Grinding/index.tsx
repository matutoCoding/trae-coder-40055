import { Layers } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { GrindingProcess } from '@/types';
import { ringTypeTextMap } from '@/utils/mock';
import { message } from 'antd';

export default function Grinding() {
  const {
    grindingProcesses,
    addGrindingProcess,
    updateGrindingProcess,
    deleteGrindingProcess,
    initMockData,
  } = useProcessStore();

  const columns: ColumnsType<GrindingProcess> = [
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
      title: '加工时间',
      dataIndex: 'processTime',
      key: 'processTime',
      width: 160,
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
      title: '沟道粗糙度(μm)',
      dataIndex: 'grooveRoughness',
      key: 'grooveRoughness',
      width: 130,
      render: (val) => <span className="font-mono text-success-600">{val}</span>,
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
    { name: 'processTime', label: '加工时间', type: 'datetime' as const, required: true },
    { name: 'outerDiameter', label: '外径(mm)', type: 'number' as const, required: true },
    { name: 'innerDiameter', label: '内径(mm)', type: 'number' as const, required: true },
    { name: 'grooveRoughness', label: '沟道粗糙度(μm)', type: 'number' as const, required: true },
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
    <ProcessPage<GrindingProcess>
      title="磨加工"
      description="管理内外圈磨削和沟道超精研记录，包括尺寸检测和粗糙度数据"
      icon={Layers}
      data={grindingProcesses}
      columns={columns}
      fields={fields}
      onAdd={addGrindingProcess}
      onUpdate={updateGrindingProcess}
      onDelete={deleteGrindingProcess}
      onRefresh={handleRefresh}
    />
  );
}
