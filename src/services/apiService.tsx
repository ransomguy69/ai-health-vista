
// API service for connecting to FastAPI backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

class APIService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Return mock data for development/demo purposes
      if (endpoint === '/metrics/recent') {
        return this.getMockMetrics() as T;
      } else if (endpoint === '/ai/decisions') {
        return this.getMockDecisions() as T;
      }
      
      throw error;
    }
  }

  async getRecentMetrics(): Promise<SystemMetrics[]> {
    return this.makeRequest<SystemMetrics[]>('/metrics/recent');
  }

  async getAIDecisions(): Promise<AIDecision[]> {
    return this.makeRequest<AIDecision[]>('/ai/decisions');
  }

  async takeAction(action: string, target: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/take-action', {
      method: 'POST',
      body: JSON.stringify({ action, target }),
    });
  }

  // Mock data for development/demo purposes
  private getMockMetrics(): SystemMetrics[] {
    const now = new Date();
    const metrics: SystemMetrics[] = [];
    
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 60000).toISOString();
      metrics.push({
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100,
        disk_usage: 45 + Math.random() * 30,
        timestamp,
        top_processes: [
          { name: 'nginx', cpu: Math.random() * 50, memory: Math.random() * 30 },
          { name: 'postgres', cpu: Math.random() * 40, memory: Math.random() * 60 },
          { name: 'redis', cpu: Math.random() * 20, memory: Math.random() * 25 },
          { name: 'node', cpu: Math.random() * 70, memory: Math.random() * 45 },
          { name: 'python', cpu: Math.random() * 35, memory: Math.random() * 40 },
        ],
      });
    }
    
    return metrics;
  }

  private getMockDecisions(): AIDecision[] {
    const now = new Date();
    const actions = ['Kill Process', 'Restart Container', 'Scale Up', 'Reduce Load', 'Alert Admin'];
    const targets = ['nginx-container', 'postgres-db', 'web-server', 'api-gateway', 'cache-service'];
    const reasons = [
      'High CPU usage detected',
      'Memory threshold exceeded',
      'Process not responding',
      'Load balancing required',
      'Resource optimization needed',
    ];
    const statuses: ('success' | 'pending' | 'failed')[] = ['success', 'pending', 'failed'];

    return Array.from({ length: 8 }, (_, i) => ({
      id: `decision-${i}`,
      action: actions[Math.floor(Math.random() * actions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      timestamp: new Date(now.getTime() - i * 300000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
  }
}

export const apiService = new APIService();
