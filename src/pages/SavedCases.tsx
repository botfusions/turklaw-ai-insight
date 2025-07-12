import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Bookmark, 
  Calendar, 
  Building2, 
  FileText, 
  Trash2, 
  Edit3,
  Save,
  X
} from 'lucide-react';

interface SavedCase {
  id: string;
  case_id: string;
  notes: string | null;
  saved_at: string;
  legal_cases: {
    title: string;
    case_number: string;
    court: string;
    department: string;
    decision_date: string;
    summary: string;
    keywords: string[];
  };
}

export default function SavedCases() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    fetchSavedCases();
  }, [user]);

  const fetchSavedCases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_cases')
        .select(`
          *,
          legal_cases (
            title,
            case_number,
            court,
            department,
            decision_date,
            summary,
            keywords
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedCases(data as SavedCase[]);
    } catch (error) {
      console.error('Error fetching saved cases:', error);
      toast({
        title: "Hata",
        description: "Kayıtlı kararlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSavedCase = async (caseId: string) => {
    try {
      const { error } = await supabase
        .from('saved_cases')
        .delete()
        .eq('id', caseId);

      if (error) throw error;

      setSavedCases(prev => prev.filter(c => c.id !== caseId));
      toast({
        title: "Başarılı",
        description: "Karar kayıtlı listesinden kaldırıldı.",
      });
    } catch (error) {
      console.error('Error deleting saved case:', error);
      toast({
        title: "Hata",
        description: "Karar silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const updateNotes = async (caseId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('saved_cases')
        .update({ notes })
        .eq('id', caseId);

      if (error) throw error;

      setSavedCases(prev => 
        prev.map(c => c.id === caseId ? { ...c, notes } : c)
      );
      
      setEditingNotes(null);
      setEditNoteText('');
      
      toast({
        title: "Başarılı",
        description: "Notlarınız güncellendi.",
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Hata",
        description: "Notlar güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const startEditingNotes = (caseId: string, currentNotes: string | null) => {
    setEditingNotes(caseId);
    setEditNoteText(currentNotes || '');
  };

  const cancelEditing = () => {
    setEditingNotes(null);
    setEditNoteText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Kayıtlı kararlar yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <Bookmark className="h-8 w-8 text-primary" />
              Kayıtlı Kararlar
            </h1>
            <p className="text-muted-foreground mt-2">
              İleride incelemek üzere kaydettiğiniz kararlar
            </p>
          </div>

          {savedCases.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Henüz kayıtlı karar yok</h3>
                <p className="text-muted-foreground mb-4">
                  Arama sonuçlarından beğendiğiniz kararları kaydedin
                </p>
                <Button>Karar Ara</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {savedCases.map((savedCase) => (
                <Card key={savedCase.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-2">
                          {savedCase.legal_cases.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {savedCase.legal_cases.case_number}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {savedCase.legal_cases.court}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(savedCase.legal_cases.decision_date).toLocaleDateString('tr-TR')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingNotes(savedCase.id, savedCase.notes)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSavedCase(savedCase.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Özet
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {savedCase.legal_cases.summary}
                      </p>
                    </div>

                    {savedCase.legal_cases.keywords.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Anahtar Kelimeler</h4>
                        <div className="flex flex-wrap gap-1">
                          {savedCase.legal_cases.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-sm mb-2">Notlarım</h4>
                      {editingNotes === savedCase.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            placeholder="Bu karar hakkında notlarınızı ekleyin..."
                            className="min-h-[100px]"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateNotes(savedCase.id, editNoteText)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Kaydet
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4 mr-1" />
                              İptal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-muted-foreground bg-muted/50 p-3 rounded cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => startEditingNotes(savedCase.id, savedCase.notes)}
                        >
                          {savedCase.notes || 'Not eklemek için tıklayın...'}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Kaydedilme tarihi: {new Date(savedCase.saved_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}