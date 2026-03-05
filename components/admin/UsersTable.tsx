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
        <div className="rounded-md border border-border bg-card backdrop-blur-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-foreground">User</TableHead>
                        <TableHead className="text-foreground">Role</TableHead>
                        <TableHead className="text-foreground">Joined</TableHead>
                        <TableHead className="text-foreground">Email</TableHead>
                        <TableHead className="text-right text-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="border-border hover:bg-muted/50">
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback>{user.full_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{user.full_name || 'Anonymous'}</span>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`capitalize ${user.role === 'admin' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {user.created_at ? format(new Date(user.created_at), "MMM do, yyyy", { locale: dateFnsLocale }) : '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs">
                                {user.email}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-destructive hover:bg-red-500/20"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
