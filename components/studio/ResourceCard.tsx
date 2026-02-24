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
        <Card className="group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] hover:border-primary/50 flex flex-col md:flex-row h-auto md:h-[300px] bg-black/40 border-white/10 backdrop-blur-sm">
            {/* Image Section (Left) */}
            <div className="w-full md:w-2/5 relative overflow-hidden bg-muted">
                {resource.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={resource.image_url}
                        alt={resource.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-white/5 text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />

                {/* Price Badge Overlay (Mobile Only) */}
                <div className="absolute top-4 left-4 md:hidden">
                    <Badge className="bg-black/80 backdrop-blur text-white font-bold text-lg px-3 py-1 shadow-sm rounded-xl border border-white/10">
                        {resource.hourly_rate} MAD<span className="text-xs font-normal text-muted-foreground ml-1">/hr</span>
                    </Badge>
                </div>
            </div>

            {/* Content & Action Container */}
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Content Section (Middle) */}
                <div className="flex-1 p-6 flex flex-col relative">
                    <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors">{resource.name}</CardTitle>
                        {isAvailable && (
                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 rounded-lg hidden md:flex items-center gap-1">
                                <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Available
                            </Badge>
                        )}
                    </div>

                    <p className="text-muted-foreground mb-6 line-clamp-2 flex-grow text-sm leading-relaxed">
                        Professional studio space equipped with everything you need for high-quality production.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {resource.tags?.map(tag => {
                            let Icon = Zap;
                            if (tag.includes('mic')) Icon = Mic;
                            if (tag.includes('wifi')) Icon = Wifi;
                            if (tag.includes('cam')) Icon = Video;
                            if (tag.includes('sofa')) Icon = Armchair;

                            return (
                                <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
                                    <Icon className="h-3 w-3 text-primary" />
                                    <span className="capitalize">{tag}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Section (Right) */}
                <div className="p-6 border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.02] flex flex-row md:flex-col items-center md:justify-center justify-between gap-4 min-w-[200px]">
                    <div className="hidden md:flex flex-col items-center">
                        <span className="text-3xl font-black text-white">{resource.hourly_rate} MAD</span>
                        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">per hour</span>
                    </div>

                    <BookingSheet resource={resource}>
                        <Button size="lg" className="w-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all rounded-xl">
                            Book This Set
                        </Button>
                    </BookingSheet>
                </div>
            </div>
        </Card >
    );
}
