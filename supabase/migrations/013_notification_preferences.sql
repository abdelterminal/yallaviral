-- Notification preferences for users
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS notify_campaign_updates BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS notify_deliverables BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS notify_marketing BOOLEAN DEFAULT false;
