export interface OptimizationConfig {
  dataBalancing: {
    oversamplingTechnique: string;
    undersamplingTechnique: string;
    oversamplingRatio: number;
    undersamplingRatio: number;
  };
  model: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    optimizer: string;
  };
  dataset: {
    trainSplit: number;
    validationSplit: number;
    testSplit: number;
  };
}

export interface OptimizationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  logs: string[];
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface OptimizationSession {
  id: string;
  config: OptimizationConfig;
  steps: OptimizationStep[];
  status: 'idle' | 'running' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  results?: {
    precision: number;
    recall: number;
    f1Score: number;
    mAP: number;
  };
}