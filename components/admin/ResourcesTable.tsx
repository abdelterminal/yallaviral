"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResourceDialog } from "@/components/admin/ResourceDialog";
import { ModelDialog } from "@/components/admin/dialogs/ModelDialog";
import { StudioDialog } from "@/components/admin/dialogs/StudioDialog";
import { MaterialDialog } from "@/components/admin/dialogs/MaterialDialog";
import { Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ResourcesTableProps {
    resources: any[];
}

export function ResourcesTable({ resources }: ResourcesTableProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;

        const { error } = await supabase.from("resources").delete().eq("id", id);

        if (error) {
            toast.error("Error", { description: error.message });
        } else {
            toast.success("Resource deleted");
            router.refresh();
        }
    };

    return (
        <div className="rounded-md border border-white/10 bg-black/40 backdrop-blur-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white">Preview</TableHead>
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Rate/Price</TableHead>
                        <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource.id} className="border-white/10 hover:bg-white/5">
                            <TableCell>
                                <Avatar className="h-10 w-10 rounded-md">
                                    <AvatarImage src={resource.image_url} className="object-cover" />
                                    <AvatarFallback>{resource.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium text-white">
                                {resource.name}
                                {resource.type === 'gear' && resource.quantity > 0 && (
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">(Qty: {resource.quantity})</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 capitalize">
                                    {resource.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-emerald-400 font-mono">
                                {resource.hourly_rate} MAD
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2 items-center">
                                    {resource.type === 'model' && <ModelDialog resource={resource} />}
                                    {resource.type === 'studio' && <StudioDialog resource={resource} />}
                                    {resource.type === 'gear' && <MaterialDialog resource={resource} />}
                                    {/* Fallback for other types if any exist */}
                                    {!['model', 'studio', 'gear'].includes(resource.type) && <ResourceDialog resource={resource} />}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                        onClick={() => handleDelete(resource.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {resources.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No resources found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
