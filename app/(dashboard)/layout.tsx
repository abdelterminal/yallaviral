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
        <div className="min-h-screen bg-white font-sans selection:bg-primary/20 text-foreground flex">
            {/* Sidebar (Fixed Left) */}
            <div className="hidden md:block w-24 shrink-0 border-r border-transparent" />
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0">
                <Header profile={profile} />

                <main className="flex-1 p-6 md:p-10 z-10 bg-slate-50/50">
                    <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-500">
                        {children}
                    </div>
                </main>
            </div>
            <WhatsAppButton />
        </div>
    );
}
