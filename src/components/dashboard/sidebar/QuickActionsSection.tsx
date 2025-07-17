import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Zap, 
  Bookmark, 
  Download, 
  Share2, 
  StickyNote,
  ChevronDown,
  ChevronRight,
  Save,
  FileText,
  Link2
} from "lucide-react";

export function QuickActionsSection() {
  const [isNotePadOpen, setIsNotePadOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  
  // Mock data for bookmarks and recent exports
  const recentBookmarks = 3;
  const pendingExports = 1;

  const quickActions = [
    {
      id: 'bookmarks',
      label: 'Bookmark Yöneticisi',
      icon: Bookmark,
      description: 'Kayıtlı kararları yönet',
      badge: recentBookmarks > 0 ? recentBookmarks : null,
      action: () => console.log('Open bookmarks')
    },
    {
      id: 'export',
      label: 'Sonuçları Dışa Aktar',
      icon: Download,
      description: 'PDF, Excel formatında kaydet',
      badge: pendingExports > 0 ? pendingExports : null,
      action: () => console.log('Export results')
    },
    {
      id: 'share',
      label: 'Paylaşım Linki',
      icon: Share2,
      description: 'Arama sonuçlarını paylaş',
      badge: null,
      action: () => console.log('Generate share link')
    }
  ];

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      // In real app, save to localStorage or user profile
      console.log('Saving note:', noteContent);
      setNoteContent("");
      setIsNotePadOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Hızlı Eylemler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick Action Buttons */}
        <div className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                className="w-full justify-between h-auto p-3"
                onClick={action.action}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-0.5 text-primary" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
                {action.badge && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {action.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Notepad Section */}
        <div className="border-t pt-3">
          <Collapsible open={isNotePadOpen} onOpenChange={setIsNotePadOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between h-auto p-3"
              >
                <div className="flex items-center gap-3">
                  <StickyNote className="h-4 w-4 text-primary" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Hızlı Not Defteri</div>
                    <div className="text-xs text-muted-foreground">
                      Önemli notlarınızı kaydedin
                    </div>
                  </div>
                </div>
                {isNotePadOpen ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2">
              <div className="space-y-2">
                <Textarea
                  placeholder="Notunuzu buraya yazın..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="h-20 text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={!noteContent.trim()}
                    className="flex-1"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Kaydet
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setNoteContent("")}
                    disabled={!noteContent.trim()}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Recent Export Status */}
        {pendingExports > 0 && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Download className="h-3 w-3" />
              Bekleyen Dışa Aktarma
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Arama sonuçları hazırlanıyor...
              </span>
              <Badge variant="secondary" className="h-4 px-1 text-xs">
                {pendingExports}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}