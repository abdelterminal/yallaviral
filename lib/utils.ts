import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type StatusVariant = "pending" | "confirmed" | "rejected" | "completed" | "unpaid" | "paid" | "secondary" | "outline";

export function getStatusBadgeVariant(status: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    pending: "pending",
    confirmed: "confirmed",
    rejected: "rejected",
    completed: "completed",
    unpaid: "unpaid",
    paid: "paid",
  };
  return map[status] ?? "outline";
}
