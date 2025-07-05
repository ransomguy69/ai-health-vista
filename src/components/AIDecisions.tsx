
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('kill') || lowerAction.includes('stop')) {
      return 'text-red-600';
    }
    if (lowerAction.includes('restart') || lowerAction.includes('scale')) {
      return 'text-amber-600';
    }
    return 'text-blue-600';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indigo-600" />
          AI Agent Decisions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {decisions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No AI decisions yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {decisions.map((decision, index) => (
              <div key={decision.id}>
                <div className="space-y-3">
                  {/* Header with status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(decision.status)}
                      <span className={`font-semibold ${getActionColor(decision.action)}`}>
                        {decision.action}
                      </span>
                    </div>
                    {getStatusBadge(decision.status)}
                  </div>

                  {/* Target */}
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Target: </span>
                    <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-mono">
                      {decision.target}
                    </code>
                  </div>

                  {/* Reason */}
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Reason: </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {decision.reason}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {formatTime(decision.timestamp)}
                  </div>
                </div>

                {index < decisions.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
