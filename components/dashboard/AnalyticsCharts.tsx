"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { format, parseISO, startOfMonth } from "date-fns";
import { Card } from "@/components/ui/card";

interface Booking {
    total_price: number;
    status: string;
    created_at: string;
}

interface AnalyticsChartsProps {
    bookings: Booking[];
}

const STATUS_COLORS: Record<string, string> = {
    pending: "#d97706",
    confirmed: "#2d9660",
    rejected: "#dc2626",
    completed: "#2d82a0",
};

export function AnalyticsCharts({ bookings }: AnalyticsChartsProps) {
    // Build monthly spending data
    const monthlyMap: Record<string, number> = {};
    bookings.forEach((b) => {
        const key = format(startOfMonth(parseISO(b.created_at)), "MMM yyyy");
        monthlyMap[key] = (monthlyMap[key] || 0) + (b.total_price || 0);
    });

    const spendingData = Object.entries(monthlyMap)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([month, total]) => ({ month, total: Math.round(total) }));

    // Build status distribution data
    const statusMap: Record<string, number> = {};
    bookings.forEach((b) => {
        statusMap[b.status] = (statusMap[b.status] || 0) + 1;
    });

    const statusData = Object.entries(statusMap).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: STATUS_COLORS[name] || "#94a3b8",
    }));

    if (bookings.length === 0) return null;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Spending Over Time */}
            <Card className="p-6 space-y-4">
                <div>
                    <h3 className="text-[15px] font-bold text-foreground">Spending Over Time</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Monthly MAD spend</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={spendingData} margin={{ top: 4, right: 4, left: -6, bottom: 0 }}>
                        <defs>
                            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "hsl(215, 16%, 55%)", fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "hsl(215, 16%, 55%)", fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}`}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{
                                background: "hsl(215, 28%, 17%)",
                                border: "none",
                                borderRadius: "12px",
                                padding: "8px 16px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "hsl(214, 32%, 95%)",
                                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.6)"
                            }}
                            itemStyle={{ color: "hsl(214, 32%, 75%)" }}
                            formatter={(value) => [`${value ?? 0} MAD`, "Spend"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="hsl(var(--primary))"
                            strokeWidth={4}
                            strokeLinecap="round"
                            fill="url(#spendGradient)"
                            activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            {/* Status Distribution */}
            <Card className="p-6 space-y-4">
                <div>
                    <h3 className="text-[15px] font-bold text-foreground">Booking Status</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Distribution by status</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: "hsl(215, 28%, 17%)",
                                border: "none",
                                borderRadius: "12px",
                                padding: "8px 16px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "hsl(214, 32%, 95%)",
                                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.6)"
                            }}
                            itemStyle={{ color: "hsl(214, 32%, 75%)" }}
                            formatter={(value, name) => [value ?? 0, name]}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span style={{ fontSize: 12, color: "hsl(215, 16%, 55%)", fontWeight: 600, marginLeft: "4px" }}>{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
