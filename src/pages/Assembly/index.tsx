import { useState, useMemo } from 'react';
import { Wrench, Calculator, CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { useProcessStore } from '@/store/useProcessStore';
import ProcessPage from '@/components/ProcessPage';
import type { BearingAssembly, GrindingProcess, RollerGroup } from '@/types';
import { message, Tag, Card, Form, Select, InputNumber, Button, Space, Alert, Descriptions, Divider, Drawer } from 'antd';
import PageHeader from '@/components/PageHeader';
import StatusTag from '@/components/StatusTag';

export default function Assembly() {
  const {
    bearingAssemblies,
    grindingProcesses,
    rollerGroups,
    addBearingAssembly,
    updateBearingAssembly,
    deleteBearingAssembly,
    initMockData,
  } = useProcessStore();

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectForm] = Form.useForm();
  const [calcResult, setCalcResult] = useState<null | {
    isCompatible: boolean;
    theoreticalClearance: number;
    clearanceRange: { min: number; max: number };
    recommendedClearance: { min: number; max: number };
    issues: string[];
    suggestions: string[];
    innerRing?: GrindingProcess;
    outerRing?: GrindingProcess;
    rollerGroup?: RollerGroup;
  }>(null);

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

  const innerRingOptions = useMemo(() => {
    const innerRings = grindingProcesses.filter(g => g.ringType === 'inner' && g.status === 'qualified');
    const uniqueBatches = new Map<string, GrindingProcess>();
    innerRings.forEach(ring => {
      if (!uniqueBatches.has(ring.ringBatchNo)) {
        uniqueBatches.set(ring.ringBatchNo, ring);
      }
    });
    return Array.from(uniqueBatches.values()).map(ring => ({
      label: `${ring.ringBatchNo} (${ring.bearingTypeName})`,
      value: ring.ringBatchNo,
      data: ring,
    }));
  }, [grindingProcesses]);

  const outerRingOptions = useMemo(() => {
    const outerRings = grindingProcesses.filter(g => g.ringType === 'outer' && g.status === 'qualified');
    const uniqueBatches = new Map<string, GrindingProcess>();
    outerRings.forEach(ring => {
      if (!uniqueBatches.has(ring.ringBatchNo)) {
        uniqueBatches.set(ring.ringBatchNo, ring);
      }
    });
    return Array.from(uniqueBatches.values()).map(ring => ({
      label: `${ring.ringBatchNo} (${ring.bearingTypeName})`,
      value: ring.ringBatchNo,
      data: ring,
    }));
  }, [grindingProcesses]);

  const rollerOptions = useMemo(() => {
    const uniqueGroups = new Map<string, RollerGroup>();
    rollerGroups.forEach(group => {
      if (!uniqueGroups.has(group.groupNo)) {
        uniqueGroups.set(group.groupNo, group);
      }
    });
    return Array.from(uniqueGroups.values()).map(group => ({
      label: `${group.groupNo} (φ${group.diameterMin.toFixed(4)}-${group.diameterMax.toFixed(4)}mm)`,
      value: group.groupNo,
      data: group,
    }));
  }, [rollerGroups]);

  const handleCalculate = () => {
    const innerBatch = selectForm.getFieldValue('innerRingBatch');
    const outerBatch = selectForm.getFieldValue('outerRingBatch');
    const rollerGroupNo = selectForm.getFieldValue('rollerGroupNo');
    const targetClearance = selectForm.getFieldValue('targetClearance');

    if (!innerBatch || !outerBatch || !rollerGroupNo) {
      message.warning('请选择内圈、外圈和滚子分组');
      return;
    }

    const innerRing = innerRingOptions.find(o => o.value === innerBatch)?.data;
    const outerRing = outerRingOptions.find(o => o.value === outerBatch)?.data;
    const rollerGroup = rollerOptions.find(o => o.value === rollerGroupNo)?.data;

    if (!innerRing || !outerRing || !rollerGroup) return;

    const issues: string[] = [];
    const suggestions: string[] = [];

    if (innerRing.bearingTypeName !== outerRing.bearingTypeName) {
      issues.push(`内圈类型(${innerRing.bearingTypeName})与外圈类型(${outerRing.bearingTypeName})不匹配`);
    }

    const innerOuterDiameter = innerRing.outerDiameter;
    const outerInnerDiameter = outerRing.innerDiameter;
    const spaceWidth = outerInnerDiameter - innerOuterDiameter;

    const rollerDiameterMin = rollerGroup.diameterMin;
    const rollerDiameterMax = rollerGroup.diameterMax;

    const clearanceMin = spaceWidth - 2 * rollerDiameterMax;
    const clearanceMax = spaceWidth - 2 * rollerDiameterMin;
    const theoreticalClearance = (clearanceMin + clearanceMax) / 2;

    const bearingType = innerRing.bearingTypeName;
    let recMin = 0.005;
    let recMax = 0.020;
    
    if (bearingType.includes('深沟球')) {
      recMin = 0.008;
      recMax = 0.025;
    } else if (bearingType.includes('圆柱滚子')) {
      recMin = 0.010;
      recMax = 0.035;
    } else if (bearingType.includes('圆锥滚子')) {
      recMin = 0.015;
      recMax = 0.040;
    }

    const isInRange = targetClearance 
      ? targetClearance >= clearanceMin && targetClearance <= clearanceMax
      : theoreticalClearance >= recMin && theoreticalClearance <= recMax;

    const isCompatibleWithRec = theoreticalClearance >= recMin && theoreticalClearance <= recMax;

    if (!isInRange && targetClearance) {
      if (targetClearance < clearanceMin) {
        issues.push(`目标游隙(${targetClearance}mm)小于实际可达到的最小游隙(${clearanceMin.toFixed(4)}mm)`);
        suggestions.push('选择直径更大的滚子分组');
        suggestions.push('增大内圈外径或减小外圈内径');
      } else {
        issues.push(`目标游隙(${targetClearance}mm)大于实际可达到的最大游隙(${clearanceMax.toFixed(4)}mm)`);
        suggestions.push('选择直径更小的滚子分组');
        suggestions.push('减小内圈外径或增大外圈内径');
      }
    }

    if (!isCompatibleWithRec) {
      if (theoreticalClearance < recMin) {
        issues.push(`理论游隙(${theoreticalClearance.toFixed(4)}mm)小于推荐范围(${recMin}-${recMax}mm)`);
        suggestions.push('建议选择直径更小的滚子分组以增大游隙');
      } else {
        issues.push(`理论游隙(${theoreticalClearance.toFixed(4)}mm)大于推荐范围(${recMin}-${recMax}mm)`);
        suggestions.push('建议选择直径更大的滚子分组以减小游隙');
      }
    }

    if (rollerGroup.quantity < 10) {
      issues.push(`滚子分组数量不足(仅${rollerGroup.quantity}个)`);
      suggestions.push('请选择数量充足的滚子分组');
    }

    setCalcResult({
      isCompatible: issues.length === 0,
      theoreticalClearance: parseFloat(theoreticalClearance.toFixed(4)),
      clearanceRange: { 
        min: parseFloat(clearanceMin.toFixed(4)), 
        max: parseFloat(clearanceMax.toFixed(4)) 
      },
      recommendedClearance: { min: recMin, max: recMax },
      issues,
      suggestions,
      innerRing,
      outerRing,
      rollerGroup,
    });
  };

  const handleClearCalc = () => {
    setCalcResult(null);
    selectForm.resetFields();
  };

  return (
    <div>
      <PageHeader
        icon={Wrench}
        title="轴承装配"
        description="管理轴承游隙选配、合套装配、清洗注脂等装配工序记录"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<Calculator size={16} />}
              onClick={() => setSelectorVisible(true)}
            >
              游隙选配辅助
            </Button>
          </Space>
        }
      />

      <ProcessPage<BearingAssembly>
        title=""
        description=""
        icon={Wrench}
        data={bearingAssemblies}
        columns={columns}
        fields={fields}
        onAdd={addBearingAssembly}
        onUpdate={updateBearingAssembly}
        onDelete={deleteBearingAssembly}
        onRefresh={handleRefresh}
      />

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-primary-600" />
            <span>游隙选配辅助计算</span>
          </div>
        }
        width={720}
        open={selectorVisible}
        onClose={() => setSelectorVisible(false)}
        extra={
          <Space>
            <Button onClick={handleClearCalc}>清空</Button>
            <Button type="primary" icon={<Calculator size={14} />} onClick={handleCalculate}>
              计算适配
            </Button>
          </Space>
        }
      >
        <Card title="选配参数" className="mb-4" styles={{ body: { padding: 16 } }}>
          <Form
            form={selectForm}
            layout="vertical"
            initialValues={{ targetClearance: 0.015 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="innerRingBatch"
                label="内圈批次（磨加工合格）"
                rules={[{ required: true, message: '请选择内圈批次' }]}
              >
                <Select
                  showSearch
                  placeholder="选择内圈批次"
                  options={innerRingOptions}
                  optionFilterProp="label"
                />
              </Form.Item>
              <Form.Item
                name="outerRingBatch"
                label="外圈批次（磨加工合格）"
                rules={[{ required: true, message: '请选择外圈批次' }]}
              >
                <Select
                  showSearch
                  placeholder="选择外圈批次"
                  options={outerRingOptions}
                  optionFilterProp="label"
                />
              </Form.Item>
              <Form.Item
                name="rollerGroupNo"
                label="滚子分组"
                rules={[{ required: true, message: '请选择滚子分组' }]}
              >
                <Select
                  showSearch
                  placeholder="选择滚子分组"
                  options={rollerOptions}
                  optionFilterProp="label"
                />
              </Form.Item>
              <Form.Item
                name="targetClearance"
                label="目标径向游隙(mm)"
                rules={[{ required: true, message: '请输入目标游隙' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.001}
                  precision={4}
                  placeholder="请输入目标游隙"
                />
              </Form.Item>
            </div>
          </Form>
        </Card>

        {calcResult && (
          <div className="animate-fade-in">
            <Card
              className="mb-4"
              styles={{ body: { padding: 16 } }}
              title={
                <div className="flex items-center gap-2">
                  {calcResult.isCompatible ? (
                    <CheckCircle size={20} className="text-success-500" />
                  ) : (
                    <XCircle size={20} className="text-danger-500" />
                  )}
                  <span>
                    {calcResult.isCompatible ? '适配合格' : '存在适配问题'}
                  </span>
                </div>
              }
            >
              <Alert
                type={calcResult.isCompatible ? 'success' : 'warning'}
                showIcon
                icon={calcResult.isCompatible ? <CheckCircle /> : <AlertTriangle />}
                message={
                  calcResult.isCompatible 
                    ? '所选配件可以正常装配，游隙在合理范围内'
                    : `发现 ${calcResult.issues.length} 个适配问题，请查看下方详情`
                }
              />

              <Divider orientation="left" plain className="my-3">
                <span className="text-sm font-medium">尺寸参数</span>
              </Divider>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-primary-50 rounded-lg text-center">
                  <div className="text-xs text-neutral-500 mb-1">内圈外径</div>
                  <div className="text-lg font-bold font-mono text-primary-600">
                    {calcResult.innerRing?.outerDiameter} mm
                  </div>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg text-center">
                  <div className="text-xs text-neutral-500 mb-1">外圈内径</div>
                  <div className="text-lg font-bold font-mono text-primary-600">
                    {calcResult.outerRing?.innerDiameter} mm
                  </div>
                </div>
                <div className="p-3 bg-warning-50 rounded-lg text-center">
                  <div className="text-xs text-neutral-500 mb-1">滚子直径范围</div>
                  <div className="text-sm font-bold font-mono text-warning-600">
                    {calcResult.rollerGroup?.diameterMin.toFixed(4)} - {calcResult.rollerGroup?.diameterMax.toFixed(4)} mm
                  </div>
                </div>
              </div>

              <Divider orientation="left" plain className="my-3">
                <span className="text-sm font-medium">游隙计算结果</span>
              </Divider>

              <Descriptions column={2} size="small" className="mb-4">
                <Descriptions.Item label="理论游隙">
                  <span className="font-mono font-semibold text-primary-600">
                    {calcResult.theoreticalClearance} mm
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="实际可达游隙范围">
                  <span className="font-mono">
                    {calcResult.clearanceRange.min} - {calcResult.clearanceRange.max} mm
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="推荐游隙范围">
                  <span className="font-mono text-success-600">
                    {calcResult.recommendedClearance.min} - {calcResult.recommendedClearance.max} mm
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="滚子数量">
                  <span className="font-mono">{calcResult.rollerGroup?.quantity} 个</span>
                </Descriptions.Item>
              </Descriptions>

              {calcResult.issues.length > 0 && (
                <>
                  <Divider orientation="left" plain className="my-3">
                    <span className="text-sm font-medium text-danger-600">问题列表</span>
                  </Divider>
                  <div className="space-y-2 mb-4">
                    {calcResult.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-danger-50 rounded-lg">
                        <XCircle size={16} className="text-danger-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{issue}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {calcResult.suggestions.length > 0 && (
                <>
                  <Divider orientation="left" plain className="my-3">
                    <span className="text-sm font-medium text-primary-600">优化建议</span>
                  </Divider>
                  <div className="space-y-2">
                    {calcResult.suggestions.map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-primary-50 rounded-lg">
                        <Info size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <div className="text-center">
              <Button type="primary" size="large" icon={<Wrench size={16} />}>
                使用此选配方案创建装配记录
              </Button>
            </div>
          </div>
        )}

        {!calcResult && (
          <div className="text-center py-16 text-neutral-400">
            <Calculator size={48} className="mx-auto mb-4 opacity-30" />
            <p>选择内圈、外圈和滚子分组后</p>
            <p>点击「计算适配」按钮查看游隙适配结果</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
