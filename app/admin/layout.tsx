import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Double check on server side layout as well
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.role === 'admin';
    }

    if (!user || !isAdmin) {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 hidden md:block">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader user={user!} />
                <main className="flex-1 overflow-y-auto p-8 bg-black/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
