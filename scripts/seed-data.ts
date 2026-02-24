
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

// Re-implement createAdminClient locally to avoid relative import issues with ts-node if paths aren't set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Please check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const models = [
    {
        name: "Kenza B.",
        type: "model",
        hourly_rate: 500,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        tags: ["Fashion", "Lifestyle", "Beauty", "Commercial"],
    },
    {
        name: "Omar T.",
        type: "model",
        hourly_rate: 600,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
        tags: ["Fitness", "Corporate", "Casual"],
    },
    {
        name: "Salma H.",
        type: "model",
        hourly_rate: 450,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
        tags: ["Hijab Fashion", "Traditional", "Elegant"],
    },
    {
        name: "Yassine E.",
        type: "model",
        hourly_rate: 550,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        tags: ["Tech", "Startup", "Youth"],
    },
    {
        name: "Noura A.",
        type: "model",
        hourly_rate: 700,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
        tags: ["Luxury", "Jewelry", "High Fashion"],
    },
    {
        name: "Mehdi L.",
        type: "model",
        hourly_rate: 400,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        tags: ["Streetwear", "Urban", "Casual"],
    },
    {
        name: "Sofia R.",
        type: "model",
        hourly_rate: 650,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
        tags: ["Beauty", "Skincare", "Natural"],
    },
    {
        name: "Amine K.",
        type: "model",
        hourly_rate: 500,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
        tags: ["Sports", "Action", "Outdoor"],
    },
];

const studios = [
    {
        name: "Studio Casa Light",
        type: "studio",
        hourly_rate: 1200,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
        tags: ["Cyclorama", "Green Screen", "Casablanca"],
    },
    {
        name: "Marrakech Daylight Loft",
        type: "studio",
        hourly_rate: 1500,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        tags: ["Natural Light", "Boho", "Marrakech"],
    },
    {
        name: "Tech Hub Studio",
        type: "studio",
        hourly_rate: 1000,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        tags: ["Modern", "Office Set", "Rabat"],
    },
    {
        name: "The Industrial Space",
        type: "studio",
        hourly_rate: 1400,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
        tags: ["Raw", "Concrete", "Tangier"],
    },
];

async function seed() {
    console.log('🌱 starting seed...');

    const resources = [...models, ...studios];

    let count = 0;
    for (const resource of resources) {
        const { error } = await supabase.from('resources').insert(resource);
        if (error) {
            console.error(`Error inserting ${resource.name}:`, error.message);
        } else {
            console.log(`Included ${resource.name}`);
            count++;
        }
    }

    console.log(`✅ Seed complete! Added ${count} resources.`);
}

seed();
