export interface File {
  name: string;
  type: 'file' | 'directory';
  createdAt: Date;
  content?: string;
  children?: File[];
}

export interface Process {
  id: number;
  name: string;
  status: 'running' | 'stopped' | 'waiting';
  cpu: number;
  memory: number;
  startTime: Date;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string;
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsed: number;
  memoryTotal: number;
  storageUsed: number;
  storageTotal: number;
  uptime: number;
}