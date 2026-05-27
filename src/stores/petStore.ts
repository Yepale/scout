import { create } from 'zustand';

interface PetProfile {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  checkedParts: string[];
}

interface PetState {
  activePet: PetProfile | null;
  pets: PetProfile[];
  inspectionProgress: number;
  inspectedParts: string[];

  setActivePet: (p: PetProfile | null) => void;
  addPet: (p: PetProfile) => void;
  markPartInspected: (part: string) => void;
  resetInspection: () => void;
  setInspectionProgress: (v: number) => void;
}

export const usePetStore = create<PetState>((set) => ({
  activePet: { id: 'pet1', name: 'Luna', type: 'dog', checkedParts: [] },
  pets: [{ id: 'pet1', name: 'Luna', type: 'dog', checkedParts: [] }],
  inspectionProgress: 0,
  inspectedParts: [],

  setActivePet: (p) => set({ activePet: p }),
  addPet: (p) => set((s) => ({ pets: [...s.pets, p] })),
  markPartInspected: (part) =>
    set((s) => ({
      inspectedParts: s.inspectedParts.includes(part)
        ? s.inspectedParts
        : [...s.inspectedParts, part],
      inspectionProgress:
        (s.inspectedParts.length + 1) / 5,
    })),
  resetInspection: () => set({ inspectedParts: [], inspectionProgress: 0 }),
  setInspectionProgress: (v) => set({ inspectionProgress: v }),
}));
