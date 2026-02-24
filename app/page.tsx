import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { YallaLogo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { LandingHeader } from "@/components/landing/LandingHeader";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white selection:bg-primary/30">
            <LandingHeader />

            <main className="flex-1">
                <LandingHero />
                <LandingFeatures />
                <LandingHowItWorks />
                <LandingTestimonials />
            </main>

            <LandingFooter />
        </div>
    );
}
