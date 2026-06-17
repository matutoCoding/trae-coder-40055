import { create } from 'zustand';
import type {
  TurningProcess,
  HeatProcess,
  GrindingProcess,
  RollerGroup,
  CageRivet,
  BearingAssembly,
  VibrationTest,
  FinishedProduct,
  DashboardStats,
  RecentTask,
} from '@/types';
import {
  generateTurningProcesses,
  generateHeatProcesses,
  generateGrindingProcesses,
  generateRollerGroups,
  generateCageRivets,
  generateBearingAssemblies,
  generateVibrationTests,
  generateFinishedProducts,
  generateDashboardStats,
} from '@/utils/mock';

const STORAGE_KEY = 'bearing_mes_process_data';

interface ProcessState {
  turningProcesses: TurningProcess[];
  heatProcesses: HeatProcess[];
  grindingProcesses: GrindingProcess[];
  rollerGroups: RollerGroup[];
  cageRivets: CageRivet[];
  bearingAssemblies: BearingAssembly[];
  vibrationTests: VibrationTest[];
  finishedProducts: FinishedProduct[];
  dashboardStats: DashboardStats | null;
  selectedRecord: any | null;
  isModalVisible: boolean;
  modalMode: 'add' | 'edit' | 'view';
  
  initMockData: () => void;
  loadFromStorage: () => boolean;
  saveToStorage: () => void;
  setSelectedRecord: (record: any | null) => void;
  setModalVisible: (visible: boolean, mode?: 'add' | 'edit' | 'view') => void;
  refreshDashboard: () => void;
  resetAllData: () => void;
  
  addTurningProcess: (data: Omit<TurningProcess, 'id'>) => void;
  updateTurningProcess: (id: string, data: Partial<TurningProcess>) => void;
  deleteTurningProcess: (id: string) => void;
  
  addHeatProcess: (data: Omit<HeatProcess, 'id'>) => void;
  updateHeatProcess: (id: string, data: Partial<HeatProcess>) => void;
  deleteHeatProcess: (id: string) => void;
  
  addGrindingProcess: (data: Omit<GrindingProcess, 'id'>) => void;
  updateGrindingProcess: (id: string, data: Partial<GrindingProcess>) => void;
  deleteGrindingProcess: (id: string) => void;
  
  addRollerGroup: (data: Omit<RollerGroup, 'id'>) => void;
  updateRollerGroup: (id: string, data: Partial<RollerGroup>) => void;
  deleteRollerGroup: (id: string) => void;
  
  addCageRivet: (data: Omit<CageRivet, 'id'>) => void;
  updateCageRivet: (id: string, data: Partial<CageRivet>) => void;
  deleteCageRivet: (id: string) => void;
  
  addBearingAssembly: (data: Omit<BearingAssembly, 'id'>) => void;
  updateBearingAssembly: (id: string, data: Partial<BearingAssembly>) => void;
  deleteBearingAssembly: (id: string) => void;
  
  addVibrationTest: (data: Omit<VibrationTest, 'id'>) => void;
  updateVibrationTest: (id: string, data: Partial<VibrationTest>) => void;
  deleteVibrationTest: (id: string) => void;
  
  addFinishedProduct: (data: Omit<FinishedProduct, 'id'>) => void;
  updateFinishedProduct: (id: string, data: Partial<FinishedProduct>) => void;
  deleteFinishedProduct: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const calculateDashboardStats = (state: ProcessState): DashboardStats => {
  const allProcesses = [
    ...state.turningProcesses,
    ...state.heatProcesses,
    ...state.grindingProcesses,
    ...state.bearingAssemblies,
    ...state.vibrationTests,
  ];
  
  const qualifiedCount = allProcesses.filter(p => p.status === 'qualified' || p.status === 'completed').length;
  const totalCount = allProcesses.length;
  const qualifiedRate = totalCount > 0 ? Math.round((qualifiedCount / totalCount) * 100 * 10) / 10 : 95.8;
  
  const pendingTasks = allProcesses.filter(p => p.status === 'pending').length;
  const processingBatches = allProcesses.filter(p => p.status === 'processing').length;
  
  const moduleStats = [
    { name: '套圈车削', count: state.turningProcesses.length },
    { name: '热处理', count: state.heatProcesses.length },
    { name: '磨加工', count: state.grindingProcesses.length },
    { name: '滚子配套', count: state.rollerGroups.length },
    { name: '保持架', count: state.cageRivets.length },
    { name: '轴承装配', count: state.bearingAssemblies.length },
    { name: '振动检测', count: state.vibrationTests.length },
  ];
  
  const recentTasks: RecentTask[] = [
    ...state.turningProcesses.slice(0, 3).map(p => ({
      id: p.id,
      module: '套圈车削',
      batchNo: p.ringBatchNo,
      operator: p.operator,
      status: p.status,
      time: p.startTime,
    })),
    ...state.heatProcesses.slice(0, 2).map(p => ({
      id: p.id,
      module: '热处理',
      batchNo: p.ringBatchNo,
      operator: p.operator,
      status: p.status,
      time: p.quenchingTime,
    })),
    ...state.bearingAssemblies.slice(0, 3).map(p => ({
      id: p.id,
      module: '轴承装配',
      batchNo: p.assemblyBatch,
      operator: p.operator,
      status: p.status,
      time: p.assemblyTime,
    })),
    ...state.vibrationTests.slice(0, 2).map(p => ({
      id: p.id,
      module: '振动检测',
      batchNo: p.assemblyBatch,
      operator: p.tester,
      status: p.status,
      time: p.testTime,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  
  const dates = [];
  const outputs = [];
  const rates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    dates.push(dateStr);
    outputs.push(Math.floor(Math.random() * 200) + 300);
    rates.push(Math.floor(Math.random() * 5) + 93);
  }
  
  return {
    todayProduction: state.finishedProducts.reduce((sum, p) => sum + p.quantity, 0) || 528,
    qualifiedRate,
    pendingTasks: pendingTasks || 23,
    processingBatches: processingBatches || 15,
    productionTrend: dates.map((date, i) => ({ date, output: outputs[i] })),
    qualityTrend: dates.map((date, i) => ({ date, rate: rates[i] })),
    moduleStats,
    recentTasks,
  };
};

export const useProcessStore = create<ProcessState>((set, get) => ({
  turningProcesses: [],
  heatProcesses: [],
  grindingProcesses: [],
  rollerGroups: [],
  cageRivets: [],
  bearingAssemblies: [],
  vibrationTests: [],
  finishedProducts: [],
  dashboardStats: null,
  selectedRecord: null,
  isModalVisible: false,
  modalMode: 'add',

  saveToStorage: () => {
    const state = get();
    const data = {
      turningProcesses: state.turningProcesses,
      heatProcesses: state.heatProcesses,
      grindingProcesses: state.grindingProcesses,
      rollerGroups: state.rollerGroups,
      cageRivets: state.cageRivets,
      bearingAssemblies: state.bearingAssemblies,
      vibrationTests: state.vibrationTests,
      finishedProducts: state.finishedProducts,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  loadFromStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        set({
          turningProcesses: data.turningProcesses || [],
          heatProcesses: data.heatProcesses || [],
          grindingProcesses: data.grindingProcesses || [],
          rollerGroups: data.rollerGroups || [],
          cageRivets: data.cageRivets || [],
          bearingAssemblies: data.bearingAssemblies || [],
          vibrationTests: data.vibrationTests || [],
          finishedProducts: data.finishedProducts || [],
        });
        return true;
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }
    return false;
  },

  initMockData: () => {
    const state = get();
    const hasData = state.turningProcesses.length > 0;
    
    if (hasData) {
      set({ dashboardStats: calculateDashboardStats(state) });
      return;
    }
    
    const loaded = get().loadFromStorage();
    if (loaded && get().turningProcesses.length > 0) {
      set({ dashboardStats: calculateDashboardStats(get()) });
      return;
    }
    
    const turning = generateTurningProcesses(25);
    const heat = generateHeatProcesses(25);
    const grinding = generateGrindingProcesses(25);
    const rollers = generateRollerGroups(20);
    const cages = generateCageRivets(20);
    const assemblies = generateBearingAssemblies(20);
    const vibrations = generateVibrationTests(20);
    const finished = generateFinishedProducts(20);
    
    heat.forEach((h, i) => {
      if (turning[i]) {
        h.turningId = turning[i].id;
        h.ringBatchNo = turning[i].ringBatchNo;
      }
    });
    
    grinding.forEach((g, i) => {
      if (heat[i]) {
        g.heatId = heat[i].id;
        g.ringBatchNo = heat[i].ringBatchNo;
      }
    });
    
    assemblies.forEach((a, i) => {
      if (vibrations[i]) {
        vibrations[i].assemblyId = a.id;
        vibrations[i].assemblyBatch = a.assemblyBatch;
        vibrations[i].bearingTypeName = a.bearingTypeName;
      }
      if (finished[i]) {
        finished[i].bearingTypeName = a.bearingTypeName;
        finished[i].bearingModel = a.bearingModel;
      }
    });
    
    set({
      turningProcesses: turning,
      heatProcesses: heat,
      grindingProcesses: grinding,
      rollerGroups: rollers,
      cageRivets: cages,
      bearingAssemblies: assemblies,
      vibrationTests: vibrations,
      finishedProducts: finished,
    });
    
    set({ dashboardStats: calculateDashboardStats(get()) });
    get().saveToStorage();
  },

  resetAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
    set({
      turningProcesses: [],
      heatProcesses: [],
      grindingProcesses: [],
      rollerGroups: [],
      cageRivets: [],
      bearingAssemblies: [],
      vibrationTests: [],
      finishedProducts: [],
      dashboardStats: null,
    });
    get().initMockData();
  },

  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setModalVisible: (visible, mode = 'add') => set({ isModalVisible: visible, modalMode: mode }),
  
  refreshDashboard: () => {
    const state = get();
    set({ dashboardStats: calculateDashboardStats(state) });
  },

  addTurningProcess: (data) => {
    set((state) => ({
      turningProcesses: [{ ...data, id: generateId() }, ...state.turningProcesses],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateTurningProcess: (id, data) => {
    set((state) => ({
      turningProcesses: state.turningProcesses.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteTurningProcess: (id) => {
    set((state) => ({
      turningProcesses: state.turningProcesses.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addHeatProcess: (data) => {
    set((state) => ({
      heatProcesses: [{ ...data, id: generateId() }, ...state.heatProcesses],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateHeatProcess: (id, data) => {
    set((state) => ({
      heatProcesses: state.heatProcesses.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteHeatProcess: (id) => {
    set((state) => ({
      heatProcesses: state.heatProcesses.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addGrindingProcess: (data) => {
    set((state) => ({
      grindingProcesses: [{ ...data, id: generateId() }, ...state.grindingProcesses],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateGrindingProcess: (id, data) => {
    set((state) => ({
      grindingProcesses: state.grindingProcesses.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteGrindingProcess: (id) => {
    set((state) => ({
      grindingProcesses: state.grindingProcesses.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addRollerGroup: (data) => {
    set((state) => ({
      rollerGroups: [{ ...data, id: generateId() }, ...state.rollerGroups],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateRollerGroup: (id, data) => {
    set((state) => ({
      rollerGroups: state.rollerGroups.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteRollerGroup: (id) => {
    set((state) => ({
      rollerGroups: state.rollerGroups.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addCageRivet: (data) => {
    set((state) => ({
      cageRivets: [{ ...data, id: generateId() }, ...state.cageRivets],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateCageRivet: (id, data) => {
    set((state) => ({
      cageRivets: state.cageRivets.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteCageRivet: (id) => {
    set((state) => ({
      cageRivets: state.cageRivets.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addBearingAssembly: (data) => {
    set((state) => ({
      bearingAssemblies: [{ ...data, id: generateId() }, ...state.bearingAssemblies],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateBearingAssembly: (id, data) => {
    set((state) => ({
      bearingAssemblies: state.bearingAssemblies.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteBearingAssembly: (id) => {
    set((state) => ({
      bearingAssemblies: state.bearingAssemblies.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addVibrationTest: (data) => {
    set((state) => ({
      vibrationTests: [{ ...data, id: generateId() }, ...state.vibrationTests],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateVibrationTest: (id, data) => {
    set((state) => ({
      vibrationTests: state.vibrationTests.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteVibrationTest: (id) => {
    set((state) => ({
      vibrationTests: state.vibrationTests.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },

  addFinishedProduct: (data) => {
    set((state) => ({
      finishedProducts: [{ ...data, id: generateId() }, ...state.finishedProducts],
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  updateFinishedProduct: (id, data) => {
    set((state) => ({
      finishedProducts: state.finishedProducts.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
  deleteFinishedProduct: (id) => {
    set((state) => ({
      finishedProducts: state.finishedProducts.filter((item) => item.id !== id),
    }));
    get().saveToStorage();
    get().refreshDashboard();
  },
}));
