import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoOff } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white space-y-6">
            <div className="relative">
                <VideoOff className="h-24 w-24 text-gray-700" />
                <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 animate-pulse" />
            </div>

            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-center">
                404: Content Not Found
            </h1>

            <p className="text-gray-400 text-lg max-w-md text-center">
                This page didn't go viral. In fact, it doesn't even exist.
                Let's get you back to creating.
            </p>

            <Link href="/dashboard">
                <Button size="lg" className="font-bold">
                    Return to Dashboard
                </Button>
            </Link>
        </div>
    );
}
