
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Star, 
  StarOff, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Search,
  BookmarkPlus
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  createdAt: string;
  isFavorite: boolean;
  usageCount: number;
}

interface SavedSearchManagerProps {
  currentQuery?: string;
  currentFilters?: any;
  onLoadSearch: (search: SavedSearch) => void;
}

export function SavedSearchManager({ 
  currentQuery = '', 
  currentFilters = {}, 
  onLoadSearch 
}: SavedSearchManagerProps) {
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('saved-searches', []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSaveSearch = () => {
    if (!currentQuery.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: currentQuery.slice(0, 50),
      query: currentQuery,
      filters: currentFilters,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      usageCount: 0
    };

    setSavedSearches(prev => [newSearch, ...prev]);
  };

  const handleLoadSearch = (search: SavedSearch) => {
    // Increment usage count
    setSavedSearches(prev => 
      prev.map(s => 
        s.id === search.id 
          ? { ...s, usageCount: s.usageCount + 1 }
          : s
      )
    );
    
    onLoadSearch(search);
  };

  const handleToggleFavorite = (id: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === id 
          ? { ...search, isFavorite: !search.isFavorite }
          : search
      )
    );
  };

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const handleEditName = (id: string, newName: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === id 
          ? { ...search, name: newName }
          : search
      )
    );
    setEditingId(null);
    setEditName('');
  };

  const startEdit = (search: SavedSearch) => {
    setEditingId(search.id);
    setEditName(search.name);
  };

  const sortedSearches = [...savedSearches].sort((a, b) => {
    // Favorites first, then by usage count, then by date
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    if (a.usageCount !== b.usageCount) return b.usageCount - a.usageCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const favoriteSearches = sortedSearches.filter(s => s.isFavorite);
  const regularSearches = sortedSearches.filter(s => !s.isFavorite);

  return (
    <div className="space-y-4">
      {/* Save Current Search */}
      {currentQuery && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Mevcut arama</p>
                <p className="font-medium truncate">{currentQuery}</p>
              </div>
              <Button onClick={handleSaveSearch} size="sm">
                <BookmarkPlus className="h-4 w-4 mr-1" />
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Searches */}
      {favoriteSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Favori Aramalar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {favoriteSearches.map((search) => (
              <div key={search.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                <Button
                  variant="ghost"
                  className="flex-1 justify-start h-auto p-2"
                  onClick={() => handleLoadSearch(search)}
                >
                  <div className="flex-1 text-left">
                    {editingId === search.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleEditName(search.id, editName)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditName(search.id, editName)}
                        className="h-auto p-1 text-sm"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="font-medium text-sm">{search.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{search.usageCount} kullanım</span>
                          {Object.keys(search.filters).length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {Object.keys(search.filters).length} filtre
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEdit(search)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleFavorite(search.id)}>
                      <StarOff className="h-4 w-4 mr-2" />
                      Favorilerden Çıkar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteSearch(search.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {regularSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Kayıtlı Aramalar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {regularSearches.slice(0, 10).map((search) => (
              <div key={search.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                <Button
                  variant="ghost"
                  className="flex-1 justify-start h-auto p-2"
                  onClick={() => handleLoadSearch(search)}
                >
                  <div className="flex-1 text-left">
                    {editingId === search.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleEditName(search.id, editName)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditName(search.id, editName)}
                        className="h-auto p-1 text-sm"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="font-medium text-sm">{search.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{search.usageCount} kullanım</span>
                          <span>{new Date(search.createdAt).toLocaleDateString('tr-TR')}</span>
                          {Object.keys(search.filters).length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {Object.keys(search.filters).length} filtre
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFavorite(search.id)}
                >
                  <Star className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEdit(search)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteSearch(search.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {savedSearches.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Henüz kayıtlı arama yok</p>
            <p className="text-sm text-muted-foreground">
              Arama yaptıktan sonra "Kaydet" butonunu kullanarak aramalarınızı saklayabilirsiniz
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
