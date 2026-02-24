import * as React from 'react';

interface BookingRejectedTemplateProps {
    customerName: string;
    bookingId: string;
}

export const BookingRejectedTemplate: React.FC<Readonly<BookingRejectedTemplateProps>> = ({
    customerName,
    bookingId,
}) => (
    <div>
        <h1>Hi {customerName},</h1>
        <p>Regarding your booking request (ID: <strong>{bookingId}</strong>).</p>
        <p>Unfortunately, we are unable to fulfill this request at this time. This could be due to talent unavailability or scheduling conflicts.</p>
        <p>Please check your dashboard for more details or submit a new request.</p>
        <br />
        <p>Best,</p>
        <p>The YallaViral Team</p>
    </div>
);
