"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("id");

    // WhatsApp Number (Replace with real one)
    const PHONE_NUMBER = "212600000000";
    const message = `Hello Mediast! I just placed a booking request #${bookingId}. Can we confirm the details?`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    return (
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-8 text-primary"
            >
                <CheckCircle2 className="h-32 w-32" />
            </motion.div>

            <h1 className="text-4xl font-black tracking-tighter mb-4">You're Viral! 🚀</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Your request <span className="font-mono text-primary font-bold">#{bookingId}</span> has been received.
                Finalize it with our team on WhatsApp to proceed.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg h-14">
                    <Link href={whatsappUrl} target="_blank">
                        <MessageCircle className="mr-2 h-6 w-6" />
                        Finalize on WhatsApp
                    </Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/">Back to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
