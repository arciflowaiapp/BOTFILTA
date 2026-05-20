-- BOTFILTA AI - Additional Schema
-- Run this AFTER the main schema.sql in your Supabase SQL editor

-- Workspace Settings (one row per workspace)
CREATE TABLE IF NOT EXISTS workspace_settings (
  workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  whatsapp_access_token TEXT,
  whatsapp_phone_number_id TEXT,
  whatsapp_verify_token TEXT DEFAULT 'botfilta_verify_2024',
  gemini_api_key TEXT,
  bot_enabled BOOLEAN DEFAULT true,
  business_name TEXT DEFAULT 'My Business',
  business_description TEXT DEFAULT 'A premium retail business.',
  ai_tone TEXT DEFAULT 'friendly' CHECK (ai_tone IN ('professional', 'friendly', 'casual')),
  ai_language TEXT DEFAULT 'both' CHECK (ai_language IN ('en', 'ur', 'both')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workspace settings" ON workspace_settings
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  );

CREATE TRIGGER workspace_settings_updated_at BEFORE UPDATE ON workspace_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Ensure RLS policies exist for workspaces and profiles
CREATE POLICY IF NOT EXISTS "Users can view own workspace" ON workspaces
  FOR SELECT USING (
    id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
  FOR ALL USING (id = auth.uid());

-- Add realtime for settings
ALTER PUBLICATION supabase_realtime ADD TABLE workspace_settings;
