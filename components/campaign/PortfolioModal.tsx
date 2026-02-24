"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Resource } from "@/types/database";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface PortfolioModalProps {
    model: Resource | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (videoUrl: string) => void;
}

export function PortfolioModal({ model, isOpen, onClose, onSelect }: PortfolioModalProps) {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    if (!model) return null;

    const videos = model.sample_videos || [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1974&auto=format&fit=crop"
    ]; // Fallback if DB update hasn't propagated or for testing

    const handleConfirm = () => {
        if (selectedVideo) {
            onSelect(selectedVideo);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Select a Reference Style</DialogTitle>
                    <DialogDescription>
                        Choose one of {model.name}&apos;s previous videos to guide the style of your campaign.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {videos.map((video, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedVideo(video)}
                            className={cn(
                                "relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border-4 transition-all group",
                                selectedVideo === video ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-transparent hover:border-white/20"
                            )}
                        >
                            {/* In real app, this would be a <video> tag or thumbnail */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={video} alt={`Sample ${idx}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all",
                                    selectedVideo === video ? "bg-primary text-white scale-110" : "bg-white/30 text-white group-hover:scale-110"
                                )}>
                                    <Play className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!selectedVideo} size="lg" className="font-bold px-8">
                        Confirm Selection
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
