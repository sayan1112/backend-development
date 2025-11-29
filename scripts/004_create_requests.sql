-- SkillLink Requests Table
-- For posting urgent needs like "Need HDMI cable for 1 hour"

CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  location TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fulfilled', 'closed')),
  fulfilled_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for requests
CREATE POLICY "Anyone can view requests" ON public.requests 
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own requests" ON public.requests 
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters can update their own requests" ON public.requests 
  FOR UPDATE USING (auth.uid() = requester_id);

CREATE POLICY "Requesters can delete their own requests" ON public.requests 
  FOR DELETE USING (auth.uid() = requester_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_requests_category ON public.requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON public.requests(urgency);
