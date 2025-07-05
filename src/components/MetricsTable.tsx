
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';

interface MetricsTableProps {
  metrics: Array<{
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    timestamp: string;
    top_processes?: Array<{
      name: string;
      cpu: number;
      memory: number;
    }>;
  }>;
}

export const MetricsTable = ({ metrics }: MetricsTableProps) => {
  const getUsageBadge = (usage: number) => {
    if (usage > 80) return <Badge variant="destructive">{usage.toFixed(1)}%</Badge>;
    if (usage > 60) return <Badge className="bg-amber-500 hover:bg-amber-600">{usage.toFixed(1)}%</Badge>;
    return <Badge className="bg-green-500 hover:bg-green-600">{usage.toFixed(1)}%</Badge>;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Recent Metrics */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Recent Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timestamp
                  </TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>Disk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.slice(0, 10).map((metric, index) => (
                  <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <TableCell className="font-mono text-sm">
                      {formatTime(metric.timestamp)}
                    </TableCell>
                    <TableCell>{getUsageBadge(metric.cpu_usage)}</TableCell>
                    <TableCell>{getUsageBadge(metric.memory_usage)}</TableCell>
                    <TableCell>{getUsageBadge(metric.disk_usage)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {metrics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No metrics data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Processes */}
      {metrics[0]?.top_processes && (
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Top Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process Name</TableHead>
                    <TableHead>CPU %</TableHead>
                    <TableHead>Memory %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics[0].top_processes.map((process, index) => (
                    <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-mono font-medium">
                        {process.name}
                      </TableCell>
                      <TableCell>{getUsageBadge(process.cpu)}</TableCell>
                      <TableCell>{getUsageBadge(process.memory)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
