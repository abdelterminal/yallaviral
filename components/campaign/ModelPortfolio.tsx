"use client";

import { Resource } from "@/types/database";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ImageIcon } from "lucide-react";

interface ModelPortfolioProps {
    model: Resource;
    children?: React.ReactNode;
}

export function ModelPortfolio({ model, children }: ModelPortfolioProps) {
    const portfolio = model.sample_videos || [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 p-1 h-auto">
                        <Eye className="h-3 w-3 mr-1" /> Portfolio
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-white/10 backdrop-blur-xl text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/30">
                            {model.image_url ? (
                                <img src={model.image_url} alt={model.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-primary/20 flex items-center justify-center text-xs">
                                    {model.name[0]}
                                </div>
                            )}
                        </div>
                        {model.name}&apos;s Portfolio
                    </DialogTitle>
                </DialogHeader>

                {portfolio.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {portfolio.map((url, index) => (
                            <div
                                key={index}
                                className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10 group cursor-pointer hover:border-primary/40 transition-all"
                            >
                                <img
                                    src={url}
                                    alt={`${model.name} work ${index + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground font-medium">No portfolio items yet</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Work samples will appear here soon.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
