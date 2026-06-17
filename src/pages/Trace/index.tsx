import { useState } from 'react';
import { Search, Clock, Cog, Flame, Layers, CircleDot, Grid3X3, Wrench, Waves, Package, ChevronRight } from 'lucide-react';
import { Input, Button, DatePicker, Select, Card, Timeline, Tag, Empty } from 'antd';
import type { ProcessStatus } from '@/types';
import { statusTextMap } from '@/utils/mock';
import StatusTag from '@/components/StatusTag';
import PageHeader from '@/components/PageHeader';
import { useProcessStore } from '@/store/useProcessStore';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const moduleIcons: Record<string, any> = {
  '套圈车削': Cog,
  '热处理': Flame,
  '磨加工': Layers,
  '滚子配套': CircleDot,
  '保持架': Grid3X3,
  '轴承装配': Wrench,
  '振动检测': Waves,
  '成品包装': Package,
};

const moduleColors: Record<string, string> = {
  '套圈车削': 'blue',
  '热处理': 'orange',
  '磨加工': 'green',
  '滚子配套': 'cyan',
  '保持架': 'purple',
  '轴承装配': 'geekblue',
  '振动检测': 'volcano',
  '成品包装': 'gold',
};

interface TraceResult {
  batchNo: string;
  bearingType: string;
  steps: {
    name: string;
    status: ProcessStatus;
    operator: string;
    time: string;
    data: Record<string, any>;
  }[];
}

export default function Trace() {
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);
  const {
    turningProcesses,
    heatProcesses,
    grindingProcesses,
    rollerGroups,
    cageRivets,
    bearingAssemblies,
    vibrationTests,
    finishedProducts,
  } = useProcessStore();

  const handleSearch = () => {
    if (!searchText.trim()) return;
    
    setSearching(true);
    
    setTimeout(() => {
      const turning = turningProcesses.find((t) =>
        t.ringBatchNo.toLowerCase().includes(searchText.toLowerCase())
      );
      const heat = heatProcesses.find((h) =>
        h.ringBatchNo.toLowerCase().includes(searchText.toLowerCase())
      );
      const grinding = grindingProcesses.find((g) =>
        g.ringBatchNo.toLowerCase().includes(searchText.toLowerCase())
      );
      const assembly = bearingAssemblies.find((a) =>
        a.assemblyBatch.toLowerCase().includes(searchText.toLowerCase()) ||
        a.innerRingBatch.toLowerCase().includes(searchText.toLowerCase()) ||
        a.outerRingBatch.toLowerCase().includes(searchText.toLowerCase())
      );
      const vibration = vibrationTests.find((v) =>
        v.assemblyBatch.toLowerCase().includes(searchText.toLowerCase())
      );
      const finished = finishedProducts.find((f) =>
        f.packageBatch.toLowerCase().includes(searchText.toLowerCase())
      );

      const steps: TraceResult['steps'] = [];
      
      if (turning) {
        steps.push({
          name: '套圈车削',
          status: turning.status,
          operator: turning.operator,
          time: turning.startTime,
          data: {
            '批次号': turning.ringBatchNo,
            '圈类型': turning.ringType === 'inner' ? '内圈' : '外圈',
            '设备': turning.machineNo,
            '外径': `${turning.outerDiameter}mm`,
            '内径': `${turning.innerDiameter}mm`,
            '宽度': `${turning.width}mm`,
          },
        });
      }
      
      if (heat) {
        steps.push({
          name: '热处理',
          status: heat.status,
          operator: heat.operator,
          time: heat.quenchingTime,
          data: {
            '批次号': heat.ringBatchNo,
            '炉号': heat.furnaceNo,
            '淬火温度': `${heat.quenchingTemp}°C`,
            '回火温度': `${heat.temperingTemp}°C`,
            '硬度': `${heat.hardness}HRC`,
          },
        });
      }
      
      if (grinding) {
        steps.push({
          name: '磨加工',
          status: grinding.status,
          operator: grinding.operator,
          time: grinding.processTime,
          data: {
            '批次号': grinding.ringBatchNo,
            '圈类型': grinding.ringType === 'inner' ? '内圈' : '外圈',
            '设备': grinding.machineNo,
            '外径': `${grinding.outerDiameter}mm`,
            '内径': `${grinding.innerDiameter}mm`,
            '沟道粗糙度': `${grinding.grooveRoughness}μm`,
          },
        });
      }
      
      const rollerGroup = rollerGroups[0];
      if (rollerGroup) {
        steps.push({
          name: '滚子配套',
          status: 'qualified',
          operator: rollerGroup.operator,
          time: rollerGroup.groupDate,
          data: {
            '批次号': rollerGroup.rollerBatchNo,
            '分组号': rollerGroup.groupNo,
            '直径范围': `${rollerGroup.diameterMin.toFixed(4)} - ${rollerGroup.diameterMax.toFixed(4)}mm`,
            '数量': `${rollerGroup.quantity}个`,
          },
        });
      }
      
      const cage = cageRivets[0];
      if (cage) {
        steps.push({
          name: '保持架',
          status: cage.status,
          operator: cage.operator,
          time: cage.processTime,
          data: {
            '批次号': cage.cageBatchNo,
            '设备': cage.machineNo,
            '兜孔直径': `${cage.pocketDiameter}mm`,
            '兜孔间距': `${cage.pocketDistance}mm`,
          },
        });
      }
      
      if (assembly) {
        steps.push({
          name: '轴承装配',
          status: assembly.status,
          operator: assembly.operator,
          time: assembly.assemblyTime,
          data: {
            '装配批次': assembly.assemblyBatch,
            '轴承型号': assembly.bearingModel,
            '内圈批次': assembly.innerRingBatch,
            '外圈批次': assembly.outerRingBatch,
            '滚子组号': assembly.rollerGroupNo,
            '保持架批次': assembly.cageBatch,
            '径向游隙': `${assembly.radialClearance}mm`,
            '数量': `${assembly.quantity}套`,
            '清洗注脂': assembly.cleaningGreasing ? '已完成' : '未完成',
          },
        });
      }
      
      if (vibration) {
        steps.push({
          name: '振动检测',
          status: vibration.status,
          operator: vibration.tester,
          time: vibration.testTime,
          data: {
            '装配批次': vibration.assemblyBatch,
            '转速': `${vibration.rotationSpeed}r/min`,
            '振动值': `${vibration.vibrationValue}mm/s`,
            '噪声': `${vibration.noiseDb}dB`,
            '旋转灵活度': vibration.rotationSmooth ? '灵活' : '卡滞',
          },
        });
      }
      
      if (finished) {
        steps.push({
          name: '成品包装',
          status: 'qualified',
          operator: finished.packager,
          time: finished.packageDate,
          data: {
            '包装批次': finished.packageBatch,
            '轴承型号': finished.bearingModel,
            '数量': `${finished.quantity}套`,
            '防锈方式': finished.rustProof,
            '库位': finished.storageLocation,
          },
        });
      }

      if (steps.length > 0) {
        const firstStep = steps[0];
        setTraceResult({
          batchNo: searchText,
          bearingType: turning?.bearingTypeName || heat?.bearingTypeName || grinding?.bearingTypeName || '深沟球轴承',
          steps,
        });
      } else {
        setTraceResult(null);
      }
      
      setSearching(false);
    }, 800);
  };

  return (
    <div>
      <PageHeader
        icon={Search}
        title="数据查询"
        description="全流程批次追溯，查询轴承从原材料到成品的完整生产记录"
      />

      <Card className="card border-none shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <Input
              size="large"
              placeholder="输入批次号进行追溯查询（如：TQ、RC、MJ、ZP等开头）"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<Search size={18} className="text-neutral-400" />}
              allowClear
            />
          </div>
          <RangePicker size="large" placeholder={['开始日期', '结束日期']} />
          <Select
            size="large"
            placeholder="工序筛选"
            style={{ width: 150 }}
            allowClear
            options={[
              { label: '全部工序', value: 'all' },
              { label: '套圈车削', value: 'turning' },
              { label: '热处理', value: 'heat' },
              { label: '磨加工', value: 'grinding' },
              { label: '滚子配套', value: 'roller' },
              { label: '保持架', value: 'cage' },
              { label: '轴承装配', value: 'assembly' },
              { label: '振动检测', value: 'vibration' },
            ]}
          />
          <Button
            type="primary"
            size="large"
            icon={<Search size={18} />}
            loading={searching}
            onClick={handleSearch}
          >
            查询
          </Button>
        </div>
      </Card>

      {traceResult ? (
        <div className="animate-fade-in">
          <Card className="card border-none shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Package size={28} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-700">批次追溯结果</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Tag color="blue" className="font-mono">{traceResult.batchNo}</Tag>
                    <span className="text-sm text-neutral-500">{traceResult.bearingType}</span>
                    <span className="text-sm text-neutral-500">共 {traceResult.steps.length} 道工序</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button icon={<ChevronRight size={16} />} type="primary" ghost>
                  导出报告
                </Button>
              </div>
            </div>
          </Card>

          <Card title="工序流转时间轴" className="card border-none shadow-sm">
            <Timeline
              mode="left"
              items={traceResult.steps.map((step, index) => {
                const Icon = moduleIcons[step.name] || Clock;
                const color = moduleColors[step.name] || 'blue';
                const isLast = index === traceResult.steps.length - 1;
                return {
                  color: step.status === 'unqualified' ? 'red' : color,
                  dot: (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'unqualified' ? 'bg-red-100' : `bg-${color}-100`}`}>
                      <Icon size={18} className={step.status === 'unqualified' ? 'text-red-600' : `text-${color}-600`} />
                    </div>
                  ),
                  children: (
                    <div className={`pb-6 ${!isLast ? 'border-l-2 border-neutral-100 ml-5 pl-6' : 'ml-5 pl-6'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-neutral-700">{step.name}</span>
                          <StatusTag status={step.status} size="small" />
                        </div>
                        <span className="text-xs text-neutral-400">{step.time}</span>
                      </div>
                      <div className="text-sm text-neutral-500 mb-2">
                        操作员: <span className="text-neutral-700">{step.operator}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(step.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1 px-3 bg-neutral-50 rounded">
                            <span className="text-neutral-500 text-xs">{key}:</span>
                            <span className="text-neutral-700 text-xs font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                };
              })}
            />
          </Card>
        </div>
      ) : (
        <Card className="card border-none shadow-sm">
          <Empty
            description={
              <div className="text-neutral-500">
                <p className="mb-2">请输入批次号进行追溯查询</p>
                <p className="text-xs text-neutral-400">支持查询套圈、滚子、保持架、装配、成品等各环节批次</p>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
}
