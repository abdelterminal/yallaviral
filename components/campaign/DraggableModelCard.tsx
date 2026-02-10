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
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing touch-none">
            <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", isDragging && "opacity-50 ring-2 ring-primary")}>
                <div className="flex items-center gap-4 p-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        {model.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={model.image_url} alt={model.name} className="h-full w-full object-cover" />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold">{model.name}</h4>
                        <div className="flex flex-wrap gap-1">
                            {model.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{model.hourly_rate} MAD/hr</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
