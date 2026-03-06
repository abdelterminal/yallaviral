import { Resource } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingSheet } from "./BookingSheet";
import { Mic, Wifi, Video, Armchair, Zap, CheckCircle2 } from "lucide-react";

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const isAvailable = resource.status === 'active';

    return (
        <Card className="group overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border-0 flex flex-col md:flex-row h-auto md:h-[340px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            {/* Image Section (Left) */}
            <div className="w-full md:w-2/5 relative p-4 md:pr-0 h-[240px] md:h-full">
                <div className="w-full h-full relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-inner">
                    {resource.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={resource.image_url}
                            alt={resource.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                            No Image
                        </div>
                    )}
                </div>
            </div>

            {/* Content & Action Container */}
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Content Section (Middle) */}
                <div className="flex-1 p-8 flex flex-col relative justify-center">
                    <div className="flex items-start justify-between mb-4">
                        <CardTitle className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{resource.name}</CardTitle>
                        {isAvailable && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-100 bg-emerald-50 rounded-full hidden md:flex items-center gap-1.5 px-3 py-1 text-xs">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Available
                            </Badge>
                        )}
                    </div>

                    <p className="text-muted-foreground mb-8 line-clamp-2 text-base font-medium leading-relaxed">
                        Professional studio space equipped with everything you need for high-quality production.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {resource.tags?.map(tag => {
                            let Icon = Zap;
                            if (tag.includes('mic')) Icon = Mic;
                            if (tag.includes('wifi')) Icon = Wifi;
                            if (tag.includes('cam')) Icon = Video;
                            if (tag.includes('sofa')) Icon = Armchair;

                            return (
                                <div key={tag} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all cursor-default">
                                    <Icon className="h-3.5 w-3.5" />
                                    <span className="capitalize">{tag}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Section (Right) */}
                <div className="p-8 border-0 bg-slate-50/50 flex flex-row md:flex-col items-center md:justify-center justify-between gap-6 min-w-[240px]">
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-4xl font-black text-foreground tracking-tighter">{resource.hourly_rate} MAD</span>
                        <span className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-1">per hour</span>
                    </div>

                    <BookingSheet resource={resource}>
                        <Button size="lg" className="w-full h-14 font-black transition-all rounded-full text-lg shadow-[0_8px_30px_-6px_hsl(var(--primary))] hover:scale-105 bg-primary hover:bg-primary/90 text-white border-0">
                            Book This Set
                        </Button>
                    </BookingSheet>
                </div>
            </div>
        </Card>
    );
}
