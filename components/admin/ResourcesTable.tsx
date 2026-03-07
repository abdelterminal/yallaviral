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

    const TYPE_COLORS: Record<string, string> = {
        model: "bg-violet-500/12 text-violet-400 border-violet-500/20",
        studio: "bg-cyan-500/12 text-cyan-400 border-cyan-500/20",
        gear: "bg-amber-500/12 text-amber-400 border-amber-500/20",
    };

    return (
        <div className="rounded-[16px] bg-card overflow-hidden shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)]">
            {/* Column headers */}
            <div className="px-6 py-4 bg-muted/20">
                <div className="grid grid-cols-[0.4fr_1.5fr_0.8fr_0.8fr_0.8fr] gap-4 items-center">
                    {["Preview", "Name", "Type", "Rate", ""].map((h, i) => (
                        <span key={i} className={`text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 ${i === 4 ? "text-right" : ""}`}>{h}</span>
                    ))}
                </div>
            </div>

            <Table>
                <TableHeader className="sr-only">
                    <TableRow>
                        <TableHead>Preview</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rate/Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource.id}>
                            <TableCell>
                                <Avatar className="h-10 w-10 rounded-[10px] shrink-0">
                                    <AvatarImage src={resource.image_url} className="object-cover" />
                                    <AvatarFallback className="rounded-[10px] bg-muted text-muted-foreground font-bold text-sm">
                                        {resource.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-foreground">{resource.name}</span>
                                    {resource.type === 'gear' && resource.quantity > 0 && (
                                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">×{resource.quantity}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-[11px] font-semibold border capitalize ${TYPE_COLORS[resource.type] || "bg-muted/50 text-muted-foreground border-border/30"}`}>
                                    {resource.type}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="font-mono text-sm font-semibold text-accent">
                                    {resource.hourly_rate} MAD
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-1.5">
                                    {resource.type === 'model' && <ModelDialog resource={resource} />}
                                    {resource.type === 'studio' && <StudioDialog resource={resource} />}
                                    {resource.type === 'gear' && <MaterialDialog resource={resource} />}
                                    {!['model', 'studio', 'gear'].includes(resource.type) && <ResourceDialog resource={resource} />}
                                    <button
                                        className="h-7 w-7 rounded-[8px] inline-flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all hover:scale-[1.05]"
                                        onClick={() => handleDelete(resource.id)}
                                        title="Delete resource"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {resources.length === 0 && (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                                No resources found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
