export type ProcessStatus = 'pending' | 'processing' | 'completed' | 'qualified' | 'unqualified';

export interface BearingType {
  id: string;
  name: string;
  model: string;
  innerDiameter: number;
  outerDiameter: number;
  width: number;
}

export interface Ring {
  id: string;
  batchNo: string;
  bearingTypeId: string;
  bearingTypeName: string;
  type: 'inner' | 'outer';
  material: string;
  quantity: number;
  productionDate: string;
}

export interface TurningProcess {
  id: string;
  ringId: string;
  ringBatchNo: string;
  ringType: 'inner' | 'outer';
  bearingTypeName: string;
  machineNo: string;
  operator: string;
  startTime: string;
  endTime: string;
  outerDiameter: number;
  innerDiameter: number;
  width: number;
  status: ProcessStatus;
  remark: string;
}

export interface HeatProcess {
  id: string;
  turningId: string;
  ringBatchNo: string;
  bearingTypeName: string;
  furnaceNo: string;
  operator: string;
  quenchingTime: string;
  quenchingTemp: number;
  temperingTime: string;
  temperingTemp: number;
  hardness: number;
  status: ProcessStatus;
}

export interface GrindingProcess {
  id: string;
  heatId: string;
  ringBatchNo: string;
  ringType: 'inner' | 'outer';
  bearingTypeName: string;
  machineNo: string;
  operator: string;
  processTime: string;
  outerDiameter: number;
  innerDiameter: number;
  grooveRoughness: number;
  status: ProcessStatus;
}

export interface Roller {
  id: string;
  batchNo: string;
  bearingTypeId: string;
  bearingTypeName: string;
  material: string;
  quantity: number;
  diameter: number;
  length: number;
}

export interface RollerGroup {
  id: string;
  rollerBatchNo: string;
  bearingTypeName: string;
  groupNo: string;
  diameterMin: number;
  diameterMax: number;
  quantity: number;
  operator: string;
  groupDate: string;
}

export interface Cage {
  id: string;
  batchNo: string;
  bearingTypeId: string;
  bearingTypeName: string;
  material: string;
  quantity: number;
}

export interface CageRivet {
  id: string;
  cageBatchNo: string;
  bearingTypeName: string;
  machineNo: string;
  operator: string;
  processTime: string;
  pocketDiameter: number;
  pocketDistance: number;
  status: ProcessStatus;
}

export interface BearingAssembly {
  id: string;
  assemblyBatch: string;
  bearingTypeName: string;
  bearingModel: string;
  innerRingBatch: string;
  outerRingBatch: string;
  rollerGroupNo: string;
  cageBatch: string;
  radialClearance: number;
  operator: string;
  assemblyTime: string;
  quantity: number;
  cleaningGreasing: boolean;
  status: ProcessStatus;
}

export interface VibrationTest {
  id: string;
  assemblyId: string;
  assemblyBatch: string;
  bearingTypeName: string;
  tester: string;
  testTime: string;
  rotationSpeed: number;
  vibrationValue: number;
  noiseDb: number;
  rotationSmooth: boolean;
  status: ProcessStatus;
}

export interface FinishedProduct {
  id: string;
  packageBatch: string;
  bearingTypeName: string;
  bearingModel: string;
  quantity: number;
  packager: string;
  packageDate: string;
  rustProof: string;
  storageLocation: string;
}

export interface SysUser {
  id: string;
  username: string;
  realName: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'inactive';
}

export interface SysRole {
  id: string;
  roleName: string;
  permissions: string[];
}

export interface DashboardStats {
  todayProduction: number;
  qualifiedRate: number;
  pendingTasks: number;
  processingBatches: number;
  productionTrend: { date: string; output: number }[];
  qualityTrend: { date: string; rate: number }[];
  moduleStats: { name: string; count: number }[];
  recentTasks: RecentTask[];
}

export interface RecentTask {
  id: string;
  module: string;
  batchNo: string;
  operator: string;
  status: ProcessStatus;
  time: string;
}

export interface ProcessTrace {
  id: string;
  batchNo: string;
  steps: TraceStep[];
}

export interface TraceStep {
  name: string;
  status: ProcessStatus;
  operator: string;
  time: string;
  data: Record<string, any>;
}
