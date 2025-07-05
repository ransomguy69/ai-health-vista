
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  timestamp: string;
  top_processes: Array<{
    name: string;
    cpu: number;
    memory: number;
  }>;
}

interface MetricsTableProps {
  metrics: SystemMetrics[];
}

export const MetricsTable = ({ metrics }: MetricsTableProps) => {
  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No metrics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUsageColor = (usage: number, type: 'cpu' | 'memory' | 'disk') => {
    const thresholds = {
      cpu: { warning: 60, critical: 80 },
      memory: { warning: 60, critical: 80 },
      disk: { warning: 70, critical: 85 }
    };

    const threshold = thresholds[type];
    if (usage > threshold.critical) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (usage > threshold.warning) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Recent Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Metrics History Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>CPU %</TableHead>
                  <TableHead>Memory %</TableHead>
                  <TableHead>Disk %</TableHead>
                  <TableHead>Top Process</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.slice(0, 8).map((metric, index) => {
                  const topProcess = metric.top_processes?.[0];
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getUsageColor(metric.cpu_usage, 'cpu')}>
                          {metric.cpu_usage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUsageColor(metric.memory_usage, 'memory')}>
                          {metric.memory_usage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUsageColor(metric.disk_usage, 'disk')}>
                          {metric.disk_usage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {topProcess ? (
                          <div className="text-sm">
                            <span className="font-medium">{topProcess.name}</span>
                            <span className="text-gray-500 ml-2">
                              ({topProcess.cpu.toFixed(1)}% CPU)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Top Processes from Latest Metric */}
          {metrics[0]?.top_processes && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Current Top Processes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {metrics[0].top_processes.slice(0, 4).map((process, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{process.name}</p>
                      <p className="text-xs text-gray-500">Process #{index + 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{process.cpu.toFixed(1)}% CPU</p>
                      <p className="text-xs text-gray-500">{process.memory.toFixed(1)}% MEM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
