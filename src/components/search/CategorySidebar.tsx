import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export const CategorySidebar = React.memo(({ 
  selectedCategory, 
  selectedSubcategory, 
  onCategorySelect, 
  onSubcategorySelect,
  className 
}: CategorySidebarProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(selectedCategory || null);

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      onCategorySelect(categoryId);
    }
  }, [expandedCategory, onCategorySelect]);

  const handleSubcategoryClick = useCallback((subcategoryId: string) => {
    onSubcategorySelect(subcategoryId);
  }, [onSubcategorySelect]);

  const memoizedCategories = useMemo(() => categories, []);

  const extractDaireCount = (description: string) => {
    const match = description.match(/(\d+)\s+Daire/);
    return match ? match[1] : null;
  };

  return (
    <nav 
      className={cn(
        "w-full h-full bg-background border-r border-border",
        className
      )}
      role="navigation"
      aria-label="Araştırma kategorileri"
    >
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Araştırma Kategorileri
        </h2>
        <p className="text-sm text-muted-foreground">
          Arama yapmak için bir kategori seçin
        </p>
      </div>

      <div className="p-4 space-y-2">
        {memoizedCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="space-y-1">
              {/* Main Category Button */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full p-4 h-auto justify-start rounded-lg transition-all duration-200",
                  isSelected 
                    ? "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15" 
                    : "border border-transparent hover:border-border hover:bg-muted/50"
                )}
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
                tabIndex={0}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "h-6 w-6 transition-colors",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div className="text-left">
                      <div className="font-semibold text-base leading-tight">
                        {category.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {category.description}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </Button>

              {/* Subcategories */}
              {isExpanded && (
                <div 
                  id={`category-${category.id}`}
                  className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300"
                  role="group"
                  aria-labelledby={`category-${category.id}-label`}
                >
                  {category.subcategories.map((subcategory) => {
                    const isSubSelected = selectedSubcategory === subcategory.id;
                    const daireCount = extractDaireCount(subcategory.description);
                    
                    return (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start p-3 h-auto rounded-lg transition-all duration-200",
                          isSubSelected 
                            ? "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15" 
                            : "border border-transparent hover:border-border hover:bg-muted/50"
                        )}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                        tabIndex={0}
                        aria-pressed={isSubSelected}
                      >
                        <div className="text-left w-full">
                          <div className="flex items-center justify-between w-full">
                            <div className="font-medium text-sm">
                              {subcategory.name}
                            </div>
                            {daireCount && (
                              <Badge 
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
                              >
                                {daireCount} Daire
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {subcategory.description}
                          </div>
                          {subcategory.details && subcategory.details.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {subcategory.details.slice(0, 2).map((detail, index) => (
                                <Badge 
                                  key={index}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5 bg-background/50 text-muted-foreground border-border/50"
                                >
                                  {detail}
                                </Badge>
                              ))}
                              {subcategory.details.length > 2 && (
                                <Badge 
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5 bg-background/50 text-muted-foreground border-border/50"
                                >
                                  +{subcategory.details.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
});