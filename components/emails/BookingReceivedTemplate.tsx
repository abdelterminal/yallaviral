import * as React from 'react';

interface BookingReceivedTemplateProps {
    customerName: string;
    bookingId: string;
}

export const BookingReceivedTemplate: React.FC<Readonly<BookingReceivedTemplateProps>> = ({
    customerName,
    bookingId,
}) => (
    <div>
        <h1>Hi {customerName},</h1>
        <p>Thanks for your booking request (ID: <strong>{bookingId}</strong>).</p>
        <p>We have received your brief and are reviewing it. You will receive another email once your booking is confirmed.</p>
        <br />
        <p>Best,</p>
        <p>The YallaViral Team</p>
    </div>
);
