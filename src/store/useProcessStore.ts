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
  setSelectedRecord: (record: any | null) => void;
  setModalVisible: (visible: boolean, mode?: 'add' | 'edit' | 'view') => void;
  refreshDashboard: () => void;
  
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

export const useProcessStore = create<ProcessState>((set) => ({
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

  initMockData: () => {
    set({
      turningProcesses: generateTurningProcesses(25),
      heatProcesses: generateHeatProcesses(25),
      grindingProcesses: generateGrindingProcesses(25),
      rollerGroups: generateRollerGroups(20),
      cageRivets: generateCageRivets(20),
      bearingAssemblies: generateBearingAssemblies(20),
      vibrationTests: generateVibrationTests(20),
      finishedProducts: generateFinishedProducts(20),
      dashboardStats: generateDashboardStats(),
    });
  },

  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setModalVisible: (visible, mode = 'add') => set({ isModalVisible: visible, modalMode: mode }),
  refreshDashboard: () => set({ dashboardStats: generateDashboardStats() }),

  addTurningProcess: (data) => set((state) => ({
    turningProcesses: [{ ...data, id: generateId() }, ...state.turningProcesses],
  })),
  updateTurningProcess: (id, data) => set((state) => ({
    turningProcesses: state.turningProcesses.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteTurningProcess: (id) => set((state) => ({
    turningProcesses: state.turningProcesses.filter((item) => item.id !== id),
  })),

  addHeatProcess: (data) => set((state) => ({
    heatProcesses: [{ ...data, id: generateId() }, ...state.heatProcesses],
  })),
  updateHeatProcess: (id, data) => set((state) => ({
    heatProcesses: state.heatProcesses.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteHeatProcess: (id) => set((state) => ({
    heatProcesses: state.heatProcesses.filter((item) => item.id !== id),
  })),

  addGrindingProcess: (data) => set((state) => ({
    grindingProcesses: [{ ...data, id: generateId() }, ...state.grindingProcesses],
  })),
  updateGrindingProcess: (id, data) => set((state) => ({
    grindingProcesses: state.grindingProcesses.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteGrindingProcess: (id) => set((state) => ({
    grindingProcesses: state.grindingProcesses.filter((item) => item.id !== id),
  })),

  addRollerGroup: (data) => set((state) => ({
    rollerGroups: [{ ...data, id: generateId() }, ...state.rollerGroups],
  })),
  updateRollerGroup: (id, data) => set((state) => ({
    rollerGroups: state.rollerGroups.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteRollerGroup: (id) => set((state) => ({
    rollerGroups: state.rollerGroups.filter((item) => item.id !== id),
  })),

  addCageRivet: (data) => set((state) => ({
    cageRivets: [{ ...data, id: generateId() }, ...state.cageRivets],
  })),
  updateCageRivet: (id, data) => set((state) => ({
    cageRivets: state.cageRivets.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteCageRivet: (id) => set((state) => ({
    cageRivets: state.cageRivets.filter((item) => item.id !== id),
  })),

  addBearingAssembly: (data) => set((state) => ({
    bearingAssemblies: [{ ...data, id: generateId() }, ...state.bearingAssemblies],
  })),
  updateBearingAssembly: (id, data) => set((state) => ({
    bearingAssemblies: state.bearingAssemblies.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteBearingAssembly: (id) => set((state) => ({
    bearingAssemblies: state.bearingAssemblies.filter((item) => item.id !== id),
  })),

  addVibrationTest: (data) => set((state) => ({
    vibrationTests: [{ ...data, id: generateId() }, ...state.vibrationTests],
  })),
  updateVibrationTest: (id, data) => set((state) => ({
    vibrationTests: state.vibrationTests.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteVibrationTest: (id) => set((state) => ({
    vibrationTests: state.vibrationTests.filter((item) => item.id !== id),
  })),

  addFinishedProduct: (data) => set((state) => ({
    finishedProducts: [{ ...data, id: generateId() }, ...state.finishedProducts],
  })),
  updateFinishedProduct: (id, data) => set((state) => ({
    finishedProducts: state.finishedProducts.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  deleteFinishedProduct: (id) => set((state) => ({
    finishedProducts: state.finishedProducts.filter((item) => item.id !== id),
  })),
}));
