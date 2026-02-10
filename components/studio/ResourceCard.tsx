import { Resource } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingSheet } from "./BookingSheet";

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video w-full overflow-hidden bg-muted">
                {resource.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={resource.image_url}
                        alt={resource.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{resource.name}</CardTitle>
                    <Badge variant="secondary" className="font-bold">
                        {resource.hourly_rate} MAD/hr
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {resource.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs text-muted-foreground">
                            #{tag}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardFooter>
                <BookingSheet resource={resource}>
                    <Button className="w-full">Book Now</Button>
                </BookingSheet>
            </CardFooter>
        </Card>
    );
}
