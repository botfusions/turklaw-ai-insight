import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Building, BookOpen, History, Bookmark } from "lucide-react";

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-muted/30 border-r border-border p-4 space-y-6">
      {/* Arama Kategorileri */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Arama Kategorileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            <Scale className="mr-2 h-4 w-4" />
            Yargı Kararları
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            <Building className="mr-2 h-4 w-4" />
            Kurumsal Kararlar
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Mevzuat Arşivi
          </Button>
        </CardContent>
      </Card>

      {/* Filtreler */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Filtreler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Mahkeme Türü</label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yargitay">Yargıtay</SelectItem>
                <SelectItem value="danistay">Danıştay</SelectItem>
                <SelectItem value="bolge">Bölge Adliye</SelectItem>
                <SelectItem value="asliye">Asliye</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Daire</label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. Daire</SelectItem>
                <SelectItem value="2">2. Daire</SelectItem>
                <SelectItem value="3">3. Daire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Tarih Aralığı</label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1y">Son 1 Yıl</SelectItem>
                <SelectItem value="5y">Son 5 Yıl</SelectItem>
                <SelectItem value="all">Tüm Zamanlar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Son İşlemler */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Son İşlemler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            <History className="mr-2 h-4 w-4" />
            Son Aramalar
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            <Bookmark className="mr-2 h-4 w-4" />
            Kaydedilen Kararlar
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}