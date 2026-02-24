import * as React from 'react';

interface AdminNotificationTemplateProps {
    bookingId: string;
    customerName: string;
    amount: number;
}

export const AdminNotificationTemplate: React.FC<Readonly<AdminNotificationTemplateProps>> = ({
    bookingId,
    customerName,
    amount,
}) => (
    <div>
        <h1>New Booking Request!</h1>
        <p><strong>Customer:</strong> {customerName}</p>
        <p><strong>Booking ID:</strong> {bookingId}</p>
        <p><strong>Amount:</strong> {amount.toFixed(2)} MAD</p>
        <br />
        <p>Go to the <a href="http://localhost:3000/admin/bookings">Admin Dashboard</a> to review.</p>
    </div>
);
