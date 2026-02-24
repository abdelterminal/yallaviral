import { useDraggable } from '@dnd-kit/core';
import { Resource } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DraggableModelCardProps {
    model: Resource;
}

export function DraggableModelCard({ model }: DraggableModelCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: model.id,
        data: model,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing touch-none group h-[400px]">
            <Card className={cn("h-full overflow-hidden relative border-0 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20", isDragging && "opacity-50 ring-2 ring-primary rotate-3 scale-105")}>

                {/* Full Height Image */}
                <div className="absolute inset-0 bg-muted">
                    {model.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={model.image_url} alt={model.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
                </div>

                {/* Content Overlay - Always visible name, extra details on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                    <h4 className="font-black text-2xl text-white mb-1 drop-shadow-md">{model.name}</h4>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1">
                            {model.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/20 text-[10px] px-1.5 backdrop-blur-sm">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            {/* Price hidden for Devis flow */}
                            {/* <span className="text-sm font-bold text-white bg-primary px-2 py-0.5 rounded-md shadow-lg">
                                {model.hourly_rate} MAD/hr
                            </span> */}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
