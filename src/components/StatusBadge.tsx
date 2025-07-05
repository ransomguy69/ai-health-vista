
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical';
  size?: 'sm' | 'lg';
}

export const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  
  switch (status) {
    case 'healthy':
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          <CheckCircle className={`${iconSize} mr-1`} />
          Healthy
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
          <AlertCircle className={`${iconSize} mr-1`} />
          Warning
        </Badge>
      );
    case 'critical':
      return (
        <Badge variant="destructive">
          <AlertTriangle className={`${iconSize} mr-1`} />
          Critical
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          Unknown
        </Badge>
      );
  }
};
