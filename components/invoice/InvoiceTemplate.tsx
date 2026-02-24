"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { format } from "date-fns";

interface InvoiceData {
    bookingId: string;
    clientName: string;
    clientEmail: string;
    resourceName: string;
    resourceRate: number;
    shootDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export function InvoiceTemplate({ data }: { data: InvoiceData }) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = invoiceRef.current;
        if (!content) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${data.bookingId.slice(0, 8)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #111; }
                    .invoice { max-width: 700px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #7c3aed; }
                    .brand { font-size: 24px; font-weight: 900; color: #7c3aed; }
                    .brand-sub { font-size: 12px; color: #888; margin-top: 4px; }
                    .invoice-id { text-align: right; }
                    .invoice-id h2 { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
                    .invoice-id p { font-size: 18px; font-weight: 700; margin-top: 4px; }
                    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
                    .meta-block h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; }
                    .meta-block p { font-size: 14px; font-weight: 500; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; border-bottom: 1px solid #eee; }
                    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #f5f5f5; }
                    .total-row td { font-weight: 800; font-size: 18px; border-top: 2px solid #7c3aed; border-bottom: none; padding-top: 20px; }
                    .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; color: #aaa; font-size: 12px; }
                    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
                    .status-confirmed { background: #dcfce7; color: #16a34a; }
                    .status-pending { background: #fef3c7; color: #d97706; }
                    .status-rejected { background: #fee2e2; color: #dc2626; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <div>
                            <div class="brand">YallaViral</div>
                            <div class="brand-sub">Content Production Booking</div>
                        </div>
                        <div class="invoice-id">
                            <h2>Invoice</h2>
                            <p>#${data.bookingId.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    <div class="meta">
                        <div class="meta-block">
                            <h4>Billed To</h4>
                            <p>${data.clientName}</p>
                            <p style="color: #888; font-size: 13px;">${data.clientEmail}</p>
                        </div>
                        <div class="meta-block" style="text-align: right;">
                            <h4>Invoice Date</h4>
                            <p>${format(new Date(data.createdAt), "PPP")}</p>
                            <span class="status status-${data.status}">${data.status}</span>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Details</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>${data.resourceName}</strong></td>
                                <td>Shoot Date: ${format(new Date(data.shootDate), "PPP")}</td>
                                <td style="text-align: right; font-weight: 600;">${data.totalPrice.toLocaleString()} MAD</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="2">Total</td>
                                <td style="text-align: right; color: #7c3aed;">${data.totalPrice.toLocaleString()} MAD</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>YallaViral — Content Production Simplified</p>
                        <p style="margin-top: 4px;">Thank you for your business!</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 300);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white font-medium"
        >
            <Printer className="h-4 w-4 mr-2" /> Invoice
        </Button>
    );
}
