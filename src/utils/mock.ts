import dayjs from 'dayjs';
import type {
  TurningProcess,
  HeatProcess,
  GrindingProcess,
  RollerGroup,
  CageRivet,
  BearingAssembly,
  VibrationTest,
  FinishedProduct,
  SysUser,
  DashboardStats,
  ProcessStatus,
} from '@/types';

const bearingTypes = ['深沟球轴承', '圆柱滚子轴承', '圆锥滚子轴承', '调心球轴承', '角接触球轴承'];
const bearingModels = ['6205', '6206', '6305', '6306', 'N205', 'N206', '30205', '30206', '1205', '1206'];
const operators = ['张师傅', '李师傅', '王师傅', '赵师傅', '刘师傅', '陈师傅', '周师傅', '吴师傅'];
const machines = ['CK6140-01', 'CK6140-02', 'CK6150-01', 'M1432-01', 'M1432-02', '3MZ201-01', '3MZ201-02'];
const furnaces = ['RT-100-01', 'RT-100-02', 'RT-150-01', 'RT-200-01'];
const statuses: ProcessStatus[] = ['pending', 'processing', 'completed', 'qualified', 'unqualified'];

function randomId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(daysAgo: number = 7): string {
  return dayjs().subtract(randomInt(0, daysAgo), 'day')
    .hour(randomInt(8, 18))
    .minute(randomInt(0, 59))
    .format('YYYY-MM-DD HH:mm:ss');
}

function randomBatchNo(prefix: string): string {
  return `${prefix}${dayjs().format('YYYYMMDD')}${String(randomInt(1, 999)).padStart(3, '0')}`;
}

export function generateTurningProcesses(count: number = 20): TurningProcess[] {
  return Array.from({ length: count }, () => {
    const status = randomItem(statuses);
    const startTime = randomDate(3);
    const endTime = status === 'pending' ? '' : dayjs(startTime).add(randomInt(1, 4), 'hour').format('YYYY-MM-DD HH:mm:ss');
    return {
      id: randomId(),
      ringId: randomId(),
      ringBatchNo: randomBatchNo('TQ'),
      ringType: randomItem(['inner', 'outer']),
      bearingTypeName: randomItem(bearingTypes),
      machineNo: randomItem(machines),
      operator: randomItem(operators),
      startTime,
      endTime,
      outerDiameter: randomFloat(50, 120),
      innerDiameter: randomFloat(25, 60),
      width: randomFloat(10, 30),
      status,
      remark: status === 'unqualified' ? '尺寸超差' : '',
    };
  });
}

export function generateHeatProcesses(count: number = 20): HeatProcess[] {
  return Array.from({ length: count }, () => {
    const status = randomItem(statuses);
    return {
      id: randomId(),
      turningId: randomId(),
      ringBatchNo: randomBatchNo('RC'),
      bearingTypeName: randomItem(bearingTypes),
      furnaceNo: randomItem(furnaces),
      operator: randomItem(operators),
      quenchingTime: randomDate(3),
      quenchingTemp: randomFloat(830, 860),
      temperingTime: randomDate(3),
      temperingTemp: randomFloat(160, 200),
      hardness: randomFloat(58, 65),
      status,
    };
  });
}

export function generateGrindingProcesses(count: number = 20): GrindingProcess[] {
  return Array.from({ length: count }, () => ({
    id: randomId(),
    heatId: randomId(),
    ringBatchNo: randomBatchNo('MJ'),
    ringType: randomItem(['inner', 'outer']),
    bearingTypeName: randomItem(bearingTypes),
    machineNo: randomItem(machines),
    operator: randomItem(operators),
    processTime: randomDate(3),
    outerDiameter: randomFloat(50, 120),
    innerDiameter: randomFloat(25, 60),
    grooveRoughness: randomFloat(0.1, 0.8),
    status: randomItem(statuses),
  }));
}

export function generateRollerGroups(count: number = 15): RollerGroup[] {
  const baseDiameter = randomFloat(10, 30);
  return Array.from({ length: count }, (_, i) => ({
    id: randomId(),
    rollerBatchNo: randomBatchNo('GZ'),
    bearingTypeName: randomItem(bearingTypes),
    groupNo: `G${String(i + 1).padStart(2, '0')}`,
    diameterMin: baseDiameter + i * 0.002,
    diameterMax: baseDiameter + i * 0.002 + 0.002,
    quantity: randomInt(800, 1500),
    operator: randomItem(operators),
    groupDate: randomDate(5),
  }));
}

export function generateCageRivets(count: number = 15): CageRivet[] {
  return Array.from({ length: count }, () => ({
    id: randomId(),
    cageBatchNo: randomBatchNo('BCJ'),
    bearingTypeName: randomItem(bearingTypes),
    machineNo: randomItem(machines),
    operator: randomItem(operators),
    processTime: randomDate(3),
    pocketDiameter: randomFloat(10, 30),
    pocketDistance: randomFloat(15, 40),
    status: randomItem(statuses),
  }));
}

export function generateBearingAssemblies(count: number = 15): BearingAssembly[] {
  return Array.from({ length: count }, () => ({
    id: randomId(),
    assemblyBatch: randomBatchNo('ZP'),
    bearingTypeName: randomItem(bearingTypes),
    bearingModel: randomItem(bearingModels),
    innerRingBatch: randomBatchNo('NJ'),
    outerRingBatch: randomBatchNo('WJ'),
    rollerGroupNo: `G${String(randomInt(1, 15)).padStart(2, '0')}`,
    cageBatch: randomBatchNo('BJ'),
    radialClearance: randomFloat(0.01, 0.05),
    operator: randomItem(operators),
    assemblyTime: randomDate(2),
    quantity: randomInt(100, 500),
    cleaningGreasing: Math.random() > 0.3,
    status: randomItem(statuses),
  }));
}

export function generateVibrationTests(count: number = 15): VibrationTest[] {
  return Array.from({ length: count }, () => ({
    id: randomId(),
    assemblyId: randomId(),
    assemblyBatch: randomBatchNo('ZP'),
    bearingTypeName: randomItem(bearingTypes),
    tester: randomItem(operators),
    testTime: randomDate(2),
    rotationSpeed: randomInt(1500, 3000),
    vibrationValue: randomFloat(0.5, 5.0),
    noiseDb: randomFloat(45, 80),
    rotationSmooth: Math.random() > 0.1,
    status: randomItem(statuses),
  }));
}

export function generateFinishedProducts(count: number = 15): FinishedProduct[] {
  return Array.from({ length: count }, () => ({
    id: randomId(),
    packageBatch: randomBatchNo('CP'),
    bearingTypeName: randomItem(bearingTypes),
    bearingModel: randomItem(bearingModels),
    quantity: randomInt(100, 500),
    packager: randomItem(operators),
    packageDate: randomDate(2),
    rustProof: randomItem(['防锈油', '防锈纸', '防锈袋']),
    storageLocation: `A-${String(randomInt(1, 10)).padStart(2, '0')}`,
  }));
}

export function generateSysUsers(): SysUser[] {
  return [
    { id: '1', username: 'admin', realName: '系统管理员', roleId: '1', roleName: '系统管理员', status: 'active' },
    { id: '2', username: 'manager', realName: '张主管', roleId: '2', roleName: '生产主管', status: 'active' },
    { id: '3', username: 'worker1', realName: '李师傅', roleId: '3', roleName: '车间操作员', status: 'active' },
    { id: '4', username: 'worker2', realName: '王师傅', roleId: '3', roleName: '车间操作员', status: 'active' },
    { id: '5', username: 'qc1', realName: '赵检验', roleId: '4', roleName: '质量检验员', status: 'active' },
    { id: '6', username: 'worker3', realName: '刘师傅', roleId: '3', roleName: '车间操作员', status: 'inactive' },
  ];
}

export function generateDashboardStats(): DashboardStats {
  const dates = Array.from({ length: 7 }, (_, i) => 
    dayjs().subtract(6 - i, 'day').format('MM-DD')
  );
  
  return {
    todayProduction: randomInt(800, 1500),
    qualifiedRate: randomFloat(92, 99, 1),
    pendingTasks: randomInt(15, 40),
    processingBatches: randomInt(8, 20),
    productionTrend: dates.map(date => ({
      date,
      output: randomInt(800, 1500),
    })),
    qualityTrend: dates.map(date => ({
      date,
      rate: randomFloat(92, 99, 1),
    })),
    moduleStats: [
      { name: '套圈车削', count: randomInt(50, 100) },
      { name: '热处理', count: randomInt(40, 80) },
      { name: '磨加工', count: randomInt(40, 80) },
      { name: '滚子配套', count: randomInt(30, 60) },
      { name: '保持架', count: randomInt(20, 50) },
      { name: '轴承装配', count: randomInt(20, 50) },
      { name: '振动检测', count: randomInt(15, 40) },
    ],
    recentTasks: Array.from({ length: 8 }, () => ({
      id: randomId(),
      module: randomItem(['套圈车削', '热处理', '磨加工', '滚子配套', '保持架', '轴承装配', '振动检测']),
      batchNo: randomBatchNo(''),
      operator: randomItem(operators),
      status: randomItem(statuses),
      time: randomDate(1),
    })),
  };
}

export const statusTextMap: Record<ProcessStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
  qualified: '合格',
  unqualified: '不合格',
};

export const ringTypeTextMap: Record<string, string> = {
  inner: '内圈',
  outer: '外圈',
};
