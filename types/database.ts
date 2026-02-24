export type ResourceType = 'model' | 'studio' | 'gear';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected';

export interface Resource {
    id: string;
    created_at: string;
    type: ResourceType;
    name: string;
    hourly_rate: number;
    image_url: string | null;
    tags: string[] | null;
    status: 'active' | 'inactive';
    sample_videos?: string[];
    metadata?: Record<string, any> | null;
}

export interface Booking {
    id: string;
    created_at: string;
    user_id: string;
    resource_id: string | null;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    total_price: number;
    metadata?: Record<string, any> | null;
}

export interface Profile {
    id: string;
    created_at: string;
    full_name: string | null;
    brand_name: string | null;
    phone: string | null;
    email: string | null;
    role: 'admin' | 'client';
}
