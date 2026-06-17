import { CircleDot } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { RollerGroup } from '@/types';
import { message } from 'antd';

export default function Roller() {
  const {
    rollerGroups,
    addRollerGroup,
    updateRollerGroup,
    deleteRollerGroup,
    initMockData,
  } = useProcessStore();

  const columns: ColumnsType<RollerGroup> = [
    {
      title: '滚子批次号',
      dataIndex: 'rollerBatchNo',
      key: 'rollerBatchNo',
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
      title: '分组号',
      dataIndex: 'groupNo',
      key: 'groupNo',
      width: 100,
      render: (text) => <span className="font-mono bg-warning-100 text-warning-700 px-2 py-0.5 rounded">{text}</span>,
    },
    {
      title: '直径最小(mm)',
      dataIndex: 'diameterMin',
      key: 'diameterMin',
      width: 120,
      render: (val) => <span className="font-mono">{val.toFixed(4)}</span>,
    },
    {
      title: '直径最大(mm)',
      dataIndex: 'diameterMax',
      key: 'diameterMax',
      width: 120,
      render: (val) => <span className="font-mono">{val.toFixed(4)}</span>,
    },
    {
      title: '数量(个)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 90,
    },
    {
      title: '分组日期',
      dataIndex: 'groupDate',
      key: 'groupDate',
      width: 160,
    },
  ];

  const fields = [
    { name: 'rollerBatchNo', label: '滚子批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    { name: 'groupNo', label: '分组号', type: 'text' as const, required: true },
    { name: 'diameterMin', label: '直径最小(mm)', type: 'number' as const, required: true },
    { name: 'diameterMax', label: '直径最大(mm)', type: 'number' as const, required: true },
    { name: 'quantity', label: '数量(个)', type: 'number' as const, required: true },
    { name: 'operator', label: '操作员', type: 'text' as const, required: true },
    { name: 'groupDate', label: '分组日期', type: 'datetime' as const, required: true },
  ];

  const handleRefresh = () => {
    initMockData();
    message.success('数据已刷新');
  };

  return (
    <ProcessPage<RollerGroup>
      title="滚子配套"
      description="管理滚子直径分组记录，按精度等级进行分组配套"
      icon={CircleDot}
      data={rollerGroups}
      columns={columns}
      fields={fields}
      onAdd={addRollerGroup}
      onUpdate={updateRollerGroup}
      onDelete={deleteRollerGroup}
      onRefresh={handleRefresh}
    />
  );
}
