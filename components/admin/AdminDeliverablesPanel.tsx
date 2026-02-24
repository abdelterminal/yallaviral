"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadDeliverable, deleteDeliverable } from "@/actions/deliverables";
import { Upload, Trash2, FileVideo, FileImage, File, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Deliverable {
    id: string;
    file_name: string;
    file_url: string;
    file_size: number | null;
    file_type: string | null;
    created_at: string;
}

interface AdminDeliverablesPanelProps {
    bookingId: string;
    deliverables: Deliverable[];
}

function formatFileSize(bytes: number | null) {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(type: string | null) {
    if (type?.startsWith("video/")) return <FileVideo className="h-5 w-5 text-purple-400" />;
    if (type?.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-400" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
}

export function AdminDeliverablesPanel({ bookingId, deliverables }: AdminDeliverablesPanelProps) {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("bookingId", bookingId);
        formData.append("file", file);

        const result = await uploadDeliverable(formData);

        if (result.error) {
            toast.error("Upload failed", { description: result.error });
        } else {
            toast.success("File uploaded", { description: file.name });
            router.refresh();
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleDelete(id: string, fileUrl: string) {
        if (!confirm("Delete this deliverable?")) return;

        setDeleting(id);
        const result = await deleteDeliverable(id, fileUrl);

        if (result.error) {
            toast.error("Delete failed", { description: result.error });
        } else {
            toast.success("Deliverable deleted");
            router.refresh();
        }

        setDeleting(null);
    }

    return (
        <div className="space-y-4">
            {/* Upload button */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Deliverables ({deliverables.length})
                </h3>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="video/*,image/*,.pdf,.zip"
                        onChange={handleUpload}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        size="sm"
                        className="font-bold bg-primary hover:bg-primary/90"
                    >
                        {uploading ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                        ) : (
                            <><Upload className="h-4 w-4 mr-2" /> Upload File</>
                        )}
                    </Button>
                </div>
            </div>

            {/* File list */}
            {deliverables.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-muted-foreground text-sm">
                    No deliverables uploaded yet. Click &quot;Upload File&quot; to add content.
                </div>
            ) : (
                <div className="space-y-2">
                    {deliverables.map((d) => (
                        <div
                            key={d.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            {getFileIcon(d.file_type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{d.file_name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(d.file_size)}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={d.file_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary/80">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </a>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                    onClick={() => handleDelete(d.id, d.file_url)}
                                    disabled={deleting === d.id}
                                >
                                    {deleting === d.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
