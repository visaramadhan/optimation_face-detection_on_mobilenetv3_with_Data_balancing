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
    architecture: string;
    inputSize: number;
    augmentation: boolean;
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
  formula?: string;
  details?: string[];
}

export interface OptimizationSession {
  id: string;
  config: OptimizationConfig;
  steps: OptimizationStep[];
  status: 'idle' | 'running' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  results?: ModelResults;
}

export interface ModelResults {
  precision: number;
  recall: number;
  f1Score: number;
  mAP: number;
  accuracy: number;
  loss: number;
  trainingTime: number;
  modelSize: number;
  inferenceTime: number;
}

export interface ModelComparison {
  id: string;
  name: string;
  config: OptimizationConfig;
  results: ModelResults;
  timestamp: Date;
}

export interface DatasetSample {
  id: string;
  imageUrl: string;
  label: string;
  annotations: BoundingBox[];
  metadata: {
    width: number;
    height: number;
    faces: number;
  };
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
}

export interface TestResult {
  id: string;
  imageUrl: string;
  originalImage: string;
  detections: BoundingBox[];
  processingTime: number;
  confidence: number;
  timestamp: Date;
}