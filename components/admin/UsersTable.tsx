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
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUser } from "./actions";
import { useLocale } from "next-intl";
import { getDateLocale } from "@/utils/date-locale";

interface UsersTableProps {
    users: any[];
}

export function UsersTable({ users }: UsersTableProps) {
    const locale = useLocale();
    const dateFnsLocale = getDateLocale(locale);
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        const result = await deleteUser(id);
        if (result.error) {
            toast.error("Failed to delete user", { description: result.error });
        } else {
            toast.success("User deleted successfully");
        }
    };

    return (
        <div className="rounded-[16px] bg-card overflow-hidden shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)]">
            {/* Column headers */}
            <div className="px-6 py-4 bg-muted/20">
                <div className="grid grid-cols-[2fr_0.7fr_1fr_1.5fr_0.5fr] gap-4 items-center">
                    {["User", "Role", "Joined", "Email", ""].map((h, i) => (
                        <span key={i} className={`text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 ${i === 4 ? "text-right" : ""}`}>{h}</span>
                    ))}
                </div>
            </div>

            <Table>
                <TableHeader className="sr-only">
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 rounded-[8px] shrink-0">
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback className="rounded-[8px] bg-primary/15 text-primary text-xs font-bold">
                                            {user.full_name?.charAt(0) || user.email?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm text-foreground">{user.full_name || 'Anonymous'}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-[11px] font-semibold border capitalize ${
                                    user.role === 'admin'
                                        ? 'bg-primary/12 text-primary border-primary/20'
                                        : 'bg-muted/50 text-muted-foreground border-border/30'
                                }`}>
                                    {user.role}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy", { locale: dateFnsLocale }) : '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-[12px]">
                                {user.email}
                            </TableCell>
                            <TableCell className="text-right">
                                <button
                                    className="h-7 w-7 rounded-[8px] inline-flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all hover:scale-[1.05]"
                                    onClick={() => handleDelete(user.id)}
                                    title="Delete user"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
