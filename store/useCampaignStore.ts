import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resource } from '@/types/database';

interface SelectedModel extends Resource {
    selectedVideo?: string;
    quantity?: number;
}

interface CampaignState {
    selectedModels: SelectedModel[];
    videoStyle: string; // Keep as global brief? Or remove? User said "he will choose by checking 5 examples". This implies per-model. Let's keep global for now as "General Style" but use per-model for specific visual ref.
    addModel: (model: Resource) => void;
    removeModel: (modelId: string) => void;
    setModelVideo: (modelId: string, videoUrl: string) => void;
    setModelQuantity: (id: string, quantity: number) => void;

    // Studio & Global Settings (for Own Talent)
    selectedStudio: Resource | null;
    setSelectedStudio: (studio: Resource | null) => void;
    globalVideoStyle: string;
    setGlobalVideoStyle: (style: string) => void;
    globalQuantity: number;
    setGlobalQuantity: (quantity: number) => void;

    setVideoStyle: (style: string) => void;

    // Add-ons
    addons: string[];
    toggleAddon: (addonId: string) => void;

    // Scheduling
    date: Date | undefined;
    time: string | undefined;
    setDate: (date: Date | undefined) => void;
    setTime: (time: string) => void;

    reset: () => void;
}

export const useCampaignStore = create<CampaignState>()(
    persist(
        (set) => ({
            selectedModels: [],
            videoStyle: '',
            addModel: (model) =>
                set((state) => {
                    if (state.selectedModels.find((m) => m.id === model.id)) {
                        return state;
                    }
                    // Initialize with quantity 1 and no selected video to force fresh selection
                    return { selectedModels: [...state.selectedModels, { ...model, quantity: 1, selectedVideo: undefined }] };
                }),
            removeModel: (modelId) =>
                set((state) => ({
                    selectedModels: state.selectedModels.filter((m) => m.id !== modelId),
                })),
            setModelVideo: (modelId, videoUrl) =>
                set((state) => ({
                    selectedModels: state.selectedModels.map(m =>
                        m.id === modelId ? { ...m, selectedVideo: videoUrl } : m
                    )
                })),
            setModelQuantity: (modelId, quantity) =>
                set((state) => ({
                    selectedModels: state.selectedModels.map((m) =>
                        m.id === modelId ? { ...m, quantity } : m
                    ),
                })),

            // Studio & Global Settings
            selectedStudio: null,
            setSelectedStudio: (studio) => set({ selectedStudio: studio }),
            globalVideoStyle: '',
            setGlobalVideoStyle: (style) => set({ globalVideoStyle: style }),
            globalQuantity: 1,
            setGlobalQuantity: (quantity) => set({ globalQuantity: quantity }),

            setVideoStyle: (style) => set({ videoStyle: style }),

            // Add-ons
            addons: [],
            toggleAddon: (addonId) => set((state) => {
                const isOpen = state.addons.includes(addonId);
                return {
                    addons: isOpen
                        ? state.addons.filter(id => id !== addonId)
                        : [...state.addons, addonId]
                };
            }),

            // Scheduling
            date: undefined,
            time: undefined,
            setDate: (date) => set({ date }),
            setTime: (time) => set({ time }),

            reset: () => set({
                selectedModels: [],
                videoStyle: '',
                date: undefined,
                time: undefined,
                selectedStudio: null,
                globalVideoStyle: '',
                globalQuantity: 1,
                addons: []
            }),
        }),
        {
            name: 'campaign-builder-storage',
        }
    ));
