import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchCardProps {
  onSearch: (query: string, filters: { court?: string; department?: string; dateRange?: string }) => void;
}

export function SearchCard({ onSearch }: SearchCardProps) {
  const [query, setQuery] = useState("");
  const [court, setCourt] = useState("");
  const [department, setDepartment] = useState("");
  const [dateRange, setDateRange] = useState("");

  const handleSearch = () => {
    onSearch(query, { court, department, dateRange });
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Hukuk Araştırma Sistemi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ana Arama Input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Arama yapın..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg h-12 pr-12"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Filtreler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Mahkeme</label>
            <Select value={court} onValueChange={setCourt}>
              <SelectTrigger>
                <SelectValue placeholder="Mahkeme seçin" />
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
            <label className="text-sm font-medium mb-2 block">Daire</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Daire seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. Daire</SelectItem>
                <SelectItem value="2">2. Daire</SelectItem>
                <SelectItem value="3">3. Daire</SelectItem>
                <SelectItem value="4">4. Daire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tarih</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Tarih aralığı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1y">Son 1 Yıl</SelectItem>
                <SelectItem value="5y">Son 5 Yıl</SelectItem>
                <SelectItem value="all">Tüm Zamanlar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ara Butonu */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSearch}
            className="px-8 py-2 text-lg"
            size="lg"
          >
            Ara
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}