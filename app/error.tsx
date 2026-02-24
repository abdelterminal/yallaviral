"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white space-y-6">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>

            <h2 className="text-3xl font-black tracking-tighter text-center">
                Something went wrong!
            </h2>

            <p className="text-gray-400 text-center max-w-md">
                Production error. We've logged this issue and our team is looking into it.
            </p>

            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="secondary">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
