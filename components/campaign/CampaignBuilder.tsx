"use client";

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { Resource } from '@/types/database';
import { useCampaignStore } from '@/store/useCampaignStore';
import { DraggableModelCard } from './DraggableModelCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Film, Gift, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Droppable Area Component
function DroppableArea({ children }: { children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'campaign-drop-zone',
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "min-h-[400px] rounded-xl border-2 border-dashed transition-colors p-4",
                isOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
        >
            {children}
        </div>
    );
}

interface CampaignBuilderProps {
    availableModels: Resource[];
}

import { useRouter } from 'next/navigation';
import { createCampaignBooking } from '@/actions/create-booking';

export function CampaignBuilder({ availableModels }: CampaignBuilderProps) {
    const { selectedModels, addModel, removeModel, videoStyle, setVideoStyle } = useCampaignStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id === 'campaign-drop-zone') {
            const model = active.data.current as Resource;
            if (model) {
                addModel(model);
            }
        }
        setActiveId(null);
    };

    const handleLaunch = async () => {
        setIsLoading(true);
        const totalPrice = selectedModels.reduce((acc, m) => acc + m.hourly_rate, 0) * 2;
        const modelIds = selectedModels.map(m => m.id);

        const res = await createCampaignBooking(modelIds, videoStyle, totalPrice);

        if (res.success) {
            router.push(`/success?id=${res.bookingId}`);
        } else {
            alert("Campaign launch failed: " + (res.error || "Unknown error"));
            setIsLoading(false);
        }
    };

    const activeModel = availableModels.find((m) => m.id === activeId);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column: Available Models */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold">Step 1: Choose Talent</h3>
                        <p className="text-muted-foreground text-sm">Drag models to your campaign.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {availableModels.map((model) => (
                            <DraggableModelCard key={model.id} model={model} />
                        ))}
                    </div>
                </div>

                {/* Right Column: Campaign Drop Zone */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold">Step 2: Build Campaign</h3>
                        <p className="text-muted-foreground text-sm">Drop models here.</p>
                    </div>

                    <DroppableArea>
                        {selectedModels.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground mt-20">
                                <p>Drag models here to start building your squad.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedModels.map((model) => (
                                    <Card key={model.id} className="relative overflow-hidden">
                                        <div className="flex items-center gap-4 p-3 pr-12">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                                                {model.image_url && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={model.image_url} alt={model.name} className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{model.name}</h4>
                                                <Badge variant="outline" className="text-[10px]">{model.hourly_rate} MAD/hr</Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeModel(model.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </DroppableArea>

                    {/* Video Style Selector */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Step 3: Video Style</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'unboxing', label: 'Unboxing', icon: Gift },
                                { id: 'testimonial', label: 'Testimonial', icon: MessageCircle },
                                { id: 'skit', label: 'Comedy Skit', icon: Film },
                            ].map((style) => {
                                const Icon = style.icon;
                                const isSelected = videoStyle === style.id;
                                return (
                                    <button
                                        key={style.id}
                                        onClick={() => setVideoStyle(style.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all hover:bg-muted/50",
                                            isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
                                        )}
                                    >
                                        <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                                        <span className={cn("text-xs font-medium", isSelected && "text-primary")}>{style.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-muted-foreground">Total Budget Est.</span>
                            <span className="text-2xl font-black">{selectedModels.reduce((acc, m) => acc + m.hourly_rate, 0) * 2} MAD</span>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={selectedModels.length === 0 || !videoStyle || isLoading}
                            onClick={handleLaunch}
                        >
                            {isLoading ? "Launching..." : "Launch Campaign 🚀"}
                        </Button>
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeModel ? (
                    <Card className="w-[300px] shadow-2xl cursor-grabbing opacity-90 rotate-3">
                        <div className="flex items-center gap-4 p-3">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {activeModel.image_url && <img src={activeModel.image_url} alt={activeModel.name} className="h-full w-full object-cover" />}
                            </div>
                            <div>
                                <h4 className="font-bold">{activeModel.name}</h4>
                                <span className="text-xs text-muted-foreground">Dragging...</span>
                            </div>
                        </div>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
