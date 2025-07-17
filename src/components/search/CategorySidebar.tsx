import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, Building, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  gradient: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  count?: number;
}

const categories: Category[] = [
  {
    id: 'yargi',
    name: 'Yargı Kararları',
    icon: Scale,
    gradient: 'from-blue-500 to-blue-600',
    subcategories: [
      { id: 'yargitay', name: 'Yargıtay (52 Daire)', count: 450000 },
      { id: 'danistay', name: 'Danıştay (27 Daire)', count: 280000 },
      { id: 'emsal', name: 'Emsal Kararlar', count: 35000 },
      { id: 'anayasa', name: 'Anayasa Mahkemesi', count: 12000 },
    ]
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal Kararlar',
    icon: Building,
    gradient: 'from-green-500 to-green-600',
    subcategories: [
      { id: 'rekabet', name: 'Rekabet Kurumu', count: 8500 },
      { id: 'sayistay', name: 'Sayıştay', count: 15000 },
      { id: 'ihale', name: 'Kamu İhale Kurumu', count: 12000 },
      { id: 'uyusmazlik', name: 'Uyuşmazlık Mahkemesi', count: 3200 },
    ]
  },
  {
    id: 'mevzuat',
    name: 'Mevzuat',
    icon: BookOpen,
    gradient: 'from-purple-500 to-purple-600',
    subcategories: [
      { id: 'kanun', name: 'Kanunlar', count: 2400 },
      { id: 'yonetmelik', name: 'Yönetmelikler', count: 8900 },
      { id: 'teblig', name: 'Tebliğler', count: 15600 },
      { id: 'genelge', name: 'Genelgeler', count: 4200 },
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
      "w-full h-full bg-white/70 backdrop-blur-sm border-r border-white/20 shadow-lg",
      className
    )}>
      <div className="p-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Araştırma Kategorileri
        </h2>
        <p className="text-sm text-muted-foreground">
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
                  "w-full p-4 h-auto justify-start rounded-xl border border-white/20 transition-all duration-200 hover:scale-[1.02]",
                  `bg-gradient-to-r ${category.gradient} text-white shadow-lg hover:shadow-xl`,
                  isSelected && "ring-2 ring-primary/50"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-white/80">
                        {formatNumber(category.subcategories.reduce((acc, sub) => acc + (sub.count || 0), 0))} kayıt
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
                        "w-full justify-start p-3 h-auto rounded-lg border border-white/10 bg-white/50 hover:bg-white/70 transition-all duration-200",
                        selectedSubcategory === subcategory.id && "bg-primary/10 border-primary/20 text-primary"
                      )}
                      onClick={() => onSubcategorySelect(subcategory.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{subcategory.name}</span>
                        {subcategory.count && (
                          <Badge variant="secondary" className="text-xs">
                            {formatNumber(subcategory.count)}
                          </Badge>
                        )}
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