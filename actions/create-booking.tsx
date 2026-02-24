"use server";

import { createClient } from "@/utils/supabase/server";
import { resend } from "@/lib/resend";
import { BookingReceivedTemplate } from "@/components/emails/BookingReceivedTemplate";
import { AdminNotificationTemplate } from "@/components/emails/AdminNotificationTemplate";
import { z } from "zod";
import { actionRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const CreateBookingSchema = z.object({
    resourceId: z.string().uuid("Invalid resource ID"),
    date: z.coerce.date(),
    timeSlot: z.string().min(1, "Time slot is required"),
    notes: z.string().optional()
});

const CreateCampaignBookingSchema = z.object({
    models: z.array(z.object({
        id: z.string().uuid("Invalid model ID"),
        quantity: z.number().min(1)
    })).min(0),
    studioId: z.string().uuid().optional().nullable(),
    globalQuantity: z.number().min(1),
    videoStyle: z.string().min(1, "Video style is required"),
    date: z.coerce.date().optional(),
    time: z.string().optional()
});

export async function createBooking(
    resourceId: string,
    userId: string | null,
    date: Date,
    timeSlot: string,
    totalPriceFromClient: number, // Still accepting but we will ignore it for security
    notes?: string
) {
    const parsed = CreateBookingSchema.safeParse({ resourceId, date, timeSlot, notes });
    if (!parsed.success) {
        return { success: false, error: "Invalid input data: " + parsed.error.issues[0].message };
    }

    // Rate limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const rateLimit = await checkRateLimit(actionRateLimit, `booking_${ip}`, "Create Booking");
    if (!rateLimit.success) return rateLimit;


    const supabaseServer = await createClient();

    // We shouldn't rely on the passed-in `userId` from the client if it's an authenticated route
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
        return { success: false, error: "Authentication required to book a studio." };
    }

    // Securely calculate total price server-side
    const { data: resourceData } = await supabaseServer
        .from("resources")
        .select("hourly_rate")
        .eq("id", resourceId)
        .single();

    const hourlyRate = resourceData?.hourly_rate || 0;
    const bookingDurationHours = 2; // Default 2-hour booking (matches end_time calculation below)
    const secureTotalPrice = hourlyRate * bookingDurationHours;

    // 1. Insert Booking
    const { data, error } = await supabaseServer
        .from("bookings")
        .insert([
            {
                user_id: user.id, // Use verified user.id instead of the arg
                resource_id: resourceId,
                // Parse time slot
                // let bookingDate = date ? new Date(date) : new Date();
                // if(timeSlot) { ... }
                // For this function, let's keep it simple as it's not the main focus, but we should fix it if used.
                // Assuming this function is for single resource booking which might use a different flow?
                // Replicating logic for correctness:
                start_time: (() => {
                    let d = new Date(date);
                    if (timeSlot) {
                        const [timePart, modifier] = timeSlot.split(' ');
                        if (timePart && modifier) {
                            let [hours, minutes] = timePart.split(':').map(Number);
                            if (modifier === 'PM' && hours < 12) hours += 12;
                            if (modifier === 'AM' && hours === 12) hours = 0;
                            d.setHours(hours, minutes, 0, 0);
                        }
                    }
                    return d.toISOString();
                })(),
                end_time: (() => {
                    let d = new Date(date);
                    if (timeSlot) {
                        const [timePart, modifier] = timeSlot.split(' ');
                        if (timePart && modifier) {
                            let [hours, minutes] = timePart.split(':').map(Number);
                            if (modifier === 'PM' && hours < 12) hours += 12;
                            if (modifier === 'AM' && hours === 12) hours = 0;
                            d.setHours(hours + 2, minutes, 0, 0); // +2 hours
                        }
                    }
                    return d.toISOString();
                })(),
                status: "pending",
                total_price: secureTotalPrice,
                metadata: parsed.data.notes ? { notes: parsed.data.notes } : null
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Booking Error:", error);
        return { success: false, error: error.message };
    }

    return { success: true, bookingId: data.id };
}

// Separate action for Campaign since it has multiple resources
export async function createCampaignBooking(
    models: { id: string, quantity: number }[],
    studioId: string | null,
    globalQuantity: number,
    videoStyle: string,
    totalPriceFromClient: number, // Ignore for security
    date: Date | undefined,
    time: string | undefined
) {
    const parsed = CreateCampaignBookingSchema.safeParse({ models, studioId, globalQuantity, videoStyle, date, time });
    if (!parsed.success) {
        return { success: false, error: "Invalid input data: " + parsed.error.issues[0].message };
    }

    // Rate limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const rateLimit = await checkRateLimit(actionRateLimit, `campaign_${ip}`, "Create Campaign");
    if (!rateLimit.success) return rateLimit;


    const supabaseServer = await createClient();

    // We need a valid user_id that exists in 'profiles' table.
    // Fetch the authenticated user from the server-side session
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
        console.error("No authenticated user found.");
        return { success: false, error: "You must be logged in to create a campaign." };
    }

    const userId = user.id;

    // Server-Side Pricing Calculation
    const allResourceIds = parsed.data.models.map(m => m.id);
    if (parsed.data.studioId) allResourceIds.push(parsed.data.studioId);

    const { data: resources } = await supabaseServer
        .from("resources")
        .select("id, hourly_rate")
        .in("id", allResourceIds);

    const hasNoTalent = parsed.data.models.length === 0;
    const totalVideos = hasNoTalent ? parsed.data.globalQuantity : parsed.data.models.reduce((acc, m) => acc + m.quantity, 0);

    let modelsCost = 0;
    parsed.data.models.forEach(modelReq => {
        const dbModel = resources?.find(r => r.id === modelReq.id);
        if (dbModel) {
            modelsCost += dbModel.hourly_rate * modelReq.quantity;
        }
    });

    const recommendedHours = Math.max(2, Math.ceil(totalVideos * 0.5));
    const estimatedHours = parsed.data.studioId ? recommendedHours : 0;
    let finalStudioCost = 0;
    if (parsed.data.studioId) {
        const dbStudio = resources?.find(r => r.id === parsed.data.studioId);
        if (dbStudio) {
            finalStudioCost = dbStudio.hourly_rate * estimatedHours;
        }
    }

    const platformFee = (modelsCost + finalStudioCost) * 0.1;
    const secureTotalPrice = modelsCost + finalStudioCost + platformFee;

    // Parse time slot (e.g., "09:00 AM")
    let bookingDate = new Date();
    if (date) {
        bookingDate = new Date(date);
    }

    if (time) {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        bookingDate.setHours(hours, minutes, 0, 0);
    }

    // Default duration 2 hours
    const endDate = new Date(bookingDate);
    endDate.setHours(endDate.getHours() + 2);

    const { data, error } = await supabaseServer
        .from("bookings")
        .insert([
            {
                user_id: userId,
                resource_id: parsed.data.models.length > 0 ? parsed.data.models[0].id : null,
                start_time: bookingDate.toISOString(),
                end_time: endDate.toISOString(),
                status: "pending",
                total_price: secureTotalPrice,
                metadata: {
                    models: parsed.data.models,
                    studioId: parsed.data.studioId,
                    globalQuantity: parsed.data.globalQuantity,
                    videoStyle: parsed.data.videoStyle
                }
            },
        ])
        .select(`
            *,
            profiles (
                email,
                full_name
            )
        `)
        .single();

    if (error) {
        console.error("Campaign Booking Error:", error);
        return { success: false, error: error.message };
    }

    // Send Emails
    try {
        const userEmail = data.profiles?.email;
        const userName = data.profiles?.full_name || "Valued Customer";

        if (userEmail) {
            // 1. Send confirmation to User
            const { error: userEmailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL!,
                to: userEmail,
                subject: 'Booking Request Received',
                react: <BookingReceivedTemplate customerName={userName} bookingId={data.id} />,
            });

            if (userEmailError) {
                console.error("Resend Error (User):", userEmailError);
            }

            // 2. Send notification to Admin
            const { error: adminEmailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL!,
                to: process.env.ADMIN_NOTIFICATION_EMAIL!,
                subject: 'New Booking Request',
                react: <AdminNotificationTemplate
                    bookingId={data.id}
                    customerName={userName}
                    amount={secureTotalPrice}
                />,
            });

            if (adminEmailError) {
                console.error("Resend Error (Admin):", adminEmailError);
            }
        }
    } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't fail the request if email fails, just log it.
    }

    return { success: true, bookingId: data.id };
}
