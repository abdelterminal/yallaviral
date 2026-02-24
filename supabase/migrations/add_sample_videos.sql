-- Add sample_videos column
ALTER TABLE resources ADD COLUMN IF NOT EXISTS sample_videos TEXT[];

-- Update existing models with dummy portfolio data (using images as video thumbnails for now)
UPDATE resources 
SET sample_videos = ARRAY[
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592598015799-35492b4516a5?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop'
]
WHERE type = 'model';
