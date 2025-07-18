
-- Real-time bildirimler için notifications tablosu
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_url TEXT,
  action_label TEXT
);

-- RLS politikaları
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Real-time için yapılandırma
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Arama önerileri tablosu
CREATE TABLE public.search_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion TEXT NOT NULL,
  category TEXT,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE public.search_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view search suggestions" ON public.search_suggestions 
  FOR SELECT TO authenticated USING (true);

-- Kullanıcı abonelikleri tablosu
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subscription_type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscriptions" ON public.user_subscriptions 
  FOR ALL USING (auth.uid() = user_id);

-- Real-time için yapılandırma
ALTER TABLE public.user_subscriptions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;

-- Kaydedilmiş aramalar tablosu
CREATE TABLE public.saved_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved searches" ON public.saved_searches 
  FOR ALL USING (auth.uid() = user_id);

-- Real-time için yapılandırma
ALTER TABLE public.saved_searches REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_searches;

-- Bazı örnek arama önerileri ekleyelim
INSERT INTO public.search_suggestions (suggestion, category, popularity_score) VALUES
('İcra İflas Kanunu', 'mevzuat', 85),
('Borçlar Kanunu', 'mevzuat', 92),
('İş Kanunu', 'mevzuat', 78),
('Ticaret Kanunu', 'mevzuat', 71),
('Yargıtay kararları', 'mahkeme', 89),
('Danıştay kararları', 'mahkeme', 76),
('Anayasa Mahkemesi', 'mahkeme', 68),
('Tazminat davası', 'konu', 82),
('İşten çıkarma', 'konu', 74),
('Kira sözleşmesi', 'konu', 79);
