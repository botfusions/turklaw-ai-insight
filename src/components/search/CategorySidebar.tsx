import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Scale, Building, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  details?: string[];
}

const categories: Category[] = [
  {
    id: 'yargi',
    name: 'Yargı Kararları',
    icon: Scale,
    description: 'Türk Mahkeme Sistemi Kararları',
    subcategories: [
      { 
        id: 'yargitay', 
        name: 'Yargıtay', 
        description: '52 Daire - Hukuk ve Ceza',
        details: ['Hukuk Daireleri (1-21)', 'Ceza Daireleri (1-16)', 'Hukuk Genel Kurulu', 'Ceza Genel Kurulu']
      },
      { 
        id: 'danistay', 
        name: 'Danıştay', 
        description: '27 Daire - İdari ve Vergi',
        details: ['İdari Daireler (1-15)', 'Vergi Daireleri (4)', 'İdari Dava Daireleri', 'Danıştay Genel Kurulu']
      },
      { 
        id: 'emsal', 
        name: 'Emsal Kararlar', 
        description: 'UYAP Emsal Kararlar',
        details: ['Yerel Mahkemeler', 'Bölge Adliye Mahkemeleri', 'İstinaf Mahkemeleri']
      },
      { 
        id: 'anayasa', 
        name: 'Anayasa Mahkemesi', 
        description: 'Norm Denetimi ve Bireysel Başvuru',
        details: ['Norm Denetimi', 'Bireysel Başvuru', 'Siyasi Parti Kapatma']
      },
    ]
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal Kararlar',
    icon: Building,
    description: 'Kamu Kurumu Kararları',
    subcategories: [
      { 
        id: 'rekabet', 
        name: 'Rekabet Kurumu', 
        description: 'Rekabet İhlalleri ve Yoğunlaşma',
        details: ['Anlaşma İhlalleri', 'Hâkim Durum İhlalleri', 'Yoğunlaşma İşlemleri']
      },
      { 
        id: 'sayistay', 
        name: 'Sayıştay', 
        description: 'Mali Denetim Kararları',
        details: ['Denetim Raporları', 'Mali Sorumluluk', 'Kesin Hesap']
      },
      { 
        id: 'ihale', 
        name: 'Kamu İhale Kurumu', 
        description: 'İhale İtirazları ve Kararları',
        details: ['İtiraz Kararları', 'İdari Para Cezaları', 'Yasaklama Kararları']
      },
      { 
        id: 'uyusmazlik', 
        name: 'Uyuşmazlık Mahkemesi', 
        description: 'Görev Uyuşmazlıkları',
        details: ['Olumlu Uyuşmazlık', 'Olumsuz Uyuşmazlık', 'İhlal İddiaları']
      },
    ]
  },
  {
    id: 'mevzuat',
    name: 'Mevzuat',
    icon: BookOpen,
    description: 'Türk Hukuk Mevzuatı',
    subcategories: [
      { 
        id: 'kanun', 
        name: 'Kanunlar', 
        description: 'TBMM Tarafından Çıkarılan Kanunlar',
        details: ['Anayasa', 'Temel Kanunlar', 'Özel Kanunlar']
      },
      { 
        id: 'yonetmelik', 
        name: 'Yönetmelikler', 
        description: 'İcrai Düzenlemeler',
        details: ['Cumhurbaşkanlığı', 'Bakanlık', 'Kurum']
      },
      { 
        id: 'teblig', 
        name: 'Tebliğler', 
        description: 'Uygulama Esasları',
        details: ['Vergi Tebliğleri', 'Gümrük Tebliğleri', 'Mali Tebliğler']
      },
      { 
        id: 'genelge', 
        name: 'Genelgeler', 
        description: 'Kamu Kurumu Genelgeleri',
        details: ['İdari Genelgeler', 'Mali Genelgeler', 'Hukuki Genelgeler']
      },
    ]
  }
];

interface CategorySidebarProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  className?: string;
}

export function CategorySidebar({ 
  selectedCategory, 
  selectedSubcategory, 
  onCategorySelect, 
  onSubcategorySelect,
  className 
}: CategorySidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(selectedCategory || null);

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      onCategorySelect(categoryId);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  return (
    <div className={cn(
      "w-full h-full bg-white shadow-sm border-r border-gray-200",
      className
    )}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Araştırma Kategorileri
        </h2>
        <p className="text-sm text-gray-600">
          Arama yapmak için bir kategori seçin
        </p>
      </div>

      <div className="p-4 space-y-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="space-y-2">
              {/* Main Category Button */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full p-4 h-auto justify-start rounded-lg border transition-all duration-200",
                  isSelected 
                    ? "bg-primary/10 border-primary text-primary hover:bg-primary/20" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {category.description}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </Button>

              {/* Subcategories */}
              {isExpanded && (
                <div className="ml-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start p-3 h-auto rounded-lg border transition-all duration-200",
                        selectedSubcategory === subcategory.id 
                          ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" 
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                      onClick={() => onSubcategorySelect(subcategory.id)}
                    >
                      <div className="text-left w-full">
                        <div className="font-medium text-sm">{subcategory.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {subcategory.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}