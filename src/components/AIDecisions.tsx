
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Target, AlertCircle } from 'lucide-react';

interface AIDecision {
  id: string;
  action: string;
  target: string;
  reason: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

interface AIDecisionsProps {
  decisions: AIDecision[];
}

export const AIDecisions = ({ decisions }: AIDecisionsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('kill') || action.toLowerCase().includes('restart')) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <Target className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Decisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!decisions || decisions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No AI decisions recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {decisions.slice(0, 6).map((decision) => (
              <div 
                key={decision.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getActionIcon(decision.action)}
                    <h4 className="font-medium text-sm">{decision.action}</h4>
                  </div>
                  <Badge className={getStatusColor(decision.status)}>
                    {decision.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="h-3 w-3" />
                    <span className="font-medium">Target:</span>
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {decision.target}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Reason:</span> {decision.reason}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(decision.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
