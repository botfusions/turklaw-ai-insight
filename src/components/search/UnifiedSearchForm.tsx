import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  FileText, 
  ChevronDown,
  Info,
  BookOpen,
  Scale,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { clsx } from 'clsx';

// Court system types
export type CourtSystem = 
  | 'bedesten' 
  | 'anayasa' 
  | 'mevzuat' 
  | 'emsal' 
  | 'uyusmazlik' 
  | 'kik' 
  | 'rekabet' 
  | 'sayistay' 
  | 'kvkk' 
  | 'bddk';

// Search form schema
const searchSchema = z.object({
  query: z.string().min(2, 'Arama terimi en az 2 karakter olmalıdır'),
  courtSystem: z.string(),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  filters: z.record(z.any()).optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface UnifiedSearchFormProps {
  onSearch: (data: SearchFormData) => void;
  loading?: boolean;
  defaultValues?: Partial<SearchFormData>;
}

// Court system configurations
const courtSystems = {
  bedesten: {
    name: 'Çoklu Mahkeme Arama',
    description: 'Yargıtay, Danıştay, Bölge Adliye ve Yerel Mahkemeler',
    icon: Scale,
    color: 'blue',
    filters: {
      courtTypes: {
        label: 'Mahkeme Türleri',
        options: [
          { value: 'YARGITAYKARARI', label: 'Yargıtay Kararları' },
          { value: 'DANISTAYKARAR', label: 'Danıştay Kararları' },
          { value: 'YERELHUKUK', label: 'Yerel Hukuk Mahkemeleri' },
          { value: 'ISTINAFHUKUK', label: 'İstinaf Mahkemeleri' },
          { value: 'KYB', label: 'Küçük Yargılama Birimleri' },
        ]
      }
    }
  },
  anayasa: {
    name: 'Anayasa Mahkemesi',
    description: 'Bireysel başvuru ve norm denetimi kararları',
    icon: Building2,
    color: 'red',
    filters: {
      decisionType: {
        label: 'Karar Türü',
        options: [
          { value: 'bireysel_basvuru', label: 'Bireysel Başvuru' },
          { value: 'norm_denetimi', label: 'Norm Denetimi' },
        ]
      }
    }
  },
  mevzuat: {
    name: 'Türk Mevzuatı',
    description: 'Kanunlar, yönetmelikler ve düzenlemeler',
    icon: BookOpen,
    color: 'orange',
    filters: {
      legislationTypes: {
        label: 'Mevzuat Türleri',
        options: [
          { value: 'KANUN', label: 'Kanun' },
          { value: 'CB_KARARNAME', label: 'Cumhurbaşkanlığı Kararnamesi' },
          { value: 'YONETMELIK', label: 'Yönetmelik' },
          { value: 'CB_YONETMELIK', label: 'CB Yönetmeliği' },
          { value: 'TUZUK', label: 'Tüzük' },
        ]
      }
    }
  },
  emsal: {
    name: 'Emsal Kararlar',
    description: 'İçtihat oluşturan önemli mahkeme kararları',
    icon: FileText,
    color: 'purple',
    filters: {}
  }
};

export function UnifiedSearchForm({ onSearch, loading = false, defaultValues }: UnifiedSearchFormProps) {
  const [selectedSystem, setSelectedSystem] = useState<CourtSystem>('bedesten');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
      courtSystem: selectedSystem,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const currentSystem = courtSystems[selectedSystem];

  const onSubmit = (data: SearchFormData) => {
    onSearch({ ...data, courtSystem: selectedSystem });
  };

  const handleSystemChange = (system: CourtSystem) => {
    setSelectedSystem(system);
    reset({ query: watch('query'), courtSystem: system });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Court System Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Arama Sistemi Seçin
            </h2>
            <p className="text-sm text-gray-600">
              Hangi veri tabanında arama yapmak istediğinizi seçin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(courtSystems).map(([key, system]) => {
              const Icon = system.icon;
              const isSelected = selectedSystem === key;
              
              return (
                <button
                  key={key}
                  onClick={() => handleSystemChange(key as CourtSystem)}
                  className={clsx(
                    'p-4 rounded-lg border-2 transition-all text-left hover:scale-105',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon 
                      size={20} 
                      className={clsx(
                        isSelected ? 'text-primary' : 'text-gray-500'
                      )} 
                    />
                    <div className="min-w-0 flex-1">
                      <div 
                        className={clsx(
                          'font-medium text-sm',
                          isSelected ? 'text-primary' : 'text-gray-900'
                        )}
                      >
                        {system.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {system.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Arama Terimi
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input
                  {...register('query')}
                  placeholder={`${currentSystem.name} içinde ara...`}
                  className="pl-10 pr-32 h-12 text-base"
                />
                <div className="absolute right-2 top-1/2 transform -translate y-1/2">
                  <Badge variant="secondary" className="text-xs">
                    {currentSystem.name}
                  </Badge>
                </div>
              </div>
              
              {errors.query && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.query.message}
                </p>
              )}
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Gelişmiş Filtreler
                <ChevronDown 
                  size={16} 
                  className={clsx(
                    'transition-transform',
                    showAdvanced && 'rotate-180'
                  )} 
                />
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info size={16} />
                <span>{currentSystem.description}</span>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Başlangıç Tarihi
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="date"
                        {...register('dateRange.start')}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Bitiş Tarihi
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="date"
                        {...register('dateRange.end')}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* System-specific Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(currentSystem.filters || {}).map(([key, filter]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {filter.label}
                      </label>
                      <Controller
                        name={`filters.${key}` as any}
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`${filter.label} seçin...`} />
                            </SelectTrigger>
                            <SelectContent>
                              {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={!isValid || loading}
                size="lg"
                className="flex-1 sm:flex-none sm:px-8 h-12"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Ara
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={loading}
              >
                Temizle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* System Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              {currentSystem.name} Hakkında
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              {selectedSystem === 'bedesten' && 
                'Yargıtay, Danıştay, Bölge Adliye ve Yerel Mahkemeler kararlarında birleşik arama yapabilirsiniz. Farklı mahkeme türlerini seçerek aramanızı daraltabilirsiniz.'
              }
              {selectedSystem === 'anayasa' && 
                'Anayasa Mahkemesi\'nin bireysel başvuru ve norm denetimi kararlarında arama yapabilirsiniz. Temel hakların ihlali ve anayasaya aykırılık konularında detaylı bilgi bulabilirsiniz.'
              }
              {selectedSystem === 'mevzuat' && 
                'Türkiye Cumhuriyeti\'nin tüm kanun, yönetmelik ve düzenlemelerinde arama yapabilirsiniz. Madde bazında içerik erişimi mevcuttur.'
              }
              {selectedSystem === 'emsal' && 
                'İçtihat oluşturan önemli mahkeme kararlarında arama yapabilirsiniz. Hukuki precedentler ve yargısal yorumlar için özellikle faydalıdır.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}