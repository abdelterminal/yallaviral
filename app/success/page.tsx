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
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-8 text-primary"
            >
                <CheckCircle2 className="h-32 w-32" />
            </motion.div>

            <h1 className="flex items-center gap-2 text-4xl font-black tracking-tighter mb-4">
                {t('title')} <Rocket className="h-10 w-10 text-primary" />
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
                {t('description', { id: bookingId || '' })}
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                <p className="text-sm text-muted-foreground mb-4">
                    {t('reviewNote')}
                </p>
                <Button asChild size="lg" className="font-bold text-lg h-14">
                    <Link href="/requests">
                        {t('viewStatus')}
                    </Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/">{tc('backToDashboard')}</Link>
                </Button>
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
