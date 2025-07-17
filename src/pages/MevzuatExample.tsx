import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MevzuatSearch } from '@/components/search';

const MevzuatExample = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">MevzuatSearch Komponent Örnekleri</h1>
        <p className="text-muted-foreground mt-2">
          Embedding için tasarlanmış MevzuatSearch komponentinin farklı kullanımları
        </p>
      </div>

      {/* Temel Kullanım */}
      <Card>
        <CardHeader>
          <CardTitle>1. Temel Kullanım</CardTitle>
          <p className="text-sm text-muted-foreground">
            En basit haliyle MevzuatSearch komponenti
          </p>
        </CardHeader>
        <CardContent>
          <MevzuatSearch />
        </CardContent>
      </Card>

      <Separator />

      {/* Kompakt Kullanım */}
      <Card>
        <CardHeader>
          <CardTitle>2. Kompakt Kullanım</CardTitle>
          <p className="text-sm text-muted-foreground">
            Daha az yer kaplayan, embedding için ideal versiyon
          </p>
        </CardHeader>
        <CardContent>
          <MevzuatSearch 
            compact={true}
            showLimitWarning={false}
            placeholder="Kompakt mevzuat araması..."
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Özelleştirilmiş Kullanım */}
      <Card>
        <CardHeader>
          <CardTitle>3. Özelleştirilmiş Kullanım</CardTitle>
          <p className="text-sm text-muted-foreground">
            Callback'ler ve özel ayarlarla kullanım
          </p>
        </CardHeader>
        <CardContent>
          <MevzuatSearch
            maxResults={5}
            placeholder="Özel mevzuat araması..."
            onSearchStart={(query) => console.log('Arama başlatıldı:', query)}
            onSearchComplete={(results) => console.log('Sonuçlar:', results)}
            onError={(error) => console.error('Hata:', error)}
            showLimitWarning={true}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Kullanım Kodu Örnekleri */}
      <Card>
        <CardHeader>
          <CardTitle>4. Kod Örnekleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Temel Kullanım:</h4>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>{`import { MevzuatSearch } from '@/components/search';

function App() {
  return (
    <div>
      <MevzuatSearch />
    </div>
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Kompakt Embed:</h4>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>{`<MevzuatSearch 
  compact={true}
  showLimitWarning={false}
  maxResults={5}
  placeholder="Mevzuat araması..."
/>`}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Callback'lerle:</h4>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>{`<MevzuatSearch
  onSearchStart={(query) => console.log('Arama:', query)}
  onSearchComplete={(results) => handleResults(results)}
  onError={(error) => showError(error)}
  requireAuth={false}
/>`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MevzuatExample;