import { createClient } from "@/utils/supabase/server";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

export default async function AdminBookingsPage() {
    const supabase = await createClient();
    const t = await getTranslations('Admin');

    const { data: bookings } = await supabase
        .from("bookings")
        .select(`
            *,
            profiles (
                email,
                full_name
            )
        `)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('bookingsTitle')}</h2>
                <p className="text-muted-foreground">{t('bookingsSubtitle')}</p>
            </div>

            <BookingsTable bookings={bookings || []} />
        </div>
    );
}
