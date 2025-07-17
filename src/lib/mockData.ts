import { LegalCase, SubscriptionPlan } from '@/types';

export const mockCases: LegalCase[] = [
  {
    id: '1',
    title: 'Tazminat Davası - İş Kazası Sonucu Manevi Tazminat Talebi',
    court: 'Yargıtay 21. Hukuk Dairesi',
    date: '2024-03-15',
    caseNumber: '2024/1234 E., 2024/5678 K.',
    department: '21. Hukuk Dairesi',
    summary: 'İş kazası sonucu yaralanan işçinin manevi tazminat talebinin değerlendirilmesi. Mahkeme, işverenin kusuru bulunduğu takdirde tazminat ödenmesine karar vermiştir.',
    fullText: `YARGITAY 21. HUKUK DAİRESİ

Esas No: 2024/1234
Karar No: 2024/5678
Karar Tarihi: 15.03.2024

ÖZET: İş kazası sonucu yaralanan işçinin manevi tazminat talebi

KARAR:
Dava, iş kazası sonucu yaralanan davacının manevi tazminat talebine ilişkindir. 
Mahkemece yapılan inceleme sonucunda, işverenin iş güvenliği tedbirlerini almakta 
kusurlu davrandığı tespit edilmiştir. Bu negatifde, İş Kanunu hükümleri gereğince
tazminat ödenmesine karar verilmiştir.

Sonuç: Davanın kabulü ile 50.000 TL manevi tazminat ödenmesine karar verilmiştir.`,
    keywords: ['tazminat', 'iş kazası', 'manevi tazminat', 'işveren kusuru']
  },
  {
    id: '2',
    title: 'Boşanma Davası - Eşler Arası Geçimsizlik Nedeniyle Boşanma',
    court: 'Yargıtay 2. Hukuk Dairesi',
    date: '2024-02-28',
    caseNumber: '2024/2468 E., 2024/1357 K.',
    department: '2. Hukuk Dairesi',
    summary: 'Eşler arasındaki sürekli anlaşmazlık ve geçimsizlik nedeniyle açılan boşanma davasında mahkeme, evlilik birliğinin temelinden sarsıldığına karar vermiştir.',
    fullText: `YARGITAY 2. HUKUK DAİRESİ

Esas No: 2024/2468
Karar No: 2024/1357
Karar Tarihi: 28.02.2024

ÖZET: Geçimsizlik nedeniyle boşanma davası

KARAR:
TMK 166/3 maddesi gereğince, eşlerin ortak hayatı temelinden sarsacak derecede
geçimsizlik yaşadıkları, bu durumun da evlilik birliğinin devamını imkansız
kıldığı tespit edilmiştir.

Sonuç: Boşanma davasının kabulü ile evlilik birliğinin sona erdirilmesine karar verilmiştir.`,
    keywords: ['boşanma', 'geçimsizlik', 'TMK 166/3', 'evlilik birliği']
  },
  {
    id: '3',
    title: 'Sözleşme İhlali - Satış Sözleşmesinin İfası ve Tazminat',
    court: 'Yargıtay 19. Hukuk Dairesi',
    date: '2024-01-20',
    caseNumber: '2024/3691 E., 2024/2580 K.',
    department: '19. Hukuk Dairesi',
    summary: 'Satıcının sözleşme yükümlülüklerini yerine getirmemesi nedeniyle açılan ifa ve tazminat davasında alıcının hakları değerlendirilmiştir.',
    fullText: `YARGITAY 19. HUKUK DAİRESİ

Esas No: 2024/3691
Karar No: 2024/2580
Karar Tarihi: 20.01.2024

ÖZET: Satış sözleşmesi ihlali ve tazminat

KARAR:
BK 106 ve devamı maddeler gereğince, satıcının malı teslim etmeme nedeniyle
sözleşmeyi ihlal ettiği, bu durumun da alıcıya zarar verdiği tespit edilmiştir.

Sonuç: Sözleşmenin ifa edilmesi veya fesih halinde tazminat ödenmesine karar verilmiştir.`,
    keywords: ['sözleşme ihlali', 'satış sözleşmesi', 'ifa', 'tazminat']
  },
  {
    id: '4',
    title: 'İdari Yargı - İmar İzninin İptali Talebi',
    court: 'Danıştay 6. Dairesi',
    date: '2024-02-10',
    caseNumber: '2024/147 E., 2024/369 K.',
    department: '6. Dairesi',
    summary: 'Belediye tarafından verilen imar izninin hukuka aykırı olduğu gerekçesiyle açılan iptal davasında mahkeme, iznin iptaline karar vermiştir.',
    fullText: `DANIŞTAY 6. DAİRESİ

Esas No: 2024/147
Karar No: 2024/369
Karar Tarihi: 10.02.2024

ÖZET: İmar izninin iptali davası

KARAR:
İmar Kanunu hükümleri ve İmar Yönetmeliği hükümlerine aykırı olarak verilen
imar izninin hukuka uygun olmadığı tespit edilmiştir.

Sonuç: İmar izninin iptaline karar verilmiştir.`,
    keywords: ['imar izni', 'iptal davası', 'İmar Kanunu', 'belediye']
  },
  {
    id: '5',
    title: 'İş Hukuku - İşçinin Kıdem ve İhbar Tazminatı Talebi',
    court: 'Yargıtay 22. Hukuk Dairesi',
    date: '2024-03-05',
    caseNumber: '2024/456 E., 2024/789 K.',
    department: '22. Hukuk Dairesi',
    summary: 'İşten çıkarılan işçinin kıdem ve ihbar tazminatı talep ettiği davada, işverenin haklı fesih gerekçesinin geçersiz olduğu değerlendirilmiştir.',
    fullText: `YARGITAY 22. HUKUK DAİRESİ

Esas No: 2024/456
Karar No: 2024/789
Karar Tarihi: 05.03.2024

ÖZET: Kıdem ve ihbar tazminatı davası

KARAR:
İş Kanunu 17 ve 25. madde hükümleri gereğince, işverenin haklı fesih için
ileri sürdüğü gerekçelerin yeterli olmadığı tespit edilmiştir.

Sonuç: Kıdem ve ihbar tazminatının ödenmesine karar verilmiştir.`,
    keywords: ['kıdem tazminatı', 'ihbar tazminatı', 'işten çıkarma', 'haklı fesih']
  }
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 850,
    originalPrice: 1700,
    currency: 'TL',
    maxSearches: 50,
    features: [
      'Sınırsız arama',
      'Temel karar özeti',
      'PDF indirme',
      'E-posta desteği',
      'Basit filtreleme'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 2750,
    originalPrice: 5500,
    currency: 'TL',
    maxSearches: 250,
    popular: true,
    features: [
      'Sınırsız arama',
      'Tüm mahkemeler',
      'Gelişmiş filtreleme',
      'Tam metin erişimi',
      'Benzer karar önerileri',
      'Özel notlar',
      'Öncelikli destek',
      'İstatistikler ve analiz',
      'AI destekli analiz',
      'Özel raporlama'
    ]
  }
];

export const mockUser = {
  id: '1',
  email: 'avukat@example.com',
  name: 'Mehmet Yılmaz',
  plan: 'premium' as const,
  createdAt: new Date('2024-01-15')
};