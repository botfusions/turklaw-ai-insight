
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  duration?: number;
}

interface ProgressiveLoaderProps {
  steps: LoadingStep[];
  onComplete?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function ProgressiveLoader({ 
  steps, 
  onComplete, 
  onError, 
  className 
}: ProgressiveLoaderProps) {
  const [currentSteps, setCurrentSteps] = useState<LoadingStep[]>(steps);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completedSteps = currentSteps.filter(step => step.status === 'completed').length;
    const newProgress = (completedSteps / currentSteps.length) * 100;
    setProgress(newProgress);

    if (completedSteps === currentSteps.length && onComplete) {
      onComplete();
    }
  }, [currentSteps, onComplete]);

  const updateStepStatus = (stepId: string, status: LoadingStep['status']) => {
    setCurrentSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const getStepIcon = (status: LoadingStep['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStepTextColor = (status: LoadingStep['status']) => {
    switch (status) {
      case 'loading':
        return 'text-primary font-medium';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="p-6 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">İlerleme</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Loading Steps */}
        <div className="space-y-3">
          {currentSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              {getStepIcon(step.status)}
              <span className={cn("text-sm", getStepTextColor(step.status))}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing progressive loading
export function useProgressiveLoader(initialSteps: LoadingStep[]) {
  const [steps, setSteps] = useState<LoadingStep[]>(initialSteps);
  
  const updateStep = (stepId: string, status: LoadingStep['status']) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const resetSteps = () => {
    setSteps(prev => 
      prev.map(step => ({ ...step, status: 'pending' as const }))
    );
  };

  return {
    steps,
    updateStep,
    resetSteps
  };
}
