
import { useEffect, useState } from 'react';
import { SystemHealth } from '@/components/SystemHealth';
import { MetricsTable } from '@/components/MetricsTable';
import { AIDecisions } from '@/components/AIDecisions';
import { apiService } from '@/services/apiService';

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

interface AIDecision {
  id: string;
  action: string;
  target: string;
  reason: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

const Index = () => {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  const fetchData = async () => {
    try {
      const [metricsData, decisionsData] = await Promise.all([
        apiService.getRecentMetrics(),
        apiService.getAIDecisions()
      ]);
      
      setMetrics(metricsData);
      setDecisions(decisionsData);
      
      // Determine system status based on latest metrics
      if (metricsData.length > 0) {
        const latest = metricsData[0];
        if (latest.cpu_usage > 80 || latest.memory_usage > 80 || latest.disk_usage > 85) {
          setSystemStatus('critical');
        } else if (latest.cpu_usage > 60 || latest.memory_usage > 60 || latest.disk_usage > 70) {
          setSystemStatus('warning');
        } else {
          setSystemStatus('healthy');
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AIOps Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time system monitoring with AI-powered insights
          </p>
        </div>

        {/* System Health Overview */}
        <div className="mb-8">
          <SystemHealth 
            metrics={metrics[0]} 
            status={systemStatus}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metrics Table - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <MetricsTable metrics={metrics} />
          </div>

          {/* AI Decisions Panel */}
          <div className="lg:col-span-1">
            <AIDecisions decisions={decisions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
