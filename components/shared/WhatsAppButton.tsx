"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show after a small delay to not block initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const phoneNumber = "212600000000"; // Replace with your actual Moroccan number
    const message = encodeURIComponent("Salam team Yalla Viral, I would like to know more about your services.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 animate-in fade-in zoom-in"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm hidden md:block">
                Chat with us
            </span>
        </a>
    );
}
