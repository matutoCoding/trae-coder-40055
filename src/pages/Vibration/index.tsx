import { Waves, Package } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { VibrationTest, FinishedProduct } from '@/types';
import { message, Tabs, Tag } from 'antd';
import StatusTag from '@/components/StatusTag';

export default function Vibration() {
  const {
    vibrationTests,
    addVibrationTest,
    updateVibrationTest,
    deleteVibrationTest,
    finishedProducts,
    addFinishedProduct,
    updateFinishedProduct,
    deleteFinishedProduct,
    initMockData,
  } = useProcessStore();

  const vibrationColumns: ColumnsType<VibrationTest> = [
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
      title: '检验员',
      dataIndex: 'tester',
      key: 'tester',
      width: 90,
    },
    {
      title: '检测时间',
      dataIndex: 'testTime',
      key: 'testTime',
      width: 160,
    },
    {
      title: '转速(r/min)',
      dataIndex: 'rotationSpeed',
      key: 'rotationSpeed',
      width: 110,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '振动值(mm/s)',
      dataIndex: 'vibrationValue',
      key: 'vibrationValue',
      width: 120,
      render: (val) => (
        <span className={`font-mono ${val > 3 ? 'text-danger-600' : 'text-success-600'}`}>{val}</span>
      ),
    },
    {
      title: '噪声(dB)',
      dataIndex: 'noiseDb',
      key: 'noiseDb',
      width: 100,
      render: (val) => (
        <span className={`font-mono ${val > 65 ? 'text-warning-600' : 'text-neutral-700'}`}>{val}</span>
      ),
    },
    {
      title: '旋转灵活度',
      dataIndex: 'rotationSmooth',
      key: 'rotationSmooth',
      width: 100,
      render: (val) => val ? <Tag color="success">灵活</Tag> : <Tag color="danger">卡滞</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
  ];

  const vibrationFields = [
    { name: 'assemblyBatch', label: '装配批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    { name: 'tester', label: '检验员', type: 'text' as const, required: true },
    { name: 'testTime', label: '检测时间', type: 'datetime' as const, required: true },
    { name: 'rotationSpeed', label: '转速(r/min)', type: 'number' as const, required: true },
    { name: 'vibrationValue', label: '振动值(mm/s)', type: 'number' as const, required: true },
    { name: 'noiseDb', label: '噪声(dB)', type: 'number' as const, required: true },
    {
      name: 'rotationSmooth',
      label: '旋转灵活度',
      type: 'select' as const,
      required: true,
      options: [
        { label: '灵活', value: true },
        { label: '卡滞', value: false },
      ],
    },
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      required: true,
      options: [
        { label: '待检测', value: 'pending' },
        { label: '检测中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '合格', value: 'qualified' },
        { label: '不合格', value: 'unqualified' },
      ],
    },
  ];

  const productColumns: ColumnsType<FinishedProduct> = [
    {
      title: '包装批次号',
      dataIndex: 'packageBatch',
      key: 'packageBatch',
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
      title: '数量(套)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 90,
      render: (val) => <span className="font-mono">{val}</span>,
    },
    {
      title: '包装员',
      dataIndex: 'packager',
      key: 'packager',
      width: 90,
    },
    {
      title: '包装日期',
      dataIndex: 'packageDate',
      key: 'packageDate',
      width: 160,
    },
    {
      title: '防锈方式',
      dataIndex: 'rustProof',
      key: 'rustProof',
      width: 100,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: '库位',
      dataIndex: 'storageLocation',
      key: 'storageLocation',
      width: 100,
      render: (text) => <span className="font-mono">{text}</span>,
    },
  ];

  const productFields = [
    { name: 'packageBatch', label: '包装批次号', type: 'text' as const, required: true },
    { name: 'bearingTypeName', label: '轴承类型', type: 'text' as const, required: true },
    { name: 'bearingModel', label: '轴承型号', type: 'text' as const, required: true },
    { name: 'quantity', label: '数量(套)', type: 'number' as const, required: true },
    { name: 'packager', label: '包装员', type: 'text' as const, required: true },
    { name: 'packageDate', label: '包装日期', type: 'datetime' as const, required: true },
    {
      name: 'rustProof',
      label: '防锈方式',
      type: 'select' as const,
      required: true,
      options: [
        { label: '防锈油', value: '防锈油' },
        { label: '防锈纸', value: '防锈纸' },
        { label: '防锈袋', value: '防锈袋' },
      ],
    },
    { name: 'storageLocation', label: '库位', type: 'text' as const, required: true },
  ];

  const handleRefresh = () => {
    initMockData();
    message.success('数据已刷新');
  };

  const tabItems = [
    {
      key: 'vibration',
      label: (
        <span className="flex items-center gap-2">
          <Waves size={16} />
          振动检测
        </span>
      ),
      children: (
        <ProcessPage<VibrationTest>
          title=""
          description=""
          icon={Waves}
          data={vibrationTests}
          columns={vibrationColumns}
          fields={vibrationFields}
          onAdd={addVibrationTest}
          onUpdate={updateVibrationTest}
          onDelete={deleteVibrationTest}
          onRefresh={handleRefresh}
        />
      ),
    },
    {
      key: 'finished',
      label: (
        <span className="flex items-center gap-2">
          <Package size={16} />
          成品包装
        </span>
      ),
      children: (
        <ProcessPage<FinishedProduct>
          title=""
          description=""
          icon={Package}
          data={finishedProducts}
          columns={productColumns}
          fields={productFields}
          onAdd={addFinishedProduct}
          onUpdate={updateFinishedProduct}
          onDelete={deleteFinishedProduct}
          onRefresh={handleRefresh}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <Waves size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-700">振动检测</h1>
              <p className="text-sm text-neutral-500 mt-0.5">管理旋转灵活度检测、振动噪声检测和成品防锈包装记录</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="vibration" items={tabItems} />
    </div>
  );
}
