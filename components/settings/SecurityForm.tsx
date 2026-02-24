"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/actions/settings";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

export function SecurityForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordStrength = (() => {
        if (newPassword.length === 0) return 0;
        let score = 0;
        if (newPassword.length >= 8) score++;
        if (/[A-Z]/.test(newPassword)) score++;
        if (/[0-9]/.test(newPassword)) score++;
        if (/[^A-Za-z0-9]/.test(newPassword)) score++;
        return score;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
    const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"][passwordStrength];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const result = await changePassword(newPassword, confirmPassword);

        if (result.error) {
            toast.error("Failed", { description: result.error });
        } else {
            toast.success("Password updated successfully");
            setNewPassword("");
            setConfirmPassword("");
        }

        setSaving(false);
    }

    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password. You&apos;ll stay logged in after changing it.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <div className="relative">
                            <Input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors pr-10"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                            >
                                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {newPassword.length > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1 flex-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColor : "bg-white/10"}`} />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{strengthLabel}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors pr-10"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-400">Passwords don&apos;t match</p>
                        )}
                        {confirmPassword.length > 0 && newPassword === confirmPassword && (
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Passwords match
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 px-6 py-4 flex justify-end">
                    <Button
                        type="submit"
                        disabled={saving || newPassword.length < 8 || newPassword !== confirmPassword}
                        className="font-bold"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Update Password
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
