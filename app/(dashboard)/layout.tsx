import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 text-foreground flex">
            {/* Sidebar (Fixed Left) */}
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0">
                <Header profile={profile} />

                <main className="flex-1 p-4 md:p-8 z-10">
                    <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-500">
                        {children}
                    </div>
                </main>
            </div>
            <WhatsAppButton />
        </div>
    );
}
