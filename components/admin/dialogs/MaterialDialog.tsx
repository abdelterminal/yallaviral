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
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface MaterialDialogProps {
    resource?: any;
}

export function MaterialDialog({ resource }: MaterialDialogProps) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm({
        defaultValues: {
            name: resource?.name || "",
            type: "gear",
            hourly_rate: resource?.hourly_rate || "", // Using this as Price/Day or Price/Hour depending on business logic, but label will say Price
            quantity: resource?.quantity || "1",
            image_url: resource?.image_url || "",
            bio: resource?.bio || "", // Description
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
                name: data.name,
                type: "gear",
                hourly_rate: Number(data.hourly_rate),
                quantity: Number(data.quantity),
                image_url: data.image_url,
                bio: data.bio,
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

            toast.success(resource ? "Material updated" : "Material added");
            setOpen(false);
            if (!resource) form.reset();
            router.refresh();
        } catch (error) {
            toast.error("Error", { description: "Could not save material." });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {resource ? (
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left">Edit</Button>
                ) : (
                    <Button className="font-bold shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" /> Add Material
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{resource ? "Edit Material" : "Add New Material"}</DialogTitle>
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
                                        <Input placeholder="Camera, Light, etc." {...field} className="bg-white/5 border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="hourly_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (MAD)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} className="bg-white/5 border-white/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="1" {...field} className="bg-white/5 border-white/10" />
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
                                        <div className="mt-2 relative h-24 w-24 rounded-md overflow-hidden border border-white/20">
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details about the equipment..." {...field} className="bg-white/5 border-white/10 resize-none h-20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={uploading} className="font-bold">
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (resource ? "Update Material" : "Add Material")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
