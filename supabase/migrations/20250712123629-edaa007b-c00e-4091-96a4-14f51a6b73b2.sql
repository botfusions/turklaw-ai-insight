-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  search_count INTEGER NOT NULL DEFAULT 0,
  max_searches INTEGER NOT NULL DEFAULT 5,
  monthly_search_count INTEGER NOT NULL DEFAULT 0,
  last_search_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_cases table
CREATE TABLE public.legal_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  court TEXT NOT NULL,
  decision_date DATE NOT NULL,
  case_number TEXT NOT NULL,
  department TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_text TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_searches table
CREATE TABLE public.user_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  search_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_cases table
CREATE TABLE public.saved_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.legal_cases(id) ON DELETE CASCADE,
  notes TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, case_id)
);

-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TL',
  max_searches INTEGER NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for legal_cases (public read access)
CREATE POLICY "Anyone can view legal cases" ON public.legal_cases
  FOR SELECT USING (true);

-- RLS Policies for user_searches
CREATE POLICY "Users can view own searches" ON public.user_searches
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own searches" ON public.user_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for saved_cases
CREATE POLICY "Users can view own saved cases" ON public.saved_cases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved cases" ON public.saved_cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved cases" ON public.saved_cases
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved cases" ON public.saved_cases
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, max_searches)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'plan' = 'pro' THEN 100
      WHEN NEW.raw_user_meta_data->>'plan' = 'enterprise' THEN 1000
      ELSE 5
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly searches
CREATE OR REPLACE FUNCTION public.reset_monthly_searches()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_search_reset < CURRENT_DATE THEN
    NEW.monthly_search_count = 0;
    NEW.last_search_reset = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_cases_updated_at
  BEFORE UPDATE ON public.legal_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER reset_monthly_searches_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.reset_monthly_searches();

-- Indexes for performance
CREATE INDEX idx_legal_cases_keywords ON public.legal_cases USING GIN(keywords);
CREATE INDEX idx_legal_cases_court ON public.legal_cases(court);
CREATE INDEX idx_legal_cases_date ON public.legal_cases(decision_date DESC);
CREATE INDEX idx_legal_cases_title_search ON public.legal_cases USING GIN(to_tsvector('turkish', title));
CREATE INDEX idx_legal_cases_summary_search ON public.legal_cases USING GIN(to_tsvector('turkish', summary));
CREATE INDEX idx_user_searches_user_date ON public.user_searches(user_id, search_date DESC);
CREATE INDEX idx_saved_cases_user ON public.saved_cases(user_id, saved_at DESC);

-- Insert subscription plans
INSERT INTO public.subscription_plans (id, name, price, max_searches, features, is_popular) VALUES
('free', 'Ücretsiz', 0.00, 5, ARRAY['5 aylık arama', 'Temel filtreleme', 'Kısıtlı sonuçlar'], false),
('pro', 'Pro', 49.99, 100, ARRAY['100 aylık arama', 'Gelişmiş filtreleme', 'Tam metin erişimi', 'Kaydetme özelliği'], true),
('enterprise', 'Kurumsal', 199.99, 1000, ARRAY['1000 aylık arama', 'Öncelikli destek', 'API erişimi', 'Toplu dışa aktarma', 'Özel raporlar'], false);

-- Insert sample legal cases
INSERT INTO public.legal_cases (title, court, decision_date, case_number, department, summary, full_text, keywords) VALUES
('İş Sözleşmesi Feshi ve Kıdem Tazminatı', 'Yargıtay 9. Hukuk Dairesi', '2023-10-15', '2023/1234', '9. Daire', 'İşverenin geçerli sebep göstermeksizin iş sözleşmesini feshetmesi durumunda işçinin kıdem ve ihbar tazminatı hakkı.', 'İşveren, iş sözleşmesini feshettiğinde geçerli bir sebep göstermek zorundadır. Aksi takdirde işçi kıdem ve ihbar tazminatı talep etme hakkına sahiptir. Bu durum İş Kanunu md. 17 ve 18''de düzenlenmiştir...', ARRAY['iş sözleşmesi', 'kıdem tazminatı', 'fesih', 'işçi hakları']),
('Trafik Kazası ve Tazminat Davası', 'İstanbul 2. Asliye Hukuk Mahkemesi', '2023-09-20', '2023/567', 'Hukuk', 'Trafik kazasında kusurlu sürücünün maddi ve manevi tazminat yükümlülüğü.', 'Trafik kazalarında kusurlu tarafın zararı tazmin etme yükümlülüğü vardır. Kasko sigortası bulunan araçlarda önce sigorta şirketi ödeme yapar, sonra rücu hakkını kullanır...', ARRAY['trafik kazası', 'tazminat', 'kusur', 'maddi zarar', 'manevi zarar']),
('Boşanma ve Velayet Davası', 'Ankara 3. Aile Mahkemesi', '2023-11-08', '2023/890', 'Aile', 'Boşanma davalarında çocuğun üstün yararı gözetilerek velayet kararı verilmesi.', 'Boşanma davalarında çocuğun velayeti, çocuğun üstün yararı gözetilerek karara bağlanır. Ana ve babanın ekonomik durumu, çocukla ilgilenme kapasitesi gibi faktörler değerlendirilir...', ARRAY['boşanma', 'velayet', 'çocuk hakları', 'aile hukuku']);