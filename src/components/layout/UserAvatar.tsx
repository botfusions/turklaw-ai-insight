import { User, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  plan?: string;
  size?: 'sm' | 'md' | 'lg';
  showPlanBadge?: boolean;
  className?: string;
}

export function UserAvatar({ 
  name, 
  email, 
  avatarUrl, 
  plan = 'free',
  size = 'md', 
  showPlanBadge = false,
  className 
}: UserAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const isPremium = plan !== 'free' && plan !== 'basic';

  return (
    <div className={cn('relative flex items-center', className)}>
      <Avatar className={cn(sizeClasses[size], 'ring-2 ring-background')}>
        <AvatarImage src={avatarUrl} alt={`${name} profil fotoğrafı`} />
        <AvatarFallback className="bg-gradient-hero text-white font-medium">
          {initials || <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      {showPlanBadge && isPremium && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground"
        >
          <Crown className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
}