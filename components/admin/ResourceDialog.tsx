"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

interface ResourceDialogProps {
    resource?: any; // If passed, it's edit mode
    defaultType?: string;
}

export function ResourceDialog({ resource, defaultType = "model" }: ResourceDialogProps) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm({
        defaultValues: {
            name: resource?.name || "",
            type: resource?.type || defaultType,
            hourly_rate: resource?.hourly_rate || "",
            image_url: resource?.image_url || "",
            bio: resource?.bio || "", // Using bio instead of description based on previous context
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('resources')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('resources')
                .getPublicUrl(filePath);

            form.setValue("image_url", publicUrl);
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Upload failed", { description: "Could not upload image." });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                hourly_rate: Number(data.hourly_rate),
            };

            let error;
            if (resource) {
                const { error: updateError } = await supabase
                    .from("resources")
                    .update(payload)
                    .eq("id", resource.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from("resources")
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(resource ? "Resource updated" : "Resource created");
            setOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error("Error", { description: "Could not save resource." });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {resource ? (
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left">Edit</Button>
                ) : (
                    <Button className="font-bold shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" /> Add Resource
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{resource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Resource Name" {...field} className="bg-white/5 border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white/5 border-white/10">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-black border-white/10">
                                                <SelectItem value="model">Model</SelectItem>
                                                <SelectItem value="studio">Studio</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="videographer">Videographer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hourly_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rate (MAD)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} className="bg-white/5 border-white/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="bg-white/5 border-white/10 cursor-pointer text-xs"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>
                                    {field.value && (
                                        <div className="mt-2 relative h-20 w-20 rounded-md overflow-hidden border border-white/20">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={field.value} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio / Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Short description..." {...field} className="bg-white/5 border-white/10 resize-none h-20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={uploading} className="font-bold">
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (resource ? "Update" : "Create")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
