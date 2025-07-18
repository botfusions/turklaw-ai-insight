
import { Settings, Eye, Type, Contrast, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from './AccessibilityProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const AccessibilitySettings = () => {
  const {
    highContrast,
    fontSize,
    reducedMotion,
    focusVisible,
    setFontSize,
    toggleHighContrast,
    announceToScreenReader
  } = useAccessibility();

  const handleFontSizeChange = (newSize: 'normal' | 'large' | 'extra-large') => {
    setFontSize(newSize);
    announceToScreenReader(`Yazı boyutu ${newSize === 'normal' ? 'normal' : newSize === 'large' ? 'büyük' : 'çok büyük'} olarak değiştirildi`);
  };

  const handleContrastToggle = () => {
    toggleHighContrast();
    announceToScreenReader(`Yüksek kontrast modu ${!highContrast ? 'açıldı' : 'kapatıldı'}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
          aria-label="Erişilebilirlik ayarları"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              Erişilebilirlik Ayarları
            </CardTitle>
            <CardDescription className="text-xs">
              Uygulamayı ihtiyaçlarınıza göre özelleştirin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Font Size */}
            <div className="space-y-2">
              <Label htmlFor="font-size" className="text-xs font-medium flex items-center gap-2">
                <Type className="h-3 w-3" />
                Yazı Boyutu
              </Label>
              <Select
                value={fontSize}
                onValueChange={handleFontSizeChange}
              >
                <SelectTrigger id="font-size" className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (16px)</SelectItem>
                  <SelectItem value="large">Büyük (18px)</SelectItem>
                  <SelectItem value="extra-large">Çok Büyük (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-xs font-medium flex items-center gap-2">
                <Contrast className="h-3 w-3" />
                Yüksek Kontrast
              </Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={handleContrastToggle}
                aria-describedby="high-contrast-desc"
              />
            </div>
            <p id="high-contrast-desc" className="text-xs text-muted-foreground">
              Daha iyi görünürlük için renk kontrastını artırır
            </p>

            {/* Focus Indicator */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium flex items-center gap-2">
                <MousePointer className="h-3 w-3" />
                Odak Göstergesi
              </Label>
              <div className={`w-3 h-3 rounded-full ${focusVisible ? 'bg-primary' : 'bg-muted'}`} />
            </div>
            <p className="text-xs text-muted-foreground">
              Klavye navigasyonu sırasında odaklanılan öğeleri vurgular
            </p>

            {/* Motion Preference */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                Azaltılmış Hareket
              </Label>
              <div className={`w-3 h-3 rounded-full ${reducedMotion ? 'bg-primary' : 'bg-muted'}`} />
            </div>
            <p className="text-xs text-muted-foreground">
              Sistem ayarlarınızdan otomatik olarak algılanır
            </p>

            {/* Quick Actions */}
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-2">Hızlı Erişim</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => announceToScreenReader('Arama sayfasına odaklanıldı')}
                >
                  Aramaya Git
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    const mainContent = document.querySelector('main');
                    if (mainContent) mainContent.focus();
                  }}
                >
                  Ana İçerik
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
