import { useState, useMemo } from 'react';
import { Search, Clock, Cog, Flame, Layers, CircleDot, Grid3X3, Wrench, Waves, Package, ChevronRight, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { Input, Button, DatePicker, Select, Card, Timeline, Tag, Empty, Space, Tooltip, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import type { ProcessStatus } from '@/types';
import { statusTextMap } from '@/utils/mock';
import StatusTag from '@/components/StatusTag';
import PageHeader from '@/components/PageHeader';
import { useProcessStore } from '@/store/useProcessStore';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

type ProcessModule = 'turning' | 'heat' | 'grinding' | 'roller' | 'cage' | 'assembly' | 'vibration' | 'finished';

interface TraceStep {
  module: ProcessModule;
  name: string;
  status: ProcessStatus;
  operator: string;
  time: string;
  batchNo: string;
  data: Record<string, any>;
}

interface TraceChain {
  id: string;
  rootBatch: string;
  bearingType: string;
  bearingModel?: string;
  steps: TraceStep[];
  totalSteps: number;
  completedSteps: number;
  hasIssue: boolean;
}

const moduleConfig: Record<ProcessModule, { name: string; icon: any; color: string }> = {
  turning: { name: '套圈车削', icon: Cog, color: 'blue' },
  heat: { name: '热处理', icon: Flame, color: 'orange' },
  grinding: { name: '磨加工', icon: Layers, color: 'green' },
  roller: { name: '滚子配套', icon: CircleDot, color: 'cyan' },
  cage: { name: '保持架', icon: Grid3X3, color: 'purple' },
  assembly: { name: '轴承装配', icon: Wrench, color: 'geekblue' },
  vibration: { name: '振动检测', icon: Waves, color: 'volcano' },
  finished: { name: '成品包装', icon: Package, color: 'gold' },
};

const bgColorMap: Record<string, string> = {
  blue: 'bg-blue-100',
  orange: 'bg-orange-100',
  green: 'bg-green-100',
  cyan: 'bg-cyan-100',
  purple: 'bg-purple-100',
  geekblue: 'bg-indigo-100',
  volcano: 'bg-red-100',
  gold: 'bg-yellow-100',
  red: 'bg-red-100',
};

const textColorMap: Record<string, string> = {
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  green: 'text-green-600',
  cyan: 'text-cyan-600',
  purple: 'text-purple-600',
  geekblue: 'text-indigo-600',
  volcano: 'text-red-600',
  gold: 'text-yellow-600',
  red: 'text-red-600',
};

export default function Trace() {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [selectedModules, setSelectedModules] = useState<ProcessModule[]>([]);
  const [selectedChain, setSelectedChain] = useState<TraceChain | null>(null);
  
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

  const traceChains = useMemo<TraceChain[]>(() => {
    const chains: TraceChain[] = [];
    const usedAssemblyIds = new Set<string>();
    const usedRingBatches = new Set<string>();

    bearingAssemblies.forEach((assembly) => {
      if (usedAssemblyIds.has(assembly.id)) return;
      
      const steps: TraceStep[] = [];
      
      const innerTurning = turningProcesses.find(t => t.ringBatchNo === assembly.innerRingBatch);
      const outerTurning = turningProcesses.find(t => t.ringBatchNo === assembly.outerRingBatch);
      
      if (innerTurning) {
        usedRingBatches.add(innerTurning.ringBatchNo);
        const innerHeat = heatProcesses.find(h => h.ringBatchNo === innerTurning.ringBatchNo);
        const innerGrinding = grindingProcesses.find(g => g.ringBatchNo === innerTurning.ringBatchNo);
        
        steps.push({
          module: 'turning',
          name: '套圈车削（内圈）',
          status: innerTurning.status,
          operator: innerTurning.operator,
          time: innerTurning.startTime,
          batchNo: innerTurning.ringBatchNo,
          data: {
            '圈类型': '内圈',
            '设备': innerTurning.machineNo,
            '外径': `${innerTurning.outerDiameter}mm`,
            '内径': `${innerTurning.innerDiameter}mm`,
            '宽度': `${innerTurning.width}mm`,
            '备注': innerTurning.remark || '-',
          },
        });
        
        if (innerHeat) {
          steps.push({
            module: 'heat',
            name: '热处理（内圈）',
            status: innerHeat.status,
            operator: innerHeat.operator,
            time: innerHeat.quenchingTime,
            batchNo: innerHeat.ringBatchNo,
            data: {
              '圈类型': '内圈',
              '炉号': innerHeat.furnaceNo,
              '淬火温度': `${innerHeat.quenchingTemp}°C`,
              '回火温度': `${innerHeat.temperingTemp}°C`,
              '硬度': `${innerHeat.hardness}HRC`,
            },
          });
        }
        
        if (innerGrinding) {
          steps.push({
            module: 'grinding',
            name: '磨加工（内圈）',
            status: innerGrinding.status,
            operator: innerGrinding.operator,
            time: innerGrinding.processTime,
            batchNo: innerGrinding.ringBatchNo,
            data: {
              '圈类型': '内圈',
              '设备': innerGrinding.machineNo,
              '外径': `${innerGrinding.outerDiameter}mm`,
              '内径': `${innerGrinding.innerDiameter}mm`,
              '沟道粗糙度': `${innerGrinding.grooveRoughness}μm`,
            },
          });
        }
      }
      
      if (outerTurning && outerTurning.ringBatchNo !== innerTurning?.ringBatchNo) {
        usedRingBatches.add(outerTurning.ringBatchNo);
        const outerHeat = heatProcesses.find(h => h.ringBatchNo === outerTurning.ringBatchNo);
        const outerGrinding = grindingProcesses.find(g => g.ringBatchNo === outerTurning.ringBatchNo);
        
        steps.push({
          module: 'turning',
          name: '套圈车削（外圈）',
          status: outerTurning.status,
          operator: outerTurning.operator,
          time: outerTurning.startTime,
          batchNo: outerTurning.ringBatchNo,
          data: {
            '圈类型': '外圈',
            '设备': outerTurning.machineNo,
            '外径': `${outerTurning.outerDiameter}mm`,
            '内径': `${outerTurning.innerDiameter}mm`,
            '宽度': `${outerTurning.width}mm`,
            '备注': outerTurning.remark || '-',
          },
        });
        
        if (outerHeat) {
          steps.push({
            module: 'heat',
            name: '热处理（外圈）',
            status: outerHeat.status,
            operator: outerHeat.operator,
            time: outerHeat.quenchingTime,
            batchNo: outerHeat.ringBatchNo,
            data: {
              '圈类型': '外圈',
              '炉号': outerHeat.furnaceNo,
              '淬火温度': `${outerHeat.quenchingTemp}°C`,
              '回火温度': `${outerHeat.temperingTemp}°C`,
              '硬度': `${outerHeat.hardness}HRC`,
            },
          });
        }
        
        if (outerGrinding) {
          steps.push({
            module: 'grinding',
            name: '磨加工（外圈）',
            status: outerGrinding.status,
            operator: outerGrinding.operator,
            time: outerGrinding.processTime,
            batchNo: outerGrinding.ringBatchNo,
            data: {
              '圈类型': '外圈',
              '设备': outerGrinding.machineNo,
              '外径': `${outerGrinding.outerDiameter}mm`,
              '内径': `${outerGrinding.innerDiameter}mm`,
              '沟道粗糙度': `${outerGrinding.grooveRoughness}μm`,
            },
          });
        }
      }
      
      const roller = rollerGroups.find(r => r.groupNo === assembly.rollerGroupNo);
      if (roller) {
        steps.push({
          module: 'roller',
          name: '滚子配套',
          status: 'qualified',
          operator: roller.operator,
          time: roller.groupDate,
          batchNo: roller.rollerBatchNo,
          data: {
            '分组号': roller.groupNo,
            '直径范围': `${roller.diameterMin.toFixed(4)} - ${roller.diameterMax.toFixed(4)}mm`,
            '数量': `${roller.quantity}个`,
            '轴承类型': roller.bearingTypeName,
          },
        });
      }
      
      const cage = cageRivets.find(c => c.cageBatchNo === assembly.cageBatch);
      if (cage) {
        steps.push({
          module: 'cage',
          name: '保持架铆合',
          status: cage.status,
          operator: cage.operator,
          time: cage.processTime,
          batchNo: cage.cageBatchNo,
          data: {
            '设备': cage.machineNo,
            '兜孔直径': `${cage.pocketDiameter}mm`,
            '兜孔间距': `${cage.pocketDistance}mm`,
            '轴承类型': cage.bearingTypeName,
          },
        });
      }
      
      steps.push({
        module: 'assembly',
        name: '轴承装配',
        status: assembly.status,
        operator: assembly.operator,
        time: assembly.assemblyTime,
        batchNo: assembly.assemblyBatch,
        data: {
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
      
      usedAssemblyIds.add(assembly.id);
      
      const vibration = vibrationTests.find(v => v.assemblyBatch === assembly.assemblyBatch);
      if (vibration) {
        steps.push({
          module: 'vibration',
          name: '振动检测',
          status: vibration.status,
          operator: vibration.tester,
          time: vibration.testTime,
          batchNo: vibration.assemblyBatch,
          data: {
            '转速': `${vibration.rotationSpeed}r/min`,
            '振动值': `${vibration.vibrationValue}mm/s`,
            '噪声': `${vibration.noiseDb}dB`,
            '旋转灵活度': vibration.rotationSmooth ? '灵活' : '卡滞',
          },
        });
      }
      
      const finished = finishedProducts.find(f => f.bearingModel === assembly.bearingModel);
      if (finished) {
        steps.push({
          module: 'finished',
          name: '成品包装',
          status: 'qualified',
          operator: finished.packager,
          time: finished.packageDate,
          batchNo: finished.packageBatch,
          data: {
            '包装批次': finished.packageBatch,
            '轴承型号': finished.bearingModel,
            '数量': `${finished.quantity}套`,
            '防锈方式': finished.rustProof,
            '库位': finished.storageLocation,
          },
        });
      }
      
      const totalSteps = 8;
      const completedSteps = steps.filter(s => s.status === 'qualified' || s.status === 'completed').length;
      const hasIssue = steps.some(s => s.status === 'unqualified');
      
      chains.push({
        id: assembly.id,
        rootBatch: assembly.assemblyBatch,
        bearingType: assembly.bearingTypeName,
        bearingModel: assembly.bearingModel,
        steps,
        totalSteps,
        completedSteps,
        hasIssue,
      });
    });

    turningProcesses.forEach((turning) => {
      if (usedRingBatches.has(turning.ringBatchNo)) return;
      
      const steps: TraceStep[] = [];
      const heat = heatProcesses.find(h => h.ringBatchNo === turning.ringBatchNo);
      const grinding = grindingProcesses.find(g => g.ringBatchNo === turning.ringBatchNo);
      
      steps.push({
        module: 'turning',
        name: `套圈车削（${turning.ringType === 'inner' ? '内圈' : '外圈'}）`,
        status: turning.status,
        operator: turning.operator,
        time: turning.startTime,
        batchNo: turning.ringBatchNo,
        data: {
          '圈类型': turning.ringType === 'inner' ? '内圈' : '外圈',
          '设备': turning.machineNo,
          '外径': `${turning.outerDiameter}mm`,
          '内径': `${turning.innerDiameter}mm`,
          '宽度': `${turning.width}mm`,
        },
      });
      
      if (heat) {
        steps.push({
          module: 'heat',
          name: `热处理（${turning.ringType === 'inner' ? '内圈' : '外圈'}）`,
          status: heat.status,
          operator: heat.operator,
          time: heat.quenchingTime,
          batchNo: heat.ringBatchNo,
          data: {
            '炉号': heat.furnaceNo,
            '淬火温度': `${heat.quenchingTemp}°C`,
            '回火温度': `${heat.temperingTemp}°C`,
            '硬度': `${heat.hardness}HRC`,
          },
        });
      }
      
      if (grinding) {
        steps.push({
          module: 'grinding',
          name: `磨加工（${turning.ringType === 'inner' ? '内圈' : '外圈'}）`,
          status: grinding.status,
          operator: grinding.operator,
          time: grinding.processTime,
          batchNo: grinding.ringBatchNo,
          data: {
            '设备': grinding.machineNo,
            '外径': `${grinding.outerDiameter}mm`,
            '内径': `${grinding.innerDiameter}mm`,
            '沟道粗糙度': `${grinding.grooveRoughness}μm`,
          },
        });
      }
      
      const hasIssue = steps.some(s => s.status === 'unqualified');
      
      chains.push({
        id: turning.id,
        rootBatch: turning.ringBatchNo,
        bearingType: turning.bearingTypeName,
        steps,
        totalSteps: 3,
        completedSteps: steps.filter(s => s.status === 'qualified' || s.status === 'completed').length,
        hasIssue,
      });
    });

    return chains.sort((a, b) => {
      const timeA = a.steps[0]?.time || '';
      const timeB = b.steps[0]?.time || '';
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  }, [turningProcesses, heatProcesses, grindingProcesses, rollerGroups, cageRivets, bearingAssemblies, vibrationTests, finishedProducts]);

  const filteredChains = useMemo(() => {
    let result = [...traceChains];
    
    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      result = result.filter(chain => 
        chain.rootBatch.toLowerCase().includes(keyword) ||
        chain.bearingType.toLowerCase().includes(keyword) ||
        chain.bearingModel?.toLowerCase().includes(keyword) ||
        chain.steps.some(step => step.batchNo.toLowerCase().includes(keyword))
      );
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day');
      const end = dateRange[1].endOf('day');
      result = result.filter(chain => 
        chain.steps.some(step => {
          const stepTime = dayjs(step.time);
          return stepTime.isAfter(start) && stepTime.isBefore(end);
        })
      );
    }
    
    if (selectedModules.length > 0) {
      result = result.filter(chain => 
        chain.steps.some(step => selectedModules.includes(step.module))
      );
    }
    
    return result;
  }, [traceChains, searchText, dateRange, selectedModules]);

  const displaySteps = useMemo(() => {
    if (!selectedChain) return [];
    
    if (selectedModules.length === 0) return selectedChain.steps;
    
    return selectedChain.steps.filter(step => selectedModules.includes(step.module));
  }, [selectedChain, selectedModules]);

  const handleChainClick = (chain: TraceChain) => {
    setSelectedChain(chain);
  };

  const handleBackToList = () => {
    setSelectedChain(null);
  };

  return (
    <div>
      <PageHeader
        icon={Search}
        title="数据查询"
        description="全流程批次追溯，查询轴承从原材料到成品的完整生产记录"
      />

      <Card className="card border-none shadow-sm mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm text-neutral-500 mb-2">批次号搜索</label>
            <Input
              size="large"
              placeholder="输入批次号或轴承型号（如：TQ、ZP、6205等）"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<Search size={18} className="text-neutral-400" />}
              allowClear
            />
          </div>
          <div className="min-w-[280px]">
            <label className="block text-sm text-neutral-500 mb-2">日期范围</label>
            <RangePicker 
              size="large" 
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
              allowClear
            />
          </div>
          <div className="min-w-[280px]">
            <label className="block text-sm text-neutral-500 mb-2">
              <Space>
                <Filter size={14} />
                工序筛选
              </Space>
            </label>
            <Select
              size="large"
              mode="multiple"
              placeholder="选择要显示的工序"
              style={{ width: '100%' }}
              value={selectedModules}
              onChange={setSelectedModules}
              options={Object.entries(moduleConfig).map(([key, config]) => ({
                label: config.name,
                value: key,
              }))}
              allowClear
              maxTagCount={3}
            />
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Search size={18} />}
            onClick={() => {}}
          >
            查询
          </Button>
        </div>
      </Card>

      {selectedChain ? (
        <div className="animate-fade-in">
          <Card className="card border-none shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 transition-colors"
                >
                  <ChevronRight size={18} className="rotate-180" />
                  <span>返回列表</span>
                </button>
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Package size={28} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-700">批次追溯详情</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Tag color="blue" className="font-mono">{selectedChain.rootBatch}</Tag>
                    <span className="text-sm text-neutral-500">{selectedChain.bearingType}</span>
                    {selectedChain.bearingModel && (
                      <Tag color="purple">{selectedChain.bearingModel}</Tag>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-700">{selectedChain.steps.length}</div>
                  <div className="text-xs text-neutral-500">工序总数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{selectedChain.completedSteps}</div>
                  <div className="text-xs text-neutral-500">已完成</div>
                </div>
                {selectedChain.hasIssue && (
                  <Badge status="error" text="有不合格项" />
                )}
              </div>
            </div>
          </Card>

          <Card title="工序流转时间轴" className="card border-none shadow-sm">
            {displaySteps.length > 0 ? (
              <Timeline
                mode="left"
                items={displaySteps.map((step, index) => {
                  const config = moduleConfig[step.module];
                  const Icon = config.icon;
                  const color = config.color;
                  const isLast = index === displaySteps.length - 1;
                  const hasIssue = step.status === 'unqualified';
                  const finalColor = hasIssue ? 'red' : color;
                  
                  return {
                    color: finalColor,
                    dot: (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColorMap[finalColor] || 'bg-blue-100'}`}>
                        <Icon size={18} className={textColorMap[finalColor] || 'text-blue-600'} />
                      </div>
                    ),
                    children: (
                      <div className={`pb-6 ${!isLast ? 'border-l-2 border-neutral-100 ml-5 pl-6' : 'ml-5 pl-6'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-neutral-700">{step.name}</span>
                            <StatusTag status={step.status} size="small" />
                            <Tag color={color} className="font-mono text-xs">{step.batchNo}</Tag>
                          </div>
                          <span className="text-xs text-neutral-400">{step.time}</span>
                        </div>
                        <div className="text-sm text-neutral-500 mb-2">
                          操作员: <span className="text-neutral-700">{step.operator}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {Object.entries(step.data).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1.5 px-3 bg-neutral-50 rounded-lg">
                              <span className="text-neutral-500 text-xs">{key}</span>
                              <span className="text-neutral-700 text-xs font-mono">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  };
                })}
              />
            ) : (
              <Empty description="当前筛选条件下没有工序数据" />
            )}
          </Card>
        </div>
      ) : (
        <Card 
          title={
            <div className="flex items-center justify-between">
              <span>追溯链列表</span>
              <span className="text-sm text-neutral-500 font-normal">
                共 {filteredChains.length} 条追溯链
              </span>
            </div>
          } 
          className="card border-none shadow-sm"
        >
          {filteredChains.length > 0 ? (
            <div className="space-y-3">
              {filteredChains.map((chain) => (
                <div
                  key={chain.id}
                  onClick={() => handleChainClick(chain)}
                  className="p-4 border border-neutral-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/50 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package size={22} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-700">{chain.rootBatch}</span>
                          {chain.hasIssue ? (
                            <Tooltip title="存在不合格项">
                              <XCircle size={16} className="text-danger-500" />
                            </Tooltip>
                          ) : (
                            <Tooltip title="全部合格">
                              <CheckCircle2 size={16} className="text-success-500" />
                            </Tooltip>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Tag color="blue" className="text-xs">{chain.bearingType}</Tag>
                          {chain.bearingModel && (
                            <Tag color="purple" className="text-xs">{chain.bearingModel}</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="hidden md:block">
                        <div className="flex -space-x-2">
                          {chain.steps.slice(0, 6).map((step, i) => {
                            const config = moduleConfig[step.module];
                            const Icon = config.icon;
                            return (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${bgColorMap[config.color]}`}
                                title={config.name}
                              >
                                <Icon size={14} className={textColorMap[config.color]} />
                              </div>
                            );
                          })}
                          {chain.steps.length > 6 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center">
                              <span className="text-xs text-neutral-600">+{chain.steps.length - 6}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-neutral-500">进度:</span>
                          <span className="font-semibold text-primary-600">
                            {chain.completedSteps}/{chain.totalSteps}
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-neutral-100 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${chain.hasIssue ? 'bg-danger-500' : 'bg-success-500'}`}
                            style={{ width: `${(chain.completedSteps / chain.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <ChevronRight size={20} className="text-neutral-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              description={
                <div className="text-neutral-500">
                  <p className="mb-2">没有找到匹配的追溯链</p>
                  <p className="text-xs text-neutral-400">请尝试调整搜索条件或筛选条件</p>
                </div>
              }
            />
          )}
        </Card>
      )}
    </div>
  );
}
