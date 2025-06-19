import React, { useState, useRef } from 'react';
import { 
  Brain, 
  Database, 
  BarChart3, 
  Settings, 
  PlayCircle, 
  CheckCircle,
  ArrowRight,
  Download,
  Upload,
  Target,
  TrendingUp,
  Eye,
  Zap,
  FileUp,
  Loader
} from 'lucide-react';
import { useOptimization } from '../hooks/useOptimization';
import { OptimizationProgress } from './OptimizationProgress';
import { OptimizationConfig } from '../types/optimization';

interface StageProps {
  number: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  icon: React.ReactNode;
  details: string[];
}

const StageCard: React.FC<StageProps> = ({ number, title, description, status, icon, details }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getCardStyle = () => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'active': return 'border-blue-200 bg-blue-50 shadow-lg';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${getCardStyle()}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getStatusColor()}`}>
          {status === 'completed' ? <CheckCircle size={20} /> : number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {expanded ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
            <ArrowRight className={`transition-transform ${expanded ? 'rotate-90' : ''}`} size={16} />
          </button>
          {expanded && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <ul className="space-y-2">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataBalancingConfig: React.FC<{
  config: OptimizationConfig;
  onChange: (config: OptimizationConfig) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (updates: Partial<OptimizationConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateDataBalancing = (updates: Partial<OptimizationConfig['dataBalancing']>) => {
    updateConfig({
      dataBalancing: { ...config.dataBalancing, ...updates }
    });
  };

return (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <Settings className="text-blue-600" />
      Data Balancing Configuration
    </h3>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Oversampling Technique
        </label>
        <select 
          value={config.dataBalancing.oversamplingTechnique}
          onChange={(e) => updateDataBalancing({ oversamplingTechnique: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="SMOTE">SMOTE (Synthetic Minority Oversampling)</option>
          <option value="ADASYN">ADASYN (Adaptive Synthetic)</option>
          <option value="BorderlineSMOTE">Borderline-SMOTE</option>
          <option value="RandomOverSampler">Random Oversampling</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Undersampling Technique
        </label>
        <select 
          value={config.dataBalancing.undersamplingTechnique}
          onChange={(e) => updateDataBalancing({ undersamplingTechnique: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="RandomUnderSampler">Random Undersampling</option>
          <option value="TomekLinks">Tomek Links</option>
          <option value="EditedNearestNeighbours">Edited Nearest Neighbours</option>
          <option value="NearMiss">Near Miss</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Oversampling Ratio: {config.dataBalancing.oversamplingRatio}x
        </label>
        <input 
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={config.dataBalancing.oversamplingRatio}
          onChange={(e) => updateDataBalancing({ oversamplingRatio: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Undersampling Ratio: {config.dataBalancing.undersamplingRatio}x
        </label>
        <input 
          type="range"
          min="0.5"
          max="1"
          step="0.05"
          value={config.dataBalancing.undersamplingRatio}
          onChange={(e) => updateDataBalancing({ undersamplingRatio: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">Current Configuration:</h4>
      <div className="text-blue-700 space-y-1 text-sm">
        <p>• Oversampling: {config.dataBalancing.oversamplingTechnique} with ratio {config.dataBalancing.oversamplingRatio}x</p>
        <p>• Undersampling: {config.dataBalancing.undersamplingTechnique} with ratio {config.dataBalancing.undersamplingRatio}x</p>
        <p>• Estimated balance improvement: ~{((config.dataBalancing.oversamplingRatio + config.dataBalancing.undersamplingRatio) / 2 * 100 - 100).toFixed(1)}%</p>
      </div>
    </div>
  </div>
);
};

const MetricsDashboard: React.FC<{ session?: any }> = ({ session }) => {
  const metrics = [
    { 
      name: 'Precision', 
      value: session?.results?.precision || 0.87, 
      target: 0.90, 
      icon: <Target size={20} /> 
    },
    { 
      name: 'Recall', 
      value: session?.results?.recall || 0.84, 
      target: 0.88, 
      icon: <Eye size={20} /> 
    },
    { 
      name: 'F1-Score', 
      value: session?.results?.f1Score || 0.85, 
      target: 0.89, 
      icon: <TrendingUp size={20} /> 
    },
    { 
      name: 'mAP', 
      value: session?.results?.mAP || 0.82, 
      target: 0.85, 
      icon: <Zap size={20} /> 
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart3 className="text-green-600" />
        Metrik Performa
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="font-medium text-gray-800">{metric.name}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {(metric.value * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metric.value * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Saat ini: {(metric.value * 100).toFixed(1)}%</span>
              <span>Target: {(metric.target * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OptimizationDashboard: React.FC = () => {
  const { session, isLoading, error, startOptimization, stopOptimization, exportConfig, importConfig } = useOptimization();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [config, setConfig] = useState<OptimizationConfig>({
    dataBalancing: {
      oversamplingTechnique: 'SMOTE',
      undersamplingTechnique: 'RandomUnderSampler',
      oversamplingRatio: 1.5,
      undersamplingRatio: 0.8
    },
    model: {
      learningRate: 0.001,
      batchSize: 32,
      epochs: 50,
      optimizer: 'Adam'
    },
    dataset: {
      trainSplit: 0.7,
      validationSplit: 0.2,
      testSplit: 0.1
    }
  });

  const handleStartOptimization = async () => {
    try {
      await startOptimization(config);
    } catch (err) {
      console.error('Error starting optimization:', err);
    }
  };

  const handleExportConfig = () => {
    exportConfig(config);
  };

  const handleImportConfig = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedConfig = await importConfig(file);
        setConfig(importedConfig);
      } catch (err) {
        console.error('Error importing config:', err);
      }
    }
  };

  const stages = [
    {
      number: 1,
      title: "Setup Model & Analisis",
      description: "Inisialisasi model RetinaFace-Ghost dan analisis performa saat ini",
      status: session?.steps[0]?.status === 'completed' ? 'completed' as const : 
              session?.steps[0]?.status === 'running' ? 'active' as const : 'pending' as const,
      icon: <Brain className="text-blue-600" size={20} />,
      details: [
        "Clone repository RetinaFace-Ghost dari GitHub",
        "Load pre-trained weights MobileNetV3",
        "Analisis arsitektur model dan jumlah parameter",
        "Evaluasi performa baseline pada test dataset",
        "Identifikasi bottleneck dan area yang perlu diperbaiki"
      ]
    },
    {
      number: 2,
      title: "Persiapan Dataset",
      description: "Persiapkan dan analisis dataset deteksi wajah Anda",
      status: session?.steps[1]?.status === 'completed' ? 'completed' as const : 
              session?.steps[1]?.status === 'running' ? 'active' as const : 'pending' as const,
      icon: <Database className="text-green-600" size={20} />,
      details: [
        "Load dan inspeksi struktur dataset",
        "Analisis distribusi kelas (wajah vs non-wajah)",
        "Identifikasi kelas yang tidak seimbang dan edge cases",
        "Bagi dataset ke training, validation, dan test sets",
        "Buat data pipeline dengan augmentasi yang tepat"
      ]
    },
    {
      number: 3,
      title: "Implementasi Data Balancing",
      description: "Terapkan teknik oversampling dan undersampling",
      status: session?.steps[2]?.status === 'completed' ? 'completed' as const : 
              session?.steps[2]?.status === 'running' ? 'active' as const : 'pending' as const,
      icon: <Settings className="text-purple-600" size={20} />,
      details: [
        "Implementasi SMOTE untuk oversampling minority class",
        "Terapkan Random/Tomek Links undersampling untuk majority class",
        "Konfigurasi rasio sampling berdasarkan distribusi kelas",
        "Validasi kualitas dataset yang sudah seimbang",
        "Buat balanced data loaders untuk training"
      ]
    },
    {
      number: 4,
      title: "Fine-tuning Model",
      description: "Optimasi MobileNetV3 dengan dataset yang seimbang",
      status: session?.steps[3]?.status === 'completed' ? 'completed' as const : 
              session?.steps[3]?.status === 'running' ? 'active' as const : 'pending' as const,
      icon: <PlayCircle className="text-orange-600" size={20} />,
      details: [
        "Setup transfer learning dari pre-trained weights",
        "Konfigurasi learning rate schedule dan optimizer",
        "Implementasi strategi data augmentation",
        "Training model dengan dataset yang seimbang",
        "Monitor training metrics dan early stopping"
      ]
    },
    {
      number: 5,
      title: "Evaluasi Performa",
      description: "Evaluasi performa model yang sudah dioptimasi",
      status: session?.steps[4]?.status === 'completed' ? 'completed' as const : 
              session?.steps[4]?.status === 'running' ? 'active' as const : 'pending' as const,
      icon: <BarChart3 className="text-red-600" size={20} />,
      details: [
        "Hitung metrik precision, recall, F1-score",
        "Hitung mAP (mean Average Precision)",
        "Analisis confusion matrix dan error cases",
        "Bandingkan performa dengan baseline model",
        "Validasi pada berbagai skenario deteksi wajah"
      ]
    },
    {
      number: 6,
      title: "Deployment Model",
      description: "Deploy model yang sudah dioptimasi untuk penggunaan produksi",
      status: session?.steps[5]?.status === 'completed' ? 'completed' as const : 
              session?.steps[5]?.status === 'running' ? 'active' as const : 'pending' as const,
      icon: <Upload className="text-indigo-600" size={20} />,
      details: [
        "Konversi model ke format deployment (ONNX/TensorRT)",
        "Optimasi kecepatan inference dan penggunaan memori",
        "Setup infrastruktur model serving",
        "Implementasi batch processing capabilities",
        "Buat API endpoints untuk layanan deteksi wajah"
      ]
    }
  ];

  const completedSteps = session?.steps.filter(s => s.status === 'completed').length || 0;
  const totalSteps = stages.length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Optimasi Deteksi Wajah MobileNetV3
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Workflow Comprehensif for optimation accuracy face detection use RetinaFace-Ghost Model MobileNetV3 with Balancing Data Technique
          </p>
          <p className="text-xl font-bold text-gray-800 max-w-3xl mx-auto">
            by: M. Visa Ramadhan
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <a 
              href="https://github.com/ppogg/Retinaface_Ghost"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download size={20} />
              Repository RetinaFace-Ghost
            </a>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Progress Overview */}
        <div className="mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Progress Proyek</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
              </div>
              <span className="text-lg font-semibold text-gray-700">{overallProgress}%</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedSteps}</div>
                <div className="text-green-700">Selesai</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {session?.steps.filter(s => s.status === 'running').length || 0}
                </div>
                <div className="text-blue-700">Sedang Berjalan</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {totalSteps - completedSteps - (session?.steps.filter(s => s.status === 'running').length || 0)}
                </div>
                <div className="text-gray-700">Menunggu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Progress */}
        {session && (
          <div className="mb-12">
            <OptimizationProgress session={session} onStop={stopOptimization} />
          </div>
        )}

        {/* Configuration and Metrics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <DataBalancingConfig config={config} onChange={setConfig} />
          <MetricsDashboard session={session} />
        </div>

        {/* Optimization Stages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Worflow Optimation
          </h2>
          <div className="space-y-6">
            {stages.map((stage) => (
              <StageCard key={stage.number} {...stage} />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleStartOptimization}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="animate-spin" size={20} /> : <PlayCircle size={20} />}
              {isLoading ? 'Sedang Berjalan...' : 'Mulai Optimasi'}
            </button>
            
            <button 
              onClick={handleExportConfig}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-semibold"
            >
              <Download size={20} />
              Eksport Configuration
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-semibold"
            >
              <FileUp size={20} />
              Import Configuration
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
