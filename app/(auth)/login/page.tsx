import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-muted/20">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-black tracking-tighter text-primary">YallaViral</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Login to continue</p>
                </div>
                <div className="space-y-4">
                    <Button className="w-full" size="lg">Sign in with Email</Button>
                    <Link href="/" className="block text-center text-sm underline text-muted-foreground">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
