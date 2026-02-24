-- Add distinct "Sets" for the studio
INSERT INTO resources (type, name, hourly_rate, tags, status, image_url) VALUES 
('studio', 'Podcast Corner 🎙️', 300, ARRAY['4 mics', 'soundproof', '4k cam'], 'active', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop'),
('studio', 'Vertical Set 📱', 200, ARRAY['ring light', 'color backdrop', 'iphone mount'], 'active', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=2070&auto=format&fit=crop'),
('studio', 'Lounge Area 🛋️', 400, ARRAY['casual', 'sofa', 'natural light'], 'active', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'),
('studio', 'Green Screen 🟩', 350, ARRAY['chroma key', 'vfx ready', 'lighting'], 'active', 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop');
