-- Add photo_url column to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for activity photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('activity-photos', 'activity-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload activity photos
CREATE POLICY "Authenticated users can upload activity photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'activity-photos');

-- Allow public read access to activity photos
CREATE POLICY "Anyone can view activity photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'activity-photos');

-- Allow users to delete their own activity photos
CREATE POLICY "Users can delete own activity photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'activity-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
