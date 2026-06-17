import { useState, useMemo } from 'react';
import { Waves, Package, CheckCircle, XCircle, AlertTriangle, Info, Plus, Search } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { VibrationTest, FinishedProduct, BearingAssembly } from '@/types';
import { 
  message, 
  Tabs, 
  Tag, 
  Card, 
  Form, 
  Select, 
  Input, 
  InputNumber, 
  Button, 
  Modal, 
  Space, 
  Alert,
  Descriptions,
  Divider,
  Badge,
  Tooltip,
} from 'antd';
import StatusTag from '@/components/StatusTag';
import dayjs from 'dayjs';

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
    bearingAssemblies,
    initMockData,
  } = useProcessStore();

  const [packageModalVisible, setPackageModalVisible] = useState(false);
  const [packageForm] = Form.useForm();
  const [selectedVibration, setSelectedVibration] = useState<VibrationTest | null>(null);
  const [assemblyInfo, setAssemblyInfo] = useState<BearingAssembly | null>(null);

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
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'qualified' && (
            <Button
              type="link"
              size="small"
              icon={<Package size={14} />}
              onClick={() => handleCreatePackage(record)}
            >
              包装入库
            </Button>
          )}
        </Space>
      ),
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
      title: '来源装配批次',
      dataIndex: 'assemblyBatch',
      key: 'assemblyBatch',
      width: 140,
      render: (text) => text ? <Tag className="font-mono text-xs">{text}</Tag> : '-',
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
    { name: 'assemblyBatch', label: '来源装配批次', type: 'text' as const, required: false },
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

  const qualifiedVibrationOptions = useMemo(() => {
    const packagedBatches = new Set(finishedProducts.map(p => p.assemblyBatch).filter(Boolean));
    return vibrationTests
      .filter(v => v.status === 'qualified' && !packagedBatches.has(v.assemblyBatch))
      .map(v => ({
        label: `${v.assemblyBatch} (${v.bearingTypeName})`,
        value: v.id,
        data: v,
      }));
  }, [vibrationTests, finishedProducts]);

  const handleCreatePackage = (record: VibrationTest) => {
    const assembly = bearingAssemblies.find(a => a.assemblyBatch === record.assemblyBatch);
    setSelectedVibration(record);
    setAssemblyInfo(assembly || null);
    
    packageForm.setFieldsValue({
      assemblyBatch: record.assemblyBatch,
      bearingTypeName: record.bearingTypeName,
      bearingModel: assembly?.bearingModel || '',
      quantity: assembly?.quantity || 0,
      packageDate: dayjs(),
      vibrationValue: record.vibrationValue,
      noiseDb: record.noiseDb,
      rotationSmooth: record.rotationSmooth,
    });
    
    setPackageModalVisible(true);
  };

  const handleVibrationSelect = (value: string) => {
    const vibration = qualifiedVibrationOptions.find(o => o.value === value)?.data;
    if (vibration) {
      const assembly = bearingAssemblies.find(a => a.assemblyBatch === vibration.assemblyBatch);
      setSelectedVibration(vibration);
      setAssemblyInfo(assembly || null);
      
      packageForm.setFieldsValue({
        assemblyBatch: vibration.assemblyBatch,
        bearingTypeName: vibration.bearingTypeName,
        bearingModel: assembly?.bearingModel || '',
        quantity: assembly?.quantity || 0,
      });
    }
  };

  const handlePackageSubmit = async () => {
    try {
      const values = await packageForm.validateFields();
      
      const processedValues = { ...values };
      if (processedValues.packageDate?.format) {
        processedValues.packageDate = processedValues.packageDate.format('YYYY-MM-DD HH:mm:ss');
      }
      
      delete processedValues.vibrationValue;
      delete processedValues.noiseDb;
      delete processedValues.rotationSmooth;
      
      addFinishedProduct(processedValues as Omit<FinishedProduct, 'id'>);
      message.success('成品包装创建成功，已入库');
      setPackageModalVisible(false);
      packageForm.resetFields();
      setSelectedVibration(null);
      setAssemblyInfo(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getTestConclusion = (vibration: VibrationTest) => {
    const issues: string[] = [];
    
    if (vibration.vibrationValue > 3.5) {
      issues.push('振动值超标');
    } else if (vibration.vibrationValue > 2.8) {
      issues.push('振动值偏高');
    }
    
    if (vibration.noiseDb > 70) {
      issues.push('噪声超标');
    } else if (vibration.noiseDb > 62) {
      issues.push('噪声偏高');
    }
    
    if (!vibration.rotationSmooth) {
      issues.push('旋转不灵活');
    }
    
    if (issues.length === 0) {
      return { level: 'success', text: '检测合格，各项指标均符合标准' };
    } else if (vibration.status === 'qualified') {
      return { level: 'warning', text: `合格但需关注：${issues.join('、')}` };
    } else {
      return { level: 'error', text: `不合格：${issues.join('、')}` };
    }
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
        <div>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Badge status="success" text={`合格: ${vibrationTests.filter(v => v.status === 'qualified').length}`} />
              <Badge status="processing" text={`检测中: ${vibrationTests.filter(v => v.status === 'processing').length}`} />
              <Badge status="error" text={`不合格: ${vibrationTests.filter(v => v.status === 'unqualified').length}`} />
            </Space>
          </div>
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
        </div>
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
        <div>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Badge status="success" text={`库存: ${finishedProducts.length} 批`} />
              <Badge status="processing" text={`待包装: ${qualifiedVibrationOptions.length} 批`} />
            </Space>
            <Button
              type="primary"
              icon={<Plus size={14} />}
              onClick={() => {
                setSelectedVibration(null);
                setAssemblyInfo(null);
                packageForm.resetFields();
                packageForm.setFieldsValue({ packageDate: dayjs() });
                setPackageModalVisible(true);
              }}
            >
              新增包装
            </Button>
          </div>
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
        </div>
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

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Package size={20} className="text-primary-600" />
            <span>成品包装入库</span>
          </div>
        }
        width={720}
        open={packageModalVisible}
        onCancel={() => {
          setPackageModalVisible(false);
          setSelectedVibration(null);
          setAssemblyInfo(null);
        }}
        footer={
          <Space>
            <Button onClick={() => {
              setPackageModalVisible(false);
              setSelectedVibration(null);
              setAssemblyInfo(null);
            }}>
              取消
            </Button>
            <Button type="primary" onClick={handlePackageSubmit}>
              确认包装入库
            </Button>
          </Space>
        }
      >
        <Form form={packageForm} layout="vertical">
          <Card
            size="small"
            className="mb-4"
            styles={{ body: { padding: 12 } }}
            title={
              <span className="text-sm font-medium">
                选择检测合格的装配批次
              </span>
            }
          >
            <Form.Item
              name="vibrationTest"
              label="振动检测批次（仅显示合格且未包装的）"
              rules={[{ required: false, message: '请选择振动检测批次' }]}
            >
              <Select
                showSearch
                placeholder="选择振动检测合格的装配批次"
                options={qualifiedVibrationOptions}
                optionFilterProp="label"
                onChange={handleVibrationSelect}
                allowClear
              />
            </Form.Item>

            {selectedVibration && (
              <div className="animate-fade-in">
                <Divider orientation="left" plain className="my-2">
                  <span className="text-xs font-medium text-neutral-500">检测结论</span>
                </Divider>
                
                <Alert
                  type={getTestConclusion(selectedVibration).level as any}
                  showIcon
                  icon={
                    selectedVibration.status === 'qualified' 
                      ? <CheckCircle size={16} /> 
                      : <XCircle size={16} />
                  }
                  message={getTestConclusion(selectedVibration).text}
                  className="mb-3"
                />

                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-neutral-50 rounded text-center">
                    <div className="text-xs text-neutral-500">振动值</div>
                    <div className={`font-mono font-semibold ${selectedVibration.vibrationValue > 3 ? 'text-danger-600' : 'text-success-600'}`}>
                      {selectedVibration.vibrationValue} mm/s
                    </div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded text-center">
                    <div className="text-xs text-neutral-500">噪声</div>
                    <div className={`font-mono font-semibold ${selectedVibration.noiseDb > 65 ? 'text-warning-600' : 'text-neutral-700'}`}>
                      {selectedVibration.noiseDb} dB
                    </div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded text-center">
                    <div className="text-xs text-neutral-500">转速</div>
                    <div className="font-mono font-semibold">
                      {selectedVibration.rotationSpeed} r/min
                    </div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded text-center">
                    <div className="text-xs text-neutral-500">旋转灵活度</div>
                    <div className={`font-semibold ${selectedVibration.rotationSmooth ? 'text-success-600' : 'text-danger-600'}`}>
                      {selectedVibration.rotationSmooth ? '灵活' : '卡滞'}
                    </div>
                  </div>
                </div>

                {assemblyInfo && (
                  <>
                    <Divider orientation="left" plain className="my-2">
                      <span className="text-xs font-medium text-neutral-500">装配信息（自动带出）</span>
                    </Divider>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-primary-50 rounded">
                        <div className="text-xs text-neutral-500">轴承型号</div>
                        <div className="font-mono font-semibold text-primary-600">
                          {assemblyInfo.bearingModel}
                        </div>
                      </div>
                      <div className="p-2 bg-primary-50 rounded">
                        <div className="text-xs text-neutral-500">数量</div>
                        <div className="font-mono font-semibold text-primary-600">
                          {assemblyInfo.quantity} 套
                        </div>
                      </div>
                      <div className="p-2 bg-primary-50 rounded">
                        <div className="text-xs text-neutral-500">径向游隙</div>
                        <div className="font-mono font-semibold text-primary-600">
                          {assemblyInfo.radialClearance} mm
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>

          <Card
            size="small"
            styles={{ body: { padding: 12 } }}
            title={<span className="text-sm font-medium">包装信息</span>}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="packageBatch"
                label="包装批次号"
                rules={[{ required: true, message: '请输入包装批次号' }]}
              >
                <Input placeholder="如：BZ20240601001" />
              </Form.Item>
              <Form.Item
                name="assemblyBatch"
                label="来源装配批次"
              >
                <Input disabled placeholder="选择振动检测后自动带出" />
              </Form.Item>
              <Form.Item
                name="bearingTypeName"
                label="轴承类型"
                rules={[{ required: true, message: '请输入轴承类型' }]}
              >
                <Input placeholder="如：深沟球轴承" />
              </Form.Item>
              <Form.Item
                name="bearingModel"
                label="轴承型号"
                rules={[{ required: true, message: '请输入轴承型号' }]}
              >
                <Input placeholder="如：6205-2RS" />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="数量(套)"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
              <Form.Item
                name="packager"
                label="包装员"
                rules={[{ required: true, message: '请输入包装员' }]}
              >
                <Input placeholder="请输入包装员姓名" />
              </Form.Item>
              <Form.Item
                name="packageDate"
                label="包装日期"
                rules={[{ required: true, message: '请选择包装日期' }]}
              >
                <Input style={{ width: '100%' }} type="datetime-local" />
              </Form.Item>
              <Form.Item
                name="rustProof"
                label="防锈方式"
                rules={[{ required: true, message: '请选择防锈方式' }]}
              >
                <Select
                  options={[
                    { label: '防锈油', value: '防锈油' },
                    { label: '防锈纸', value: '防锈纸' },
                    { label: '防锈袋', value: '防锈袋' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="storageLocation"
                label="库位"
                rules={[{ required: true, message: '请输入库位' }]}
              >
                <Input placeholder="如：A区-03-12" />
              </Form.Item>
            </div>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
