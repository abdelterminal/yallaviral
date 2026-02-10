import { create } from 'zustand';
import { Resource } from '@/types/database';

interface CampaignState {
    selectedModels: Resource[];
    videoStyle: string;
    notes: string;
    addModel: (model: Resource) => void;
    removeModel: (modelId: string) => void;
    setVideoStyle: (style: string) => void;
    setNotes: (notes: string) => void;
    reset: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
    selectedModels: [],
    videoStyle: '',
    notes: '',
    addModel: (model) =>
        set((state) => {
            // Prevent duplicates
            if (state.selectedModels.find((m) => m.id === model.id)) {
                return state;
            }
            return { selectedModels: [...state.selectedModels, model] };
        }),
    removeModel: (modelId) =>
        set((state) => ({
            selectedModels: state.selectedModels.filter((m) => m.id !== modelId),
        })),
    setVideoStyle: (style) => set({ videoStyle: style }),
    setNotes: (notes) => set({ notes }),
    reset: () => set({ selectedModels: [], videoStyle: '', notes: '' }),
}));
