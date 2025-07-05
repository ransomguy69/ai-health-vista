
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
      console.log('Falling back to mock data...');
      
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
    try {
      return await this.makeRequest<SystemMetrics[]>('/metrics/recent');
    } catch (error) {
      console.log('Using mock metrics data');
      return this.getMockMetrics();
    }
  }

  async getAIDecisions(): Promise<AIDecision[]> {
    try {
      return await this.makeRequest<AIDecision[]>('/ai/decisions');
    } catch (error) {
      console.log('Using mock AI decisions data');
      return this.getMockDecisions();
    }
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
        cpu_usage: 45 + Math.random() * 40, // 45-85%
        memory_usage: 30 + Math.random() * 50, // 30-80%
        disk_usage: 45 + Math.random() * 30, // 45-75%
        timestamp,
        top_processes: [
          { name: 'nginx', cpu: 15 + Math.random() * 35, memory: 10 + Math.random() * 20 },
          { name: 'postgres', cpu: 8 + Math.random() * 25, memory: 25 + Math.random() * 35 },
          { name: 'redis', cpu: 5 + Math.random() * 15, memory: 5 + Math.random() * 20 },
          { name: 'node', cpu: 20 + Math.random() * 40, memory: 15 + Math.random() * 30 },
          { name: 'python', cpu: 12 + Math.random() * 23, memory: 18 + Math.random() * 22 },
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
