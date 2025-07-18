import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QueryEnhancementRequest {
  query: string;
  userHistory?: string[];
}

interface QueryEnhancementResponse {
  originalQuery: string;
  enhancedQuery: string;
  intent: 'legal_regulation_search' | 'case_search' | 'legal_advice' | 'general_search';
  legalTerms: string[];
  suggestedFilters?: {
    category?: string;
    court?: string;
    dateRange?: string;
  };
  confidence: number;
  suggestions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userHistory = [] }: QueryEnhancementRequest = await req.json();
    
    console.log('Processing query enhancement for:', query);

    if (!query?.trim()) {
      throw new Error('Query is required');
    }

    const systemPrompt = `Sen Türk hukuk sistemine özel bir AI query enhancement asistanısın. Kullanıcıların hukuki arama sorgularını analiz edip geliştiriyorsun.

Görevin:
1. Kullanıcı sorgusunu analiz et ve intent'ini belirle
2. Hukuki terimleri normalize et ve genişlet
3. İlgili sinonimler ve alt kategoriler ekle
4. Akıllı filtre önerileri sun
5. Alternatif arama önerileri üret

Intent kategorileri:
- legal_regulation_search: Mevzuat, kanun, yönetmelik araması
- case_search: Mahkeme kararları, emsal arama
- legal_advice: Hukuki görüş, yorum isteme
- general_search: Genel hukuki bilgi

Türk hukuku terimleri ve kategoriler:
- Aile Hukuku: boşanma, nafaka, velayet, miras
- Ceza Hukuku: suç, ceza, sorumluluk, dava
- İş Hukuku: işçi, işveren, iş sözleşmesi, kıdem
- Ticaret Hukuku: şirket, ticaret, sözleşme, borç

JSON formatında yanıt ver.`;

    const userPrompt = `Analiz edilecek sorgu: "${query}"

${userHistory.length > 0 ? `Kullanıcının önceki aramaları: ${userHistory.slice(-3).join(', ')}` : ''}

Bu sorguyu analiz et ve aşağıdaki JSON formatında yanıt ver:
{
  "originalQuery": "orijinal sorgu",
  "enhancedQuery": "geliştirilmiş sorgu (sinonimler, ilgili terimler eklenerek)",
  "intent": "intent kategorisi",
  "legalTerms": ["terim1", "terim2"],
  "suggestedFilters": {
    "category": "kategori_adi",
    "court": "mahkeme_turu",
    "dateRange": "tarih_araligi"
  },
  "confidence": 0.95,
  "suggestions": ["alternatif arama 1", "alternatif arama 2", "alternatif arama 3"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse JSON response from AI
    let enhancementResult: QueryEnhancementResponse;
    try {
      enhancementResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic enhancement
      enhancementResult = {
        originalQuery: query,
        enhancedQuery: query,
        intent: 'general_search',
        legalTerms: [query],
        confidence: 0.5,
        suggestions: []
      };
    }

    // Ensure confidence is within bounds
    enhancementResult.confidence = Math.min(Math.max(enhancementResult.confidence || 0.5, 0), 1);

    console.log('Enhancement result:', enhancementResult);

    return new Response(JSON.stringify(enhancementResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-query-enhancement function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Query enhancement failed', 
        details: error.message,
        fallback: {
          originalQuery: '',
          enhancedQuery: '',
          intent: 'general_search',
          legalTerms: [],
          confidence: 0,
          suggestions: []
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});