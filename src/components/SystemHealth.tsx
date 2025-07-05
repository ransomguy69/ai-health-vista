
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/StatusBadge';
import { Cpu, HardDrive, MemoryStick, Activity } from 'lucide-react';

interface SystemHealthProps {
  metrics?: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    timestamp: string;
  };
  status: 'healthy' | 'warning' | 'critical';
}

export const SystemHealth = ({ metrics, status }: SystemHealthProps) => {
  if (!metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (usage: number) => {
    if (usage > 80) return 'text-red-500';
    if (usage > 60) return 'text-amber-500';
    return 'text-green-500';
  };

  const getProgressColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500';
    if (usage > 60) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-6 w-6 text-blue-600" />
            System Health
          </CardTitle>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CPU Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">CPU</span>
              </div>
              <span className={`font-bold text-lg ${getStatusColor(metrics.cpu_usage)}`}>
                {metrics.cpu_usage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={metrics.cpu_usage} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, ${getProgressColor(metrics.cpu_usage)} ${metrics.cpu_usage}%, #e5e7eb ${metrics.cpu_usage}%)`
              }}
            />
          </div>

          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">Memory</span>
              </div>
              <span className={`font-bold text-lg ${getStatusColor(metrics.memory_usage)}`}>
                {metrics.memory_usage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={metrics.memory_usage} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, ${getProgressColor(metrics.memory_usage)} ${metrics.memory_usage}%, #e5e7eb ${metrics.memory_usage}%)`
              }}
            />
          </div>

          {/* Disk Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">Disk</span>
              </div>
              <span className={`font-bold text-lg ${getStatusColor(metrics.disk_usage)}`}>
                {metrics.disk_usage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={metrics.disk_usage} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, ${getProgressColor(metrics.disk_usage)} ${metrics.disk_usage}%, #e5e7eb ${metrics.disk_usage}%)`
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
