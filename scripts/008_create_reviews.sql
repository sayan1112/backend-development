-- SkillLink Reviews Table
-- For ratings and reviews

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL, -- Can be product_id, service_id, or user_id
  target_type TEXT NOT NULL CHECK (target_type IN ('product', 'service', 'user')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reviewer_id, target_id, target_type)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view reviews" ON public.reviews 
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.reviews 
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews 
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews 
  FOR DELETE USING (auth.uid() = reviewer_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_target ON public.reviews(target_id, target_type);
