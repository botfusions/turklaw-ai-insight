import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Eye } from "lucide-react";

interface ResultCardProps {
  title: string;
  court: string;
  department: string;
  date: string;
  summary: string;
  onDownloadPDF: () => void;
  onViewDetails: () => void;
}

export function ResultCard({
  title,
  court,
  department,
  date,
  summary,
  onDownloadPDF,
  onViewDetails
}: ResultCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-primary cursor-pointer hover:underline">
          {title}
        </h3>
        <div className="text-sm text-muted-foreground">
          {court} • {department} • {date}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground line-clamp-3">
          {summary}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadPDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF İndir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onViewDetails}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Detay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}