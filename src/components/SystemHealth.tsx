
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Activity, Cpu, HardDrive, MemoryStick } from 'lucide-react';

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

interface SystemHealthProps {
  metrics?: SystemMetrics;
  status: 'healthy' | 'warning' | 'critical';
}

export const SystemHealth = ({ metrics, status }: SystemHealthProps) => {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Loading system metrics...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </div>
          <StatusBadge status={status} size="lg" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CPU Usage */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metrics.cpu_usage > 80 ? 'bg-red-500' : 
                      metrics.cpu_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(metrics.cpu_usage, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {metrics.cpu_usage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <MemoryStick className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metrics.memory_usage > 80 ? 'bg-red-500' : 
                      metrics.memory_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(metrics.memory_usage, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {metrics.memory_usage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Disk Usage */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <HardDrive className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disk Usage</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metrics.disk_usage > 85 ? 'bg-red-500' : 
                      metrics.disk_usage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(metrics.disk_usage, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {metrics.disk_usage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date(metrics.timestamp).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
