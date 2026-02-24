import * as React from 'react';

interface BookingApprovedTemplateProps {
    customerName: string;
    bookingId: string;
}

export const BookingApprovedTemplate: React.FC<Readonly<BookingApprovedTemplateProps>> = ({
    customerName,
    bookingId,
}) => (
    <div>
        <h1>Great news, {customerName}!</h1>
        <p>Your booking request (ID: <strong>{bookingId}</strong>) has been <strong>APPROVED</strong>.</p>
        <p>Our team is now preparing the shoot. You can view the status in your dashboard.</p>
        <br />
        <p>Best,</p>
        <p>The YallaViral Team</p>
    </div>
);
