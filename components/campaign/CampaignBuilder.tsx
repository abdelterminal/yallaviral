"use client";

import { useState, useEffect } from 'react';
import { Resource } from '@/types/database';
import { useCampaignStore } from '@/store/useCampaignStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Film, CalendarIcon, Rocket, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { Timeline, TimelineStep } from '@/components/ui/Timeline';
import { CampaignSetupStep } from './steps/CampaignSetupStep';
import { TalentSelectionStep } from './steps/TalentSelectionStep';
import { VideoStyleStep } from './steps/VideoStyleStep';
import { StudioSelectionStep } from './steps/StudioSelectionStep';
import { CreativeBriefStep } from './steps/CreativeBriefStep';
import { CalendarStep } from './steps/CalendarStep';
import { createCampaignBooking } from '@/actions/create-booking';
import { useRouter } from 'next/navigation';

interface CampaignBuilderProps {
    availableModels: Resource[];
    availableStudios: Resource[];
}

export function CampaignBuilder({ availableModels, availableStudios }: CampaignBuilderProps) {
    const { selectedModels, date, time, reset, selectedStudio, globalQuantity, globalVideoStyle } = useCampaignStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('Campaign');
    const tc = useTranslations('Common');

    // Steps Definition (inside component to access translations)
    const ALL_STEPS: TimelineStep[] = [
        { id: 'setup', title: t('stepSetup'), description: t('stepSetupDesc') },
        { id: 'talent', title: t('stepTalent'), description: t('stepTalentDesc') },
        { id: 'style', title: t('stepStyle'), description: t('stepStyleDesc') },
        { id: 'studio', title: t('stepStudio'), description: t('stepStudioDesc') },
        { id: 'brief', title: t('stepBrief'), description: t('stepBriefDesc') },
        { id: 'schedule', title: t('stepSchedule'), description: t('stepScheduleDesc') },
        { id: 'review', title: t('stepReview'), description: t('stepReviewDesc') },
    ];

    // State Machine
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [skippedSteps, setSkippedSteps] = useState<string[]>([]);

    // Derived Steps (filtering out skipped ones)
    const activeSteps = ALL_STEPS.filter(step => !skippedSteps.includes(step.id));
    const currentStep = activeSteps[currentStepIndex];

    console.log("Active Steps:", activeSteps);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Handlers
    const handleNext = () => {
        if (currentStepIndex < activeSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        } else {
            // If back from first step, maybe reset skipped steps?
            // For now just stay.
        }
    };

    const handleSetupComplete = (hasTalent: boolean, hasScript: boolean) => {
        const newSkipped = [];
        if (hasTalent) {
            newSkipped.push('talent');
        }
        setSkippedSteps(newSkipped);
        setTimeout(() => handleNext(), 100); // Small delay for animation
    };

    // Calculate Total Price
    const hasNoTalent = selectedModels.length === 0;
    const totalVideos = hasNoTalent ? globalQuantity : selectedModels.reduce((acc, m) => acc + (m.quantity || 1), 0);

    // Model Cost
    const modelsCost = selectedModels.reduce((acc, m) => acc + m.hourly_rate * (m.quantity || 1), 0);

    // Studio Cost
    const recommendedHours = Math.max(2, Math.ceil(totalVideos * 0.5)); // Estimate: 30 mins per video, min 2 hours
    const estimatedHours = selectedStudio ? recommendedHours : 0;
    const finalStudioCost = selectedStudio ? selectedStudio.hourly_rate * estimatedHours : 0;

    const platformFee = (modelsCost + finalStudioCost) * 0.1;
    const total = modelsCost + finalStudioCost + platformFee;

    const handleLaunch = async () => {
        setIsLoading(true);
        try {
            const models = selectedModels.map(m => ({ id: m.id, quantity: m.quantity || 1 }));
            const studioId = selectedStudio ? selectedStudio.id : null;
            const style = hasNoTalent ? globalVideoStyle : "Per Model";

            const res = await createCampaignBooking(
                models,
                studioId,
                globalQuantity,
                style,
                total,
                date,
                time
            );

            if (res.success && 'bookingId' in res) {
                reset(); // Clear store after successful booking
                router.push(`/success?id=${res.bookingId}`);
            } else if (!res.success && 'error' in res) {
                alert(t('launchFailed') + ": " + (res.error || t('unexpectedError')));
            } else {
                alert(t('launchFailed'));
            }
        } catch (error) {
            console.error("Booking failed", error);
            alert(t('unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Render Current Step Content
    const renderStepContent = () => {
        switch (currentStep.id) {
            case 'setup':
                return <CampaignSetupStep onComplete={handleSetupComplete} />;
            case 'talent':
                return (
                    <TalentSelectionStep
                        availableModels={availableModels}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 'style': // Added Video Style step case
                return (
                    <VideoStyleStep
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 'studio':
                return (
                    <StudioSelectionStep
                        availableStudios={availableStudios}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 'brief':
                return <CreativeBriefStep onNext={handleNext} onBack={handleBack} />;
            case 'schedule':
                return <CalendarStep onNext={handleNext} onBack={handleBack} />;
            case 'review':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                                {t('reviewTitle')} <Rocket className="h-8 w-8 text-primary" />
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                {t('reviewSubtitle')}
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Summary Card */}
                            <Card className="p-6 space-y-4 h-fit">
                                <h3 className="font-bold text-xl">{t('campaignRequest')}</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">{t('shootDate')}</span>
                                        <span className="font-medium flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4" />
                                            {date ? format(date, "MMM do, yyyy") : t('tbd')} {time ? `${t('at')} ${time}` : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">{t('totalVideoCount')}</span>
                                        <span className="font-medium">
                                            {totalVideos}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">{t('talentCount')}</span>
                                        <span className="font-medium">{hasNoTalent ? t('ownTalent') : selectedModels.length}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">{t('studio')}</span>
                                        <span className="font-medium">{selectedStudio?.name || tc('none')}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Quote Card */}
                            <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
                                <h3 className="font-bold text-xl text-primary">{t('estimatedQuote')}</h3>
                                <div className="space-y-2">
                                    {selectedModels.map(model => (
                                        <div key={model.id} className="flex justify-between text-sm">
                                            <span>{model.name} (x{model.quantity || 1})</span>
                                            <span>{(model.hourly_rate * (model.quantity || 1)).toFixed(2)} MAD</span>
                                        </div>
                                    ))}
                                    {hasNoTalent && (
                                        <div className="flex justify-between text-sm">
                                            <span>{t('production')} (x{globalQuantity})</span>
                                            <span className="text-muted-foreground italic">{t('quotedLater')}</span>
                                        </div>
                                    )}
                                    {selectedStudio && (
                                        <div className="flex justify-between text-sm">
                                            <span>{t('studio')} ({selectedStudio.name}) - {estimatedHours}h</span>
                                            <span>{finalStudioCost.toFixed(2)} MAD</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t border-dashed border-primary/20">
                                        <span>{t('platformFee')}</span>
                                        <span>{platformFee.toFixed(2)} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black pt-4 border-t border-primary/20">
                                        <span>{tc('total')}</span>
                                        <span>{total.toFixed(2)} MAD</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full font-bold text-lg h-12 shadow-lg shadow-primary/25 mt-4"
                                    onClick={handleLaunch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('submitting') : t('submitRequest')}
                                </Button>
                            </Card>
                        </div>

                        <Button variant="ghost" onClick={handleBack} className="mt-4">{tc('back')}</Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-xl animate-in fade-in duration-300">
                    <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-widest text-white">{t('launchingCampaign')}</h3>
                    <p className="text-muted-foreground mt-2">{t('securingSlots')}</p>
                </div>
            )}

            <div className={cn("grid lg:grid-cols-[250px_1fr] gap-8 items-start transition-opacity duration-300", isLoading ? "opacity-30 pointer-events-none" : "opacity-100")}>
                {/* Left Sidebar: Timeline */}
                <div className="hidden lg:block sticky top-24">
                    <Timeline steps={activeSteps} currentStep={currentStepIndex} />
                </div>

                {/* Right Content: Current Step */}
                <div className="min-h-[500px]">
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
}
