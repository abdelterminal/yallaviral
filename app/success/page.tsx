"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

function SuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("id");
    const t = useTranslations('Success');
    const tc = useTranslations('Common');

    // WhatsApp Number (Replace with real one)
    const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
    const message = t('whatsappMessage', { id: bookingId || '' });
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-card rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] p-12 flex flex-col items-center text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mb-8 text-primary"
                >
                    <CheckCircle2 className="h-24 w-24" />
                </motion.div>

                <h1 className="flex items-center gap-2 text-4xl font-black tracking-tighter mb-4">
                    {t('title')} <Rocket className="h-9 w-9 text-primary" />
                </h1>
                <p className="text-muted-foreground text-base mb-8 max-w-xs">
                    {t('description', { id: bookingId || '' })}
                </p>

                <div className="flex flex-col gap-3 w-full">
                    <p className="text-sm text-muted-foreground mb-2">
                        {t('reviewNote')}
                    </p>
                    <Button asChild size="lg" className="w-full font-bold text-base h-14">
                        <Link href="/requests">
                            {t('viewStatus')}
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                        <Link href="/dashboard">{tc('backToDashboard')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
