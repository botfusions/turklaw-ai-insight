import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RouteErrorDisplayProps {
  title: string;
  message: string;
  redirectTo?: string;
  redirectText?: string;
  showHomeLink?: boolean;
}

export const RouteErrorDisplay: React.FC<RouteErrorDisplayProps> = ({
  title,
  message,
  redirectTo,
  redirectText = 'Devam Et',
  showHomeLink = true
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {message}
          </p>
          
          <div className="space-y-3">
            {redirectTo && (
              <Button asChild className="w-full">
                <Link to={redirectTo} className="flex items-center gap-2">
                  {redirectText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            
            {showHomeLink && (
              <Button 
                variant="outline" 
                asChild 
                className="w-full"
              >
                <Link to="/">Ana Sayfa</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};