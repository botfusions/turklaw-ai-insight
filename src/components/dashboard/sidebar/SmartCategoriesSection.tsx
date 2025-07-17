import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Scale, 
  Building, 
  BookOpen, 
  GraduationCap,
  ChevronDown,
  ChevronRight 
} from "lucide-react";

interface SmartCategoriesSectionProps {
  onCategorySelect?: (category: string, subcategory?: string) => void;
}

export function SmartCategoriesSection({ onCategorySelect }: SmartCategoriesSectionProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(['court']);

  const categories = [
    {
      id: 'court',
      label: 'Yargı Kararları',
      icon: Scale,
      color: 'text-blue-600',
      count: 15420,
      subcategories: [
        { id: 'yargitay', label: 'Yargıtay', count: 8950 },
        { id: 'danistay', label: 'Danıştay', count: 3240 },
        { id: 'idare', label: 'İdare Mahkemeleri', count: 2130 },
        { id: 'bolge', label: 'Bölge Adliye', count: 1100 }
      ]
    },
    {
      id: 'legislation',
      label: 'Mevzuat Arşivi',
      icon: BookOpen,
      color: 'text-green-600',
      count: 12850,
      subcategories: [
        { id: 'kanun', label: 'Kanunlar', count: 4200 },
        { id: 'yonetmelik', label: 'Yönetmelikler', count: 6400 },
        { id: 'teblig', label: 'Tebliğler', count: 1850 },
        { id: 'genelge', label: 'Genelgeler', count: 400 }
      ]
    },
    {
      id: 'corporate',
      label: 'İçtihatlar',
      icon: Building,
      color: 'text-purple-600',
      count: 5670,
      subcategories: [
        { id: 'emsal', label: 'Emsal Kararlar', count: 3200 },
        { id: 'birlestirme', label: 'Birleştirme Kararları', count: 1470 },
        { id: 'itiraz', label: 'İtiraz Kararları', count: 1000 }
      ]
    },
    {
      id: 'academic',
      label: 'Akademik İçerikler',
      icon: GraduationCap,
      color: 'text-orange-600',
      count: 2340,
      subcategories: [
        { id: 'makale', label: 'Makaleler', count: 1500 },
        { id: 'tez', label: 'Tezler', count: 640 },
        { id: 'kitap', label: 'Kitap Bölümleri', count: 200 }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Akıllı Kategoriler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategories.includes(category.id);
          
          return (
            <Collapsible
              key={category.id}
              open={isOpen}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sm h-9 px-3 hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${category.color}`} />
                    <span>{category.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {category.count.toLocaleString('tr-TR')}
                    </Badge>
                    {isOpen ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4 mt-1">
                {category.subcategories.map((sub) => (
                  <Button
                    key={sub.id}
                    variant="ghost"
                    className="w-full justify-between text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => onCategorySelect?.(category.id, sub.id)}
                  >
                    <span>{sub.label}</span>
                    <Badge variant="outline" className="h-4 px-1 text-xs">
                      {sub.count.toLocaleString('tr-TR')}
                    </Badge>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}