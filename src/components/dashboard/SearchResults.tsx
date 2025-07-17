import { ResultCard } from "./ResultCard";
import { Pagination } from "./Pagination";

interface SearchResult {
  id: string;
  title: string;
  court: string;
  department: string;
  date: string;
  summary: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  results,
  currentPage,
  totalPages,
  onPageChange
}: SearchResultsProps) {
  const handleDownloadPDF = (id: string) => {
    console.log('PDF İndir:', id);
    // PDF indirme işlevi burada implement edilecek
  };

  const handleViewDetails = (id: string) => {
    console.log('Detay Görüntüle:', id);
    // Detay görüntüleme işlevi burada implement edilecek
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Arama Sonuçları ({results.length} sonuç)
        </h2>
      </div>

      {/* Sonuçlar */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard
              key={result.id}
              title={result.title}
              court={result.court}
              department={result.department}
              date={result.date}
              summary={result.summary}
              onDownloadPDF={() => handleDownloadPDF(result.id)}
              onViewDetails={() => handleViewDetails(result.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Arama yapın ve sonuçları burada görün.
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}