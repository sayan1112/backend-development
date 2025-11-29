-- SkillLink Request Responses Table
-- For students responding to fulfill requests

CREATE TABLE IF NOT EXISTS public.request_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(request_id, responder_id)
);

-- Enable RLS
ALTER TABLE public.request_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view responses to their requests or their own responses" ON public.request_responses 
  FOR SELECT USING (
    auth.uid() = responder_id OR 
    auth.uid() IN (SELECT requester_id FROM public.requests WHERE id = request_id)
  );

CREATE POLICY "Users can insert their own responses" ON public.request_responses 
  FOR INSERT WITH CHECK (auth.uid() = responder_id);

CREATE POLICY "Responders can update their own responses" ON public.request_responses 
  FOR UPDATE USING (auth.uid() = responder_id);

CREATE POLICY "Request owners can update response status" ON public.request_responses 
  FOR UPDATE USING (
    auth.uid() IN (SELECT requester_id FROM public.requests WHERE id = request_id)
  );
